import Shelters from "../entity/Shelters";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";
import { In, QueryRunner } from "typeorm";

export const insertShelter = async (shelterDTO: ShelterRegisterDTO, queryRunner: QueryRunner, photoPath:string): Promise<Shelters> => {
    const shelter = new Shelters();
    shelter.name = shelterDTO.name;
    shelter.location = shelterDTO.location;
    shelter.urlPage = shelterDTO.urlPage;
    shelter.countryCode = shelterDTO.countryCode;
    shelter.phone = shelterDTO.phone;
    shelter.photo = photoPath;

    return await queryRunner.manager.save(Shelters, shelter);

}