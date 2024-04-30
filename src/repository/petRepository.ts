import User from "../entity/User";
import { QueryRunner } from "typeorm";
import HttpException from "../exception/HttpException";
import { PetPostRequestDTO } from "../model/dto/petPostRequestDTO";
import Pets from "../entity/Pets";
import PetPhotos from "../entity/PetPhotos";
import PetPosts from "../entity/PetPosts";
import PetStatus from "../model/petStatus";
import Shelters from "../entity/Shelters";
import ShelterPosts from "../entity/ShelterPosts";



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


export const insertPetPostWithPetAndPhotosToShelter = async (petPostReq: PetPostRequestDTO, photosPaths: string[], shelterId: number, queryRunner: QueryRunner): Promise<ShelterPosts | null> => {

    const shelter = await queryRunner.manager.findOne(Shelters, { where: { id: shelterId } });

    if (!shelter) {
        throw new HttpException("Shelter not found", 404);
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

    const shelterPost = new ShelterPosts();
    shelterPost.pet = pet;
    shelterPost.shelter = shelter;
    shelterPost.contact = `https://api.whatsapp.com/send?phone=${shelter.countryCode}${shelter.phone}&text=I'm interested in your pet ${pet.name}`
    shelterPost.status = PetStatus.AVAILABLE;

    const shelterPostSaved = await queryRunner.manager.save(ShelterPosts, shelterPost);

    return await queryRunner.manager.findOne(ShelterPosts, { where: { id: shelterPostSaved.id }, relations: ["pet", "pet.photos", "shelter"] });
}

export const findPetsByShelterId = async (shelterId: number, queryRunner: QueryRunner): Promise<ShelterPosts[]> => {
    return await queryRunner.manager.find(ShelterPosts, { where: { shelter: { id: shelterId } }, relations: ["pet", "pet.photos", "shelter"] });
}