import Shelters from "../entity/Shelters";
import User from "../entity/User";
import HttpException from "../exception/HttpException";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import { In, QueryRunner } from "typeorm";
import { ShelterUpdateDTO } from "../model/dto/shelterUpdateDTO";
import { deleteFiles } from "../util/util";

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
        throw new HttpException("Only users with admin or root role can create shelters", 400);
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

export const updateShelter = async (id: number, shelterUpdateDTO: ShelterUpdateDTO, queryRunner: QueryRunner, userEmail:string,photoPath?:string): Promise<Shelters | null> => {

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
        throw new HttpException("Only users with admin or root role can create shelters", 400);
    }

    const shelter = await queryRunner.manager.findOne(Shelters, { where: { id } });
    if(!shelter) {
        throw new HttpException("Shelter not found", 404);
    }
    if(photoPath) {
        await deleteFiles([shelter.photo]);
    }
    shelter.name = shelterUpdateDTO.name || shelter.name;
    shelter.location = shelterUpdateDTO.location || shelter.location;
    shelter.urlPage = shelterUpdateDTO.urlPage || shelter.urlPage;
    shelter.countryCode = shelterUpdateDTO.countryCode || shelter.countryCode;
    shelter.phone = shelterUpdateDTO.phone || shelter.phone;
    shelter.photo = photoPath || shelter.photo;
    
    await queryRunner.manager.createQueryBuilder().update(Shelters).set(shelter).where("id = :id", { id }).execute().then(() => shelter);
    return await getShelterById(id, queryRunner);
}


export const getShelterById = async (id: number, queryRunner: QueryRunner): Promise<Shelters | null> => {
    return await queryRunner.manager.findOne(Shelters, { where: { id } });
}

export const getAllShelters = async (queryRunner: QueryRunner): Promise<Shelters[]> => {
    return await queryRunner.manager.find(Shelters);
}

export const deleteShelter = async (id: number, queryRunner: QueryRunner, userEmail:string): Promise<Shelters | null> => {
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
        throw new HttpException("Only users with admin or root role can create shelters", 400);
    }

    const shelter = await queryRunner.manager.findOne(Shelters, { where: { id } });
    if(!shelter) {
        throw new HttpException("Shelter not found", 404);
    }
    return await queryRunner.manager.remove(shelter);
}