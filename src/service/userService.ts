import { auth } from "../config/firebaseConfig";
import typeORM from "../db/dataSource";
import HttpException from "../exception/HttpException";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { instanceUserResponse } from "../model/dto/userResponse";
import { insertUser } from "../repository/userRepository";

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

        return insertUser(user, queryRunner)
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

