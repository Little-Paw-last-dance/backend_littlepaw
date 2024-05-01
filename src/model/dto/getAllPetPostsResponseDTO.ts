import PetPosts from "../../entity/PetPosts";
import { getSignedUrlByPath } from "../../repository/s3Repository";
import PetStatus from "../petStatus";
import PetType from "../petType";
import Sex from "../sex";

type Pet = {
  id: number;
  name: string;
  age: number;
  sex: Sex;
  breed: string;
  description: string;
  type: PetType;
  photos: string[];
};

type User = {
  id: number;
  email: string;
  names: string;
  paternalSurname: string;
  maternalSurname: string;
  countryCode: number;
  phone: string;
  age: number;
  city: string;
};

export type GetAllPetPostsResponseDTO = {
  id: number;
  pet: Pet;
  user: User;
  contact: string;
  status: PetStatus;
};

export const instanceOfGetAllPetsPostsResponseDTO = async (petPosts: PetPosts[]): Promise<GetAllPetPostsResponseDTO[]> => {
  return await Promise.all(
    petPosts.map(async (petPost) => {
      return {
        id: petPost.id,
        pet: {
          id: petPost.pet.id,
          name: petPost.pet.name,
          age: petPost.pet.age,
          sex: petPost.pet.sex,
          breed: petPost.pet.breed,
          description: petPost.pet.description,
          type: petPost.pet.type,
          photos: await Promise.all(
            petPost.pet.photos.map(
              async (photo) => await getSignedUrlByPath(photo.photoPath)
            )
          ),
        },
        user: {
          id: petPost.user.id,
          email: petPost.user.email,
          names: petPost.user.names,
          paternalSurname: petPost.user.paternalSurname,
          maternalSurname: petPost.user.maternalSurname,
          countryCode: petPost.user.countryCode,
          phone: petPost.user.phone,
          age: petPost.user.age,
          city: petPost.user.city,
        },
        contact: petPost.contact,
        status: petPost.status,
      };
    })
  );
};
