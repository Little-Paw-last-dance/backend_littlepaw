import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import User from "./User"

@Entity("roles")
class Role {

    @PrimaryGeneratedColumn({ name: "role_id" })
    id: number

    @Column({ name: "role_name" })
    roleName: string

    @ManyToMany(() => User, (user) => user.roles)
    users: User[]
}

export default Role