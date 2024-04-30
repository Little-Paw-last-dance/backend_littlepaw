import ShelterPosts from "../../entity/ShelterPosts"
import Shelters from "../../entity/Shelters"
import { getSignedUrlByPath } from "../../repository/s3Repository"
import PetStatus from "../petStatus"
import PetType from "../petType"
import Sex from "../sex"

type Pet = {
    id: number
    name: string
    age: number
    sex: Sex
    breed: string
    description: string
    type: PetType
    photos: string[]
}


type Shelter = {
    id: number
    name: string
    location: string
    urlPage: string
    countryCode: number
    phone: string
    photo: string
}

type PetPost = {
    id: number
    pet: Pet
    contact: string
    status: PetStatus
}

export type GetAllPetsInShelterResponseDTO = {
    petPosts: PetPost[]
    shelter: Shelter
}

export const instanceOfGetAllPetsInShelterResponseDTO = async (shelterPetPosts: ShelterPosts[], shelter: Shelters): Promise<GetAllPetsInShelterResponseDTO> => {

    return {
        shelter: {
            id: shelter.id,
            name: shelter.name,
            location: shelter.location,
            urlPage: shelter.urlPage,
            countryCode: shelter.countryCode,
            phone: shelter.phone,
            photo: shelter.photo
        },
        petPosts: await Promise.all(shelterPetPosts.map(async (shelterPetPost) => {
            return {
                id: shelterPetPost.id,
                pet: {
                    id: shelterPetPost.pet.id,
                    name: shelterPetPost.pet.name,
                    age: shelterPetPost.pet.age,
                    sex: shelterPetPost.pet.sex,
                    breed: shelterPetPost.pet.breed,
                    description: shelterPetPost.pet.description,
                    type: shelterPetPost.pet.type,
                    photos: await Promise.all(shelterPetPost.pet.photos.map(async (photo) => await getSignedUrlByPath(photo.photoPath)))
                },
                contact: shelterPetPost.contact,
                status: shelterPetPost.status
            }
        }))
    }
}