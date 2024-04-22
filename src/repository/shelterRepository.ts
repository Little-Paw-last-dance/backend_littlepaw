import Shelters from "../entity/Shelters";
import User from "../entity/User";
import HttpException from "../exception/HttpException";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import { In, QueryRunner } from "typeorm";

export const insertShelter = async (shelterDTO: ShelterRegisterDTO, queryRunner: QueryRunner, photoPath:string, userEmail:string): Promise<Shelters> => {

    const user = await queryRunner.manager.findOne<User>(User, { where: { email:userEmail }, relations: ["roles"] });

    if (!user) {
        throw new Error("User not found");
    }

    if(!user.roles) {
        throw new HttpException("User has no roles", 400);
    }

    const hasAdminRole = user.roles.some((role) => role.roleName === "admin");
    const isRoot = user.roles.some((role) => role.roleName === "root");

    if (!hasAdminRole && !isRoot) {
        throw new HttpException("Only users with admin or root role can create users", 400);
    }

    const shelter = new Shelters();
    shelter.name = shelterDTO.name;
    shelter.location = shelterDTO.location;
    shelter.urlPage = shelterDTO.urlPage;
    shelter.countryCode = shelterDTO.countryCode;
    shelter.phone = shelterDTO.phone;
    shelter.photo = photoPath;

    return await queryRunner.manager.save(Shelters, shelter);

}