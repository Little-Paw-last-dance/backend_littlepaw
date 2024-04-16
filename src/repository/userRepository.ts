import User from "../entity/User";
import Role from "../entity/Roles";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { In, QueryRunner } from "typeorm";
import HttpException from "../exception/HttpException";

export const insertUser = async (userDTO: UserRegisterDTO, queryRunner: QueryRunner, roles: Role[]): Promise<User> => {

    if (userDTO.roles.includes("root")) {
        throw new HttpException("Role root is not allowed to be assigned to users", 400);
    }

    const hasAdminRole = roles.some((role) => role.roleName === "admin");
    const isRoot = roles.some((role) => role.roleName === "root");

    if (!hasAdminRole && !isRoot) {
        throw new HttpException("Only users with admin or root role can create users", 400);
    }

    const rolesFound = await queryRunner.manager.find(Role, {
        where: {
            roleName: In(userDTO.roles)
        }
    });

    const rolesNotfound = userDTO.roles.filter((role) => {
        return !rolesFound.find((roleFound) => roleFound.roleName === role);
    });

    if (rolesNotfound.length > 0) {
        throw new HttpException("Roles not found: " + rolesNotfound.join(", "), 400);
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


export const getUserByEmail = async (email: string, queryRunner: QueryRunner): Promise<User | null> => {
    return await queryRunner.manager.findOne<User>(User, { where: { email }, relations: ["roles"] });
}