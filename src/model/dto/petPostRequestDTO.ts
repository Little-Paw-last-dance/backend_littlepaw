import PetType from "../petType"
import Sex from "../sex"

export type PetPostRequestDTO = {
    name: string
    age: number
    sex: Sex
    breed: string
    description: string
    type: PetType
    photos: string[]
}