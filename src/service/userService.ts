import { auth } from "../config/firebaseConfig";
import logger from "../config/logger";
import typeORM from "../db/dataSource";
import Role from "../entity/Roles";
import HttpException from "../exception/HttpException";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { UserRegisterRolesDTO } from "../model/dto/userRegisterRolesDTO";
import { instanceUserResponse } from "../model/dto/userResponse";
import { UserUpdateDTO } from "../model/dto/userUpdateDTO";
import { FirebaseUser } from "../model/firebaseUser";
import { deleteUserInfoByEmail, insertUser, insertUserWithRoles, updateUserInfoByEmail } from "../repository/userRepository";
import { getUserByEmail } from "../repository/userRepository";

export const registerUserWithRoles = async (user: UserRegisterRolesDTO, roles: Role[]) => {
  return new Promise((resolve, reject) => {
    auth
      .createUser({
        email: user.email,
        emailVerified: false,
        phoneNumber: "+" + user.countryCode + user.phone,
        displayName: user.names + " " + user.paternalSurname,
        disabled: false,
        password: user.password,
      })
      .then(async (userRecord) => {

        const queryRunner = typeORM.createQueryRunner();
        await queryRunner.startTransaction();
        logger.info('Starting transaction to register a user with roles.');

        return insertUserWithRoles(user, queryRunner, roles)
          .then(async (userDB) => {
            await queryRunner.commitTransaction();
            logger.info('Transaction committed successfully.');
            resolve(instanceUserResponse(userDB));
          })
          .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            logger.info('Transaction rolled back due to error.');
            auth.deleteUser(userRecord.uid);
            reject(error);
          })
          .finally(async () => {
            await queryRunner.release();
            logger.info('Query runner released.');
          });

      })
      .catch((error) => reject(error));
      logger.error('Error registering user with roles.');
  });
};

export const registerUser = async (user: UserRegisterDTO) => {
  return new Promise((resolve, reject) => {
    auth
      .createUser({
        email: user.email,
        emailVerified: false,
        phoneNumber: "+" + user.countryCode + user.phone,
        displayName: user.names + " " + user.paternalSurname,
        disabled: false,
        password: user.password,
      })
      .then(async (userRecord) => {

        const queryRunner = typeORM.createQueryRunner();
        await queryRunner.startTransaction();
        logger.info('Starting transaction to register a user.');

        return insertUser(user, queryRunner)
          .then(async (userDB) => {
            await queryRunner.commitTransaction();
            logger.info('Transaction committed successfully.');
            resolve(instanceUserResponse(userDB));
          })
          .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            logger.info('Transaction rolled back due to error.');
            auth.deleteUser(userRecord.uid);
            reject(error);
          })
          .finally(async () => {
            await queryRunner.release();
            logger.info('Query runner released.');
          });

      })
      .catch((error) => reject(error));
      logger.error('Error registering user.');
  });
};


export const getUserInfo = async (email: string) => {
  return new Promise((resolve, reject) => {
    const queryRunner = typeORM.createQueryRunner();
    getUserByEmail(email, queryRunner)
      .then((user) => {
        if (user) {
          resolve(instanceUserResponse(user));
        } else {
          reject(new HttpException("User not found", 404));
        }
      })
      .catch((error) => {
        logger.error('Error getting user info.');
        reject(error)}
      ).finally(async () => await queryRunner.release());
      logger.info('Query runner released.');
  });
};

export const updateUserInfo = async (email: string, user: UserUpdateDTO) => {
  return new Promise((resolve, reject) => {
    const queryRunner = typeORM.createQueryRunner();
    updateUserInfoByEmail(email, user, queryRunner)
      .then((user) => {
        if (user) {
          resolve(instanceUserResponse(user));
        } else {
          reject(new HttpException("User not found", 404));
        }
      })
      .catch((error) => reject(error))
      .finally(async () => await queryRunner.release());
      logger.info('Query runner released.');
  });
};

export const deleteUserInfo = async (firebaseUser: FirebaseUser) => {
  const queryRunner = typeORM.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    const user = await deleteUserInfoByEmail(firebaseUser.email, queryRunner);
    if (user) {
      await auth.deleteUser(firebaseUser.uid);
      logger.info('User deleted successfully.');
      await queryRunner.commitTransaction();
      logger.info('Transaction committed successfully.');
      return instanceUserResponse(user);
    } else {
      await queryRunner.rollbackTransaction();
      logger.info('Transaction rolled back due to error.');
      throw new HttpException("User not found", 404);
    }
  } catch (error) {
    logger.error('Error deleting user info.');
    throw error;
  } finally {
    await queryRunner.release();
    logger.info('Query runner released.');
  }
};