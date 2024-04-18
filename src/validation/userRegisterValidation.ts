import {
  IsDefined,
  IsNumber,
  Length,
} from "class-validator";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";

export class UserRegisterValidation implements UserRegisterDTO {
  @IsDefined()
  email: string;

  @IsDefined()
  @Length(8)
  password: string;

  @IsDefined()
  names: string;

  @IsDefined()
  paternalSurname: string;

  @IsDefined()
  maternalSurname: string;

  @IsDefined()
  @IsNumber()
  countryCode: number;

  @IsDefined()
  phone: string;

  @IsDefined()
  @IsNumber()
  age: number;

  @IsDefined()
  city: string;

  constructor(userRegister: UserRegisterDTO) {
    this.email = userRegister.email;
    this.password = userRegister.password;
    this.names = userRegister.names;
    this.paternalSurname = userRegister.paternalSurname;
    this.maternalSurname = userRegister.maternalSurname;
    this.phone = userRegister.phone;
    this.countryCode = userRegister.countryCode;
    this.age = userRegister.age;
    this.city = userRegister.city;
  }
}
