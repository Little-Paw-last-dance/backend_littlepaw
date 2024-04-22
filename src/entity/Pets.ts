import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Sex from "../model/sex"
import PetType from "../model/petType"
import PetPhotos from "./PetPhotos"
import PetPosts from "./PetPosts"


@Entity("pets")
class Pets {

    @PrimaryGeneratedColumn({ name: "pet_id" })
    id: number

    @Column({ name: "name" })
    name: string

    @Column({ name: "age" })
    age: number

    @Column({ name: "sex" })
    sex: Sex

    @Column({ name: "breed" })
    breed: string

    @Column({ name: "description" })
    description: string

    @Column({ name: "type" })
    type: PetType

    @OneToMany(() => PetPhotos, (photo) => photo.pet)
    photos: PetPhotos[]

    @OneToMany(() => PetPosts, (post) => post.pet)
    posts: PetPosts[]
}

export default Pets