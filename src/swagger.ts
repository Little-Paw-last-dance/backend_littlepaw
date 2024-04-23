import swaggerAutogen from "swagger-autogen";
import Sex from "./model/sex";
import PetType from "./model/petType";
import PetStatus from "./model/petStatus";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Little Paw API",
    description: "Little Paw Backend API Documentation",
  },
  basePath: "/",
  host: process.env.HOST || "localhost:8000",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  components: {
    schemas: {
      PetPostRequestDTO: {
        name: "Doki",
        age: 2,
        sex: Sex.MALE,
        breed: "Golden Retriever",
        description: "A very playful dog",
        type: PetType.DOG,
        photos: ["base64 image 1", "base64 image 2"],
      },
      PetPostResponseDTO: {
        id: 1,
        pet: {
          id: 1,
          name: "Doki",
          age: 2,
          sex: Sex.MALE,
          breed: "Golden Retriever",
          description: "A very playful dog",
          type: PetType.DOG,
          photos: ["base64 image 1", "base64 image 2"],
        },
        user: {
          email: "user@example.com",
          names: "John",
          paternalSurname: "Doe",
          maternalSurname: "Smith",
          countryCode: 591,
          phone: "77777777",
          age: 25,
          city: "La Paz",
        },
        contact: "https://api.whatsapp.com/send?phone=5917777777&text=I'm interested in your pet Doki",
        status: PetStatus.AVAILABLE,
      },
      UserRegisterRolesDTO: {
        email: "example@email.com",
        password: "password",
        names: "John",
        paternalSurname: "Doe",
        maternalSurname: "Smith",
        countryCode: 591,
        phone: "77777777",
        age: 25,
        city: "La Paz",
        roles: ["user", "admin"],
      },
      UserRegisterDTO: {
        email: "example@email.com",
        password: "password",
        names: "John",
        paternalSurname: "Doe",
        maternalSurname: "Smith",
        countryCode: 591,
        phone: "77777777",
        age: 25,
        city: "La Paz",
      },
      UserUpdateDTO: {
        names: "John",
        paternalSurname: "Doe",
        maternalSurname: "Smith",
        countryCode: 591,
        phone: "77777777",
        age: 25,
        city: "La Paz",
      },
      UserResponse: {
        id: 1,
        email: "example@email.com",
        names: "John",
        paternalSurname: "Doe",
        maternalSurname: "Smith",
        countryCode: 591,
        phone: "77777777",
        age: 25,
        city: "La Paz",
        roles: [
          {
            id: 1,
            name: "user",
          },
          {
            id: 2,
            name: "admin",
          },
        ],
      },
      HttpException: {
        statusCode: 400,
        message: "Bad Request",
        errors: {
          email: "Email is required",
          password: "Password is required",
        },
      },
      ShelterRegisterDTO: {
        name: "Liberty Shelter",
        location: "La Paz",
        urlPage: "https://shelterliberty.com",
        countryCode: 591,
        phone: "75845845",
        photo: "base64 image",
      },
      ShelterResponse: {
        id : 1,
        name: "Liberty Shelter",
        location: "La Paz",
        urlPage: "https://shelterliberty.com",
        countryCode: 591,
        phone: "75845845",
        photo: "link image",
      },
      
      SheltersResponse: [
        {
          id : 1,
          name: "Liberty Shelter",
          location: "La Paz",
          urlPage: "https://shelterliberty.com",
          countryCode: 591,
          phone: "75845845",
          photo: "link image",
        },
        {
          id : 2,
          name: "Hope Shelter",
          location: "El Alto",
          urlPage: "https://shelterhope.com",
          countryCode: 591,
          phone: "75845845",
          photo: "link image",
        },
      ],
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
