import {
  IsDefined,
  IsNumber,
  Length,
} from "class-validator";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { UserUpdateDTO } from "../model/dto/userUpdateDTO";

export class UserUpdateValidation implements UserUpdateDTO {

  names?: string;

  paternalSurname?: string;

  maternalSurname?: string;

  @IsNumber()
  countryCode?: number;

  phone?: string;

  @IsNumber()
  age?: number;

  city?: string;

  constructor(userUpdate: UserUpdateDTO) {
    this.names = userUpdate.names;
    this.paternalSurname = userUpdate.paternalSurname;
    this.maternalSurname = userUpdate.maternalSurname;
    this.phone = userUpdate.phone;
    this.countryCode = userUpdate.countryCode;
    this.age = userUpdate.age;
    this.city = userUpdate.city;
  }
}
