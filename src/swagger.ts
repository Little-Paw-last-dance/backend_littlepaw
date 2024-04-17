import swaggerAutogen from "swagger-autogen";

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
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
