import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { userRegister } from '../../src/controller/userController';
import * as userService from '../../src/service/userService';
import HttpException from "../../src/exception/HttpException";
import { UserRegisterDTO } from '../../src/model/dto/userRegisterDTO';

// Define interfaces to accurately mock Request and Response objects
interface MockRequest extends Partial<Request<ParamsDictionary, any, any, ParsedQs>> {
    get?: jest.Mock;
    header?: jest.Mock;
    accepts?: jest.Mock;
    acceptsCharsets?: jest.Mock;
    locals: {
        user: UserRegisterDTO;
    };
}

interface MockResponse extends Partial<Response> {
    status: jest.Mock;
    json: jest.Mock;
    send?: jest.Mock;
}

// Mock the userService
jest.mock('../../src/service/userService', () => ({
  registerUser: jest.fn()
}));

describe('userRegister', () => {
    let mockRequest: MockRequest;
    let mockResponse: MockResponse;

    beforeEach(() => {
        mockRequest = {
            get: jest.fn(),
            header: jest.fn(),
            accepts: jest.fn(),
            acceptsCharsets: jest.fn(),
            locals: {
                user: {
                    email: "tests2@gmail.com",
                    password: 'strongPassword123',
                    names: 'John',
                    paternalSurname: 'Doe',
                    maternalSurname: 'Smith',
                    countryCode: 591,
                    phone: '68786565',
                    age: 20,
                    city: "La Paz",
                }
            },
        };

        // Setup the mockResponse object too
        mockResponse = {
            status: jest.fn().mockImplementation(() => mockResponse),
            json: jest.fn(),
            send: jest.fn(),
            // If your implementation uses locals on response (unusual but possible in some setups)
            locals: {
                
            }
        };
    });

    it('should register a user successfully', async () => {
        const expectedUser: any ={
            id: 2,
            email: "tests2@gmail.com",
            names: 'John',
            paternalSurname: 'Doe',
            maternalSurname: 'Smith',
            countryCode: 591,
            phone: '68786565',
            age: 20,
            city: "La Paz",
            roles: [{
                id: 3,
                name: "user"
            }]
        };

        // Mock the userService behavior to resolve with expectedUser
        (userService.registerUser as jest.Mock).mockResolvedValue(expectedUser);

        // Execute the function with the mocked request and response
        await userRegister(mockRequest as any, mockResponse as any);

        // Assert that userService was called correctly
        // expect(userService.registerUser).toHaveBeenCalledWith(expectedUser);
        // expect(userService.registerUser).toHaveBeenCalledWith(mockRequest.locals.user);

        // Assert that the response was handled correctly
        // la mejor opcion seria mostrar el numero de respuesta de la consulta y mientras tanto manejarlo con los expected de la respuesta
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({ user: expectedUser });
    });
});
