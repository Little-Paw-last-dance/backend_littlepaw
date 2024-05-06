import typeORM from "../db/dataSource";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import { uploadFilesB64AndReturnPaths, deleteFiles } from "../util/util";
import {v4 as uuidv4} from 'uuid';
import { insertShelter, getShelterById, getAllShelters, deleteShelter, updateShelter } from "../repository/shelterRepository";
import { getSignedUrlByPath } from "../repository/s3Repository";
import { instanceShelterResponse } from "../model/dto/shelterResponse";
import HttpException from "../exception/HttpException";
import { ShelterUpdateDTO } from "../model/dto/shelterUpdateDTO";
import logger from "../config/logger";

export const registerAShelter = async(shelterRegister:ShelterRegisterDTO, userEmail:string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();
    logger.info('Starting transaction to register a shelter.');

    try {
        logger.info('Starting transaction to register a shelter.');
        const photoPath = await uploadFilesB64AndReturnPaths([shelterRegister.photo], () => `shelters/${shelterRegister.name + "_" + uuidv4()}`);
        const shelterRegisterEntity = await insertShelter(shelterRegister, queryRunner, photoPath[0], userEmail);

        if(!shelterRegisterEntity) {
            logger.error('Failed to insert shelter.');
            throw new Error("Error inserting shelter");
        }

        const photoURL = await Promise.all(photoPath.map(async (path) => await getSignedUrlByPath(path)));
        const response = instanceShelterResponse(shelterRegisterEntity, photoURL[0]);
        await queryRunner.commitTransaction();
        logger.info('Transaction committed successfully.');
        return response;
    } catch (error) {
        logger.error('Error during shelter registration transaction: %o', error);
        await queryRunner.rollbackTransaction();
        logger.info('Transaction rolled back due to error.');
        throw error;
    } finally {
        await queryRunner.release();
        logger.info('Query runner released.');
    }
}

export const updateAShelter = async(id:number, shelterUpdate:ShelterUpdateDTO, userEmail:string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();
    logger.info('Starting transaction to update a shelter.');

    try {
        logger.info('Starting transaction to update a shelter.');
        if(shelterUpdate.photo) {

            const photoPath = await uploadFilesB64AndReturnPaths([shelterUpdate.photo], () => `shelters/${shelterUpdate.name + "_" + uuidv4()}`);
            const shelterUpdateEntity = await updateShelter(id, shelterUpdate, queryRunner, userEmail, photoPath[0]);

            if(!shelterUpdateEntity) {
                logger.error('Failed to update shelter.');
                throw new Error("Error updating shelter");
            }

            const photoURL = await Promise.all(photoPath.map(async (path) => await getSignedUrlByPath(path)));
            const response = instanceShelterResponse(shelterUpdateEntity, photoURL[0]);
            await queryRunner.commitTransaction();
            logger.info('Transaction committed successfully.');
            return response;
        } else {
            const shelterUpdateEntity = await updateShelter(id, shelterUpdate, queryRunner, userEmail);

            if(!shelterUpdateEntity) {
                logger.error('Failed to update shelter.');
                throw new Error("Error updating shelter");
            }

            const photoURL = await getSignedUrlByPath(shelterUpdateEntity.photo);
            const response = instanceShelterResponse(shelterUpdateEntity, photoURL);
            await queryRunner.commitTransaction();
            logger.info('Transaction committed successfully.');
            return response;
        }
    } catch (error) {
        logger.error('Error during shelter update transaction: %o', error);
        await queryRunner.rollbackTransaction();
        logger.info('Transaction rolled back due to error.');
        throw error;
    } finally {
        await queryRunner.release();
        logger.info('Query runner released.');
    }

}

export const getAShelterById = async(id:number) => {
   const queryRunner = typeORM.createQueryRunner();
   await queryRunner.startTransaction();
   logger.info('Starting transaction to get a shelter by ID.');

   return new Promise((resolve, reject) => {
         getShelterById(id, queryRunner)
         .then(async (shelter) => {
              if(shelter) {
                const photoURL = await getSignedUrlByPath(shelter.photo);
                await queryRunner.commitTransaction();
                logger.info('Transaction committed successfully.');
                resolve(instanceShelterResponse(shelter, photoURL));
              } else {
                reject(new HttpException("Shelter not found", 404));
              }
         })
         .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            logger.info('Transaction rolled back due to error.');
            reject(error)
        })
        .finally(async () => {
            await queryRunner.release();
            logger.info('Query runner released.');
        });
    })
    
    
}

export const getAllTheShelters = async() => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();
    return new Promise((resolve, reject) => {
        getAllShelters(queryRunner)
        .then(async (shelters) => {
            const sheltersResponse = await Promise.all(shelters.map(async (shelter) => {
                const photoURL = await getSignedUrlByPath(shelter.photo);
                return instanceShelterResponse(shelter, photoURL);
            }));
            await queryRunner.commitTransaction();
            resolve(sheltersResponse);
        })
        .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            reject(error);
        })
        .finally(async () => {
            await queryRunner.release();
        });
    })
}

export const deleteAShelter = async(id:number, userEmail:string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();
    return new Promise((resolve, reject) => {
        deleteShelter(id, queryRunner, userEmail)
        .then(async (shelter) => {
            if(shelter) {
                await deleteFiles([shelter.photo]);
                await queryRunner.commitTransaction();
                resolve(instanceShelterResponse(shelter, shelter.photo));
            } else {
                reject(new HttpException("Shelter not found", 404));
            }
        })
        .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            reject(error);
        })
        .finally(async () => {
            await queryRunner.release();
        });
    })
}

