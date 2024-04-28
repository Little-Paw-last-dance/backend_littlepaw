import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import Pets from "./Pets"
import User from "./User"
import PetStatus from "../model/petStatus"
import Shelters from "./Shelters"

@Entity("shelter_posts")
class ShelterPosts {

    @PrimaryGeneratedColumn({ name: "sp_id" })
    id: number

    @Column({ name: "shelter_id" })
    shelterId: number

    @Column({ name: "pet_id" })
    petId: number

    @Column({ name: "contact" })
    contact: string

    @Column({ name: "status" })
    status: PetStatus

    @OneToOne(() => Pets, (pet) => pet.posts)
    @JoinColumn({ name: "pet_id" })
    pet: Pets

    @ManyToOne(() => Shelters, (shelter) => shelter.posts)
    @JoinColumn({ name: "shelter_id" })
    shelter: Shelters
}

export default ShelterPosts