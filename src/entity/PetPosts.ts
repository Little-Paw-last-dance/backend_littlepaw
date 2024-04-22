import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import Pets from "./Pets"
import User from "./User"
import PetStatus from "../model/petStatus"

@Entity("pet_posts")
class PetPosts {

    @PrimaryGeneratedColumn({ name: "post_id" })
    id: number

    @Column({ name: "pet_id" })
    petId: number

    @Column({ name: "user_id" })
    userId: number

    @Column({ name: "contact" })
    contact: string

    @Column({ name: "status" })
    status: PetStatus

    @OneToOne(() => Pets, (pet) => pet.posts)
    @JoinColumn({ name: "pet_id" })
    pet: Pets

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "user_id" })
    user: User
}

export default PetPosts