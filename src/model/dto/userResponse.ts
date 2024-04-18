import User from "../../entity/User";

type Role = {
    id: number;
    name: string;
}

export type UserResponse = {
    id: number;
    email: string
    names: string
    paternalSurname: string
    maternalSurname: string
    countryCode: number
    phone: string
    age: number
    city: string
    roles: Role[]
}

export const instanceUserResponse = (user: User): UserResponse => {
    return {
        id: user.id,
        email: user.email,
        names: user.names,
        paternalSurname: user.paternalSurname,
        maternalSurname: user.maternalSurname,
        phone: user.phone,
        countryCode: user.countryCode,
        age: user.age,
        city: user.city,
        roles: user.roles.map((role) => {
            return {
                id: role.id,
                name: role.roleName
            }
        })
    }
}