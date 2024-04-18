import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("roles")
class Role {

    @PrimaryGeneratedColumn({ name: "role_id" })
    id: number

    @Column({ name: "role_name" })
    roleName: string
}

export default Role