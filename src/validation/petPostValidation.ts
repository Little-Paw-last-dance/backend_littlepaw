import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  Min,
} from "class-validator";
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import Sex from "../model/sex";
import PetType from "../model/petType";

export class PetPostValidation implements PetPostRequestDTO {
  @IsDefined()
  name: string;

  @IsDefined()
  @IsNumber()
  @Min(0)
  age: number;

  @IsDefined()
  @IsEnum(Sex)
  sex: Sex;

  @IsDefined()
  breed: string;

  @IsDefined()
  description: string;

  @IsDefined()
  @IsEnum(PetType)
  type: PetType;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsDefined({ each: true })
  photos: string[];

  constructor(petPost: PetPostRequestDTO) {
    this.name = petPost.name;
    this.age = petPost.age;
    this.sex = petPost.sex;
    this.breed = petPost.breed;
    this.description = petPost.description;
    this.type = petPost.type;
    this.photos = petPost.photos;
  }
}
