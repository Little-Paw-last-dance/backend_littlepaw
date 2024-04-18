import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import Role from "./Roles"

@Entity("users")
class User {

    @PrimaryGeneratedColumn({ name: "user_id" })
    id: number

    @Column({ name: "email", unique: true })
    email: string

    @Column({ name: "names" })
    names: string

    @Column({ name: "paternal_surname" })
    paternalSurname: string

    @Column({ name: "maternal_surname" })
    maternalSurname: string

    @Column({ name: "country_code" })
    countryCode: number

    @Column({ name: "phone" })
    phone: string

    @Column({ name: "age" })
    age: number

    @Column({ name: "city" })
    city: string

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable({ name: "user_role", joinColumn: { name: "user_id" }, inverseJoinColumn: { name: "role_id" } })
    roles: Role[]

}

export default User