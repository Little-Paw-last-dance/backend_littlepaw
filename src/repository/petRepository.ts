import User from "../entity/User";
import Role from "../entity/Roles";
import { UserRegisterRolesDTO } from "../model/dto/userRegisterRolesDTO";
import { In, QueryRunner } from "typeorm";
import HttpException from "../exception/HttpException";
import { UserRegisterDTO } from "../model/dto/userRegisterDTO";
import { UserUpdateDTO } from "../model/dto/userUpdateDTO";
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import Pets from "../entity/Pets";
import PetPhotos from "../entity/PetPhotos";
import PetPosts from "../entity/PetPosts";
import PetStatus from "../model/petStatus";



export const insertPetPostWithPetAndPhotos = async (petPostReq: PetPostRequestDTO, photosPaths: string[], userEmail: string, queryRunner: QueryRunner): Promise<PetPosts | null> => {

    const user = await queryRunner.manager.findOne(User, { where: { email: userEmail } });

    if (!user) {
        throw new HttpException("User not found", 404);
    }

    const pet = new Pets();
    pet.name = petPostReq.name;
    pet.age = petPostReq.age;
    pet.sex = petPostReq.sex;
    pet.breed = petPostReq.breed;
    pet.description = petPostReq.description;
    pet.type = petPostReq.type;

    await queryRunner.manager.save(Pets, pet);


    await Promise.all(photosPaths.map(async (path) => {
        const photo = new PetPhotos();
        photo.photoPath = path;
        photo.pet = pet;
        await queryRunner.manager.save(PetPhotos, photo);
        return photo;
    }));

    const petPost = new PetPosts();
    petPost.pet = pet;
    petPost.user = user;
    petPost.contact = `https://api.whatsapp.com/send?phone=${user.countryCode}${user.phone}&text=I'm interested in your pet ${pet.name}`
    petPost.status = PetStatus.AVAILABLE;

    const petPostSaved = await queryRunner.manager.save(PetPosts, petPost);

    return await queryRunner.manager.findOne(PetPosts, { where: { id: petPostSaved.id }, relations: ["pet", "pet.photos", "user"] });
}