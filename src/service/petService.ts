import typeORM from "../db/dataSource";
import {v4 as uuidv4} from 'uuid';
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import { insertPetPostWithPetAndPhotos } from "../repository/petRepository";
import { uploadFilesB64AndReturnPaths } from "../util/util";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrlByPath } from "../repository/s3Repository";
import { instanceOfPetPostResponseDTO } from "../model/dto/petPostResponseDTO";

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