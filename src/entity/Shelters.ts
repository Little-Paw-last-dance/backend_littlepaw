import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("shelters")

class Shelters {
    @PrimaryGeneratedColumn({name: "shelter_id"})
    id: number;

    @Column({name:"name"})
    name: string;

    @Column({name:"location"})
    location: string;

    @Column({name: "url_page"})
    urlPage: string;

    @Column({name:"country_code"})
    countryCode: number;

    @Column({name:"phone"})
    phone: string;

    @Column({name:"Photo"})
    photo: string;
}

export default Shelters
