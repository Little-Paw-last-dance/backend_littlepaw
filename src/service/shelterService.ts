import typeORM from "../db/dataSource";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import { uploadFilesB64AndReturnPaths } from "../util/util";
import {v4 as uuidv4} from 'uuid';
import { insertShelter } from "../repository/shelterRepository";
import { getSignedUrlByPath } from "../repository/s3Repository";
import { instanceShelterResponse } from "../model/dto/shelterResponse";

export const registerAShelter = async(shelterRegister:ShelterRegisterDTO) => {
    const queryRunner = typeORM.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        const photoPath = await uploadFilesB64AndReturnPaths([shelterRegister.photo], () => `shelters/${shelterRegister.name + "_" + uuidv4()}`);
        const shelterRegisterEntity = await insertShelter(shelterRegister, queryRunner, photoPath[0]);

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