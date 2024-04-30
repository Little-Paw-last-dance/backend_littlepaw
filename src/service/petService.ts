import typeORM from "../db/dataSource";
import {v4 as uuidv4} from 'uuid';
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { findPetsByShelterId, insertPetPostWithPetAndPhotos, insertPetPostWithPetAndPhotosToShelter } from "../repository/petRepository";
import { uploadFilesB64AndReturnPaths } from "../util/util";
import { getSignedUrlByPath } from "../repository/s3Repository";
import { instanceOfPetPostResponseDTO } from "../model/dto/petPostResponseDTO";
import HttpException from "../exception/HttpException";
import Role from "../entity/Roles";
import { instanceOfPetShelterPostResponseDTO } from "../model/dto/petShelterPostResponseDTO";
import { getShelterById } from "../repository/shelterRepository";
import { instanceOfGetAllPetsInShelterResponseDTO } from "../model/dto/getAllPetsInShelterResponseDTO";

export const postAPet = async (petPost: PetPostRequestDTO, userEmail: string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        const photosPath = await uploadFilesB64AndReturnPaths(petPost.photos, () => `${userEmail}/pets/${petPost.name + "_" + uuidv4()}`);
        const petPostEntity = await insertPetPostWithPetAndPhotos(petPost, photosPath, userEmail, queryRunner);

        if (!petPostEntity) {
            throw new Error("Error while inserting pet post");
        }

        const photosURLs = await Promise.all(photosPath.map(async (path) => await getSignedUrlByPath(path)));

        const response = instanceOfPetPostResponseDTO(petPostEntity, photosURLs);

        await queryRunner.commitTransaction();

        return response;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
};

export const postAPetToShelter = async (petPost: PetPostRequestDTO, shelterId: number, roles: Role[]) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();

    const hasAdminRole = roles.some((role) => role.roleName === "admin");
    const isRoot = roles.some((role) => role.roleName === "root");

    if (!hasAdminRole && !isRoot) {
        throw new HttpException("Only users with admin or root role can create users", 400);
    }

    try {
        const photosPath = await uploadFilesB64AndReturnPaths(petPost.photos, () => `${shelterId}/pets/${petPost.name + "_" + uuidv4()}`);
        const petShelterPostEntity = await insertPetPostWithPetAndPhotosToShelter(petPost, photosPath, shelterId, queryRunner);

        if (!petShelterPostEntity) {
            throw new Error("Error while inserting pet post");
        }

        const photosURLs = await Promise.all(photosPath.map(async (path) => await getSignedUrlByPath(path)));
        
        petShelterPostEntity.shelter.photo = await getSignedUrlByPath(petShelterPostEntity.shelter.photo);

        const response = instanceOfPetShelterPostResponseDTO(petShelterPostEntity, photosURLs);

        await queryRunner.commitTransaction();

        return response;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
}

export const getAllShelterPets = async (shelterId: number) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();

    const shelter = await getShelterById(shelterId, queryRunner);
    const shelterPets = await findPetsByShelterId(shelterId, queryRunner);

    if (!shelter) {
        throw new HttpException("Shelter not found", 404);
    }

    const response = await instanceOfGetAllPetsInShelterResponseDTO(shelterPets, shelter);

    return response;
}