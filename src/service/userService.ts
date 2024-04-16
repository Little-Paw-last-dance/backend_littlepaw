import { auth } from "../config/firebaseConfig";
import typeORM from "../db/dataSource";
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
        insertUser(user, queryRunner)
          .then(async (userDB) => {
            await queryRunner.commitTransaction();
            resolve(instanceUserResponse(userDB));
          })
          .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            auth.deleteUser(userRecord.uid);
            console.error(error);
            if (error?.original?.code !== "ER_DUP_ENTRY") {
              reject({ message: "Error creating user on database" });
            }
            reject({ message: "User email already exists on database" });
          })
          .finally(async () => {
            await queryRunner.release();
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/email-already-exists") {
          reject({ message: "User email already exists on firebase" });
        }
        reject({ message: "Error creating user on firebase" });
      });
  });
};
