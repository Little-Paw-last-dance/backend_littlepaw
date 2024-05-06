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
import { findAllPetPosts, getShelterById } from "../repository/shelterRepository";
import { instanceOfGetAllPetsInShelterResponseDTO } from "../model/dto/getAllPetsInShelterResponseDTO";
import { instanceOfGetAllPetsPostsResponseDTO } from "../model/dto/getAllPetPostsResponseDTO";
import logger from "../config/logger";

export const postAPet = async (petPost: PetPostRequestDTO, userEmail: string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();
    logger.info('Starting transaction to post a pet.');

    try {
        logger.info('Starting transaction to post a pet to shelter.');
        const photosPath = await uploadFilesB64AndReturnPaths(petPost.photos, () => `${userEmail}/pets/${petPost.name + "_" + uuidv4()}`);
        const petPostEntity = await insertPetPostWithPetAndPhotos(petPost, photosPath, userEmail, queryRunner);

        if (!petPostEntity) {
            logger.error('Failed to insert pet post.');
            throw new Error("Error while inserting pet post");
        }

        const photosURLs = await Promise.all(photosPath.map(async (path) => await getSignedUrlByPath(path)));

        const response = instanceOfPetPostResponseDTO(petPostEntity, photosURLs);

        await queryRunner.commitTransaction();
        logger.info('Transaction committed successfully.');

        return response;
      } catch (error) {
        logger.error('Error during pet post to shelter transaction: %o', error);
        await queryRunner.rollbackTransaction();
        logger.info('Transaction rolled back due to error.');
        throw error;
      } finally {
        await queryRunner.release();
        logger.info('Query runner released.');
      }
};

export const postAPetToShelter = async (petPost: PetPostRequestDTO, shelterId: number, roles: Role[]) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();
    logger.info('Starting transaction to post a pet to a shelter.');

    const hasAdminRole = roles.some((role) => role.roleName === "admin");
    const isRoot = roles.some((role) => role.roleName === "root");

    if (!hasAdminRole && !isRoot) {
        logger.error('Authorization error: User does not have required roles.');
        throw new HttpException("Only users with admin or root role can create users", 400);
    }

    try {
        logger.info('Starting transaction to post a pet to shelter.');
        const photosPath = await uploadFilesB64AndReturnPaths(petPost.photos, () => `${shelterId}/pets/${petPost.name + "_" + uuidv4()}`);
        const petShelterPostEntity = await insertPetPostWithPetAndPhotosToShelter(petPost, photosPath, shelterId, queryRunner);

        if (!petShelterPostEntity) {
            logger.error('Failed to insert pet post to shelter.');
            throw new Error("Error while inserting pet post");
        }

        const photosURLs = await Promise.all(photosPath.map(async (path) => await getSignedUrlByPath(path)));
        
        petShelterPostEntity.shelter.photo = await getSignedUrlByPath(petShelterPostEntity.shelter.photo);

        const response = instanceOfPetShelterPostResponseDTO(petShelterPostEntity, photosURLs);

        await queryRunner.commitTransaction();
        logger.info('Transaction committed successfully.');

        return response;
      } catch (error) {
        logger.error('Error during pet post to shelter transaction: %o', error);
        await queryRunner.rollbackTransaction();
        logger.info('Transaction rolled back due to error.');
        throw error;
      } finally {
        await queryRunner.release();
        logger.info('Query runner released.');
      }
}

export const getAllShelterPets = async (shelterId: number) => {
  const queryRunner = typeORM.createQueryRunner();

  try {
    logger.info(`Fetching all pets for shelter ID: ${shelterId}`);
    const shelter = await getShelterById(shelterId, queryRunner);
    const shelterPets = await findPetsByShelterId(shelterId, queryRunner);

    if (!shelter) {
      logger.error('Shelter not found.');
      throw new HttpException("Shelter not found", 404);
    }

    const response = await instanceOfGetAllPetsInShelterResponseDTO(
      shelterPets,
      shelter
    );

    return response;
  } catch (error) {
    logger.error('Error while fetching all pets for shelter: %o', error);
    throw error;
  } finally {
    await queryRunner.release();
    logger.info('Query runner released.');
  }
};

export const getAllPets = async () => {
  const queryRunner = typeORM.createQueryRunner();

  try {
    logger.info('Fetching all pets.');
    const pets = await findAllPetPosts(queryRunner);

    const response = await instanceOfGetAllPetsPostsResponseDTO(pets);

    return response;
  } catch (error) {
    logger.error('Error while fetching all pets: %o', error);
    throw error;
  } finally {
    await queryRunner.release();
    logger.info('Query runner released.');
  }
}