import { ShelterUpdateDTO } from "../model/dto/shelterUpdateDTO";
import {
    IsDefined,
    IsNumber,
    Length,
  } from "class-validator";

export class ShelterUpdateValidation implements ShelterUpdateDTO {
    
    name?: string;

    location?: string;

    urlPage?: string;

    @IsNumber()
    countryCode?: number;
    
    phone?: string;

    photo?: string;

    constructor(shelterUpdate: ShelterUpdateDTO) {
        this.name = shelterUpdate.name;
        this.location = shelterUpdate.location;
        this.urlPage = shelterUpdate.urlPage;
        this.countryCode = shelterUpdate.countryCode;
        this.phone = shelterUpdate.phone;
        this.photo = shelterUpdate.photo;
    }
}