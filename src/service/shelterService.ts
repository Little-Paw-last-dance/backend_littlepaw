import typeORM from "../db/dataSource";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import { uploadFilesB64AndReturnPaths, deleteFiles } from "../util/util";
import {v4 as uuidv4} from 'uuid';
import { insertShelter, getShelterById, getAllShelters, deleteShelter, updateShelter } from "../repository/shelterRepository";
import { getSignedUrlByPath } from "../repository/s3Repository";
import { instanceShelterResponse } from "../model/dto/shelterResponse";
import HttpException from "../exception/HttpException";
import { ShelterUpdateDTO } from "../model/dto/shelterUpdateDTO";

export const registerAShelter = async(shelterRegister:ShelterRegisterDTO, userEmail:string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        const photoPath = await uploadFilesB64AndReturnPaths([shelterRegister.photo], () => `shelters/${shelterRegister.name + "_" + uuidv4()}`);
        const shelterRegisterEntity = await insertShelter(shelterRegister, queryRunner, photoPath[0], userEmail);

        if(!shelterRegisterEntity) {
            throw new Error("Error inserting shelter");
        }

        const photoURL = await Promise.all(photoPath.map(async (path) => await getSignedUrlByPath(path)));
        const response = instanceShelterResponse(shelterRegisterEntity, photoURL[0]);
        await queryRunner.commitTransaction();
        return response;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

export const updateAShelter = async(id:number, shelterUpdate:ShelterUpdateDTO, userEmail:string) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        if(shelterUpdate.photo) {

            const photoPath = await uploadFilesB64AndReturnPaths([shelterUpdate.photo], () => `shelters/${shelterUpdate.name + "_" + uuidv4()}`);
            const shelterUpdateEntity = await updateShelter(id, shelterUpdate, queryRunner, userEmail, photoPath[0]);

            if(!shelterUpdateEntity) {
                throw new Error("Error updating shelter");
            }

            const photoURL = await Promise.all(photoPath.map(async (path) => await getSignedUrlByPath(path)));
            const response = instanceShelterResponse(shelterUpdateEntity, photoURL[0]);
            await queryRunner.commitTransaction();
            return response;
        } else {
            const shelterUpdateEntity = await updateShelter(id, shelterUpdate, queryRunner, userEmail);

            if(!shelterUpdateEntity) {
                throw new Error("Error updating shelter");
            }

            const photoURL = await getSignedUrlByPath(shelterUpdateEntity.photo);
            const response = instanceShelterResponse(shelterUpdateEntity, photoURL);
            await queryRunner.commitTransaction();
            return response;
        }
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }

}

export const getAShelterById = async(id:number) => {
   const queryRunner = typeORM.createQueryRunner();
   await queryRunner.startTransaction();
   return new Promise((resolve, reject) => {
         getShelterById(id, queryRunner)
         .then(async (shelter) => {
              if(shelter) {
                const photoURL = await getSignedUrlByPath(shelter.photo);
                await queryRunner.commitTransaction();
                resolve(instanceShelterResponse(shelter, photoURL));
              } else {
                reject(new HttpException("Shelter not found", 404));
              }
         })
         .catch(async (error) => {
            await queryRunner.rollbackTransaction();
            reject(error)
        })
        .finally(async () => {
            await queryRunner.release();
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

