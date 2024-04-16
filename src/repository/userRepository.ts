import User from "../entity/User";
import Role from "../entity/Roles";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { In, QueryRunner } from "typeorm";

export const insertUser = async (userDTO: UserRegisterDTO, queryRunner: QueryRunner): Promise<User> => {

    const rolesFound = await queryRunner.manager.find(Role, {
        where: {
            roleName: In(userDTO.roles)
        }
    });

    const rolesNotfound = userDTO.roles.filter((role) => {
        return !rolesFound.find((roleFound) => roleFound.roleName === role);
    });

    if (rolesNotfound.length > 0) {
        throw new Error("Roles not found: " + rolesNotfound.join(", "));
    }

    const user = new User();
    user.email = userDTO.email;
    user.names = userDTO.names;
    user.paternalSurname = userDTO.paternalSurname;
    user.maternalSurname = userDTO.maternalSurname;
    user.countryCode = userDTO.countryCode;
    user.phone = userDTO.phone;
    user.age = userDTO.age;
    user.city = userDTO.city;
    user.roles = rolesFound;

    return await queryRunner.manager.save(User, user);
}
