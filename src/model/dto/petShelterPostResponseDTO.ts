import PetPosts from "../../entity/PetPosts"
import ShelterPosts from "../../entity/ShelterPosts"
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

export type PetShelterPostResponseDTO = {
    id: number
    pet: Pet
    shelter: Shelter
    contact: string
    status: PetStatus
}

export const instanceOfPetShelterPostResponseDTO = (shelterPetPost: ShelterPosts, photosUrls: string[]): PetShelterPostResponseDTO => {
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
            photos: photosUrls
        },
        shelter: {
            id: shelterPetPost.shelter.id,
            name: shelterPetPost.shelter.name,
            location: shelterPetPost.shelter.location,
            urlPage: shelterPetPost.shelter.urlPage,
            countryCode: shelterPetPost.shelter.countryCode,
            phone: shelterPetPost.shelter.phone,
            photo: shelterPetPost.shelter.photo
        },
        contact: shelterPetPost.contact,
        status: shelterPetPost.status
    }
}