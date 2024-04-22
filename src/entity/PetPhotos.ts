import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import Pets from "./Pets"

@Entity("pet_photos")
class PetPhotos {

    @PrimaryGeneratedColumn({ name: "photo_id" })
    id: number

    @Column({ name: "pet_id" })
    petId: number

    @Column({ name: "photo_path" })
    photoPath: string

    @ManyToOne(() => Pets, (pet) => pet.photos)
    @JoinColumn({ name: "pet_id" })
    pet: Pets
}

export default PetPhotos