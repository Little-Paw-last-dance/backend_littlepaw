import { auth } from "../config/firebaseConfig";
import typeORM from "../db/dataSource";
import Role from "../entity/Roles";
import User from "../entity/User";
import HttpException from "../exception/HttpException";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { instanceUserResponse } from "../model/dto/userResponse";
import { insertUser } from "../repository/userRepository";
import { getUserByEmail } from "../repository/userRepository";

export const registerUser = async (user: UserRegisterDTO, roles: Role[]) => {
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

        return insertUser(user, queryRunner, roles)
          .then(async (userDB) => {
            await queryRunner.commitTransaction();
            resolve(instanceUserResponse(userDB));
          })
          .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            auth.deleteUser(userRecord.uid);
            reject(error);
          })
          .finally(async () => {
            await queryRunner.release();
          });

      })
      .catch((error) => reject(error));
  });
};


export const getUserInfo = async (email: string) => {
  return new Promise((resolve, reject) => {
    getUserByEmail(email, typeORM.createQueryRunner())
      .then((user) => {
        if (user) {
          resolve(instanceUserResponse(user));
        } else {
          reject(new HttpException("User not found", 404));
        }
      })
      .catch((error) => reject(error));
  });
};
