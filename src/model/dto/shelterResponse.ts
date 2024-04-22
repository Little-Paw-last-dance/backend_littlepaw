import Shelters from "../../entity/Shelters";

export type ShelterResponse = {
    id: number;
    name: string;
    location: string;
    urlPage: string;
    countryCode: number;
    phone: string;
    photo: string;
}

export const instanceShelterResponse = (shelter: Shelters): ShelterResponse => {
    return {
        id: shelter.id,
        name: shelter.name,
        location: shelter.location,
        urlPage: shelter.urlPage,
        countryCode: shelter.countryCode,
        phone: shelter.phone,
        photo: shelter.photo
    }
}