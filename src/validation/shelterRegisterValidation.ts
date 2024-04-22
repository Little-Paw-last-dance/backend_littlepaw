import { IsDefined, IsNumber } from "class-validator";
import { ShelterRegisterDTO } from "../model/dto/shelterRegisterDTO";

export class ShelterRegisterValidation implements ShelterRegisterDTO {
    @IsDefined()
    name: string;

    @IsDefined()
    location: string;

    @IsDefined()
    urlPage: string;

    @IsDefined()
    @IsNumber()
    countryCode: number;

    @IsDefined()
    phone: string;

    @IsDefined()
    photo: string;

    constructor(shelterRegister: ShelterRegisterDTO) {
        this.name = shelterRegister.name;
        this.location = shelterRegister.location;
        this.urlPage = shelterRegister.urlPage;
        this.countryCode = shelterRegister.countryCode;
        this.phone = shelterRegister.phone;
        this.photo = shelterRegister.photo;
    }
}