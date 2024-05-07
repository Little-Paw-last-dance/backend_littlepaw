# Backend Little Paw

## Estructura del Proyecto
### src/config
El directorio [`src/config`](src/config/) contiene configuraciones esenciales para la aplicación:

#### AWS S3
Archivo [`awsS3.ts`](src/config/awsS3.ts): Configura el cliente de AWS S3 para gestionar el almacenamiento en la nube usando las siguientes variables de entorno: `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

#### Base de Datos MySQL
Archivo [`mysqlConfig.ts`](src/config/mysqlConfig.ts): Establece la conexión con la base de datos MySQL. Asegúrate de configurar las siguientes variables de entorno en tu archivo `.env`: `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.

#### CORS
Archivo [`corsOptions.ts`](src/config/corsOptions.ts): Define las políticas CORS para controlar el acceso a la API. Configura los orígenes y métodos HTTP permitidos directamente en el código.

#### Firebase
Archivo [`firebaseConfig.ts`](src/config/firebaseConfig.ts): Inicializa Firebase utilizando configuraciones seguras, adecuadas para la autenticación y otras funcionalidades. Configura las variables de entorno relacionadas con Firebase, incluyendo `FIREBASE_TYPE`, `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc.

#### logger
Archivo [`logger.ts`](src/config/logger.ts): Configura el logger centralizado utilizando la biblioteca Pino. Este logger se usa en todo el proyecto para capturar y almacenar registros de actividad, errores y otros mensajes importantes.

*Características:*
- **Niveles de Logueo**: Soporta múltiples niveles de logueo como `fatal`, `error`, `warn`, `info`, `debug` y `trace`.
- **Formato de Timestamp**: Utiliza timestamps en formato ISO 8601 para facilitar la legibilidad y el seguimiento temporal en entornos de desarrollo y producción.
- **Personalización del Nivel de Log**: Los niveles de logueo se muestran en formato textual para mejorar la legibilidad durante el desarrollo y las pruebas. Es bueno saber igual lo siguiente:
  - `fatal`: 10
  - `error`: 20
  - `warn`: 30
  - `info`: 30
  - `debug`: 40
  - `trace`: 50

##### Configuración de Transporte:
- **Consola**: Configurada para mostrar logs en la consola con colores y formato legible durante el desarrollo.
- **Archivos de Log**: Los logs también se redirigen a archivos específicos basados en el nivel de severidad. Por ejemplo, todos los logs de nivel `error` se almacenan en `error.log`, mientras que la información general se guarda en `combined.log`.

##### Ejemplo de Uso:
Para usar el logger, simplemente importa y llama al logger desde cualquier archivo:
```typescript
import logger from './config/logger';

logger.info('Mensaje informativo');
logger.error('Mensaje de error');
```



### src/controller
Los controladores en [`src/controller`](src/controller/) gestionan las interacciones entre la API y los servicios, organizando la lógica de negocio según los diferentes recursos de la aplicación.

#### Pet Controller 
El [`petController`](src/controller/petController.ts) es el responsable de gestionar todas las operaciones relacionadas con mascotas, incluyendo la creación de nuevas entradas y la asociación de mascotas a refugios.

- **Endpoints**:
  - POST `/pet`: Crea una nueva mascota.
  - POST `/shelter/:id/pet`: Asocia una mascota a un refugio específico.

#### Shelter Controller
El [`shelterController`](src/controller/shelterController.ts) es el que administra las operaciones relacionadas con los refugios, desde la creación hasta la eliminación, pasando por la actualización y consulta de los mismos.

- **Endpoints**:
  - POST `/shelter`: Registra un nuevo refugio.
  - PUT `/shelter/:id`: Actualiza un refugio.
  - GET `/shelter/:id`: Consulta los detalles de un refugio.
  - GET `/shelters`: Lista todos los refugios.
  - DELETE `/shelter/:id`: Elimina un refugio.

#### User Controller
El [`userController`](src/controller/userController.ts) es el encargado de las funcionalidades relacionadas con los usuarios, como registro, actualización, consulta y eliminación de información del usuario.

- **Endpoints**:
  - POST `/user`: Registra un nuevo usuario.
  - GET `/user`: Obtiene información del usuario.
  - PUT `/user`: Actualiza información del usuario.
  - DELETE `/user`: Elimina un usuario.

### src/db
La configuración de la base de datos se maneja en el archivo [`src/db/dataSource.ts`](src/db/dataSource.ts), utilizando TypeORM para facilitar la interacción con MySQL. Este archivo configura la conexión utilizando parámetros definidos en [`src/config/mysqlConfig.ts`](src/config/mysqlConfig.ts).

#### Características Principales
- **TypeORM DataSource**: Se establece una conexión con MySQL, detallando host, puerto, credenciales y nombre de la base de datos.

- **Entidades**: Se especifican las rutas de las entidades que TypeORM utilizará para mapear objetos a la base de datos.

- **Sincronización y Registro**: La sincronización está desactivada para proteger la estructura de la base de datos en entornos de producción, y el registro de operaciones está desactivado para reducir la salida de logs innecesaria.

La conexión se inicializa al cargar el módulo y se reporta en consola el estado de la conexión. Los errores durante la conexión también se manejan adecuadamente para proporcionar retroalimentación clara sobre cualquier problema de conexión.

### src/entity
Las entidades en [`src/entity`](src/entity/) representan las tablas de la base de datos y están diseñadas para facilitar la interacción con la base de datos mediante TypeORM. Cada entidad corresponde a una tabla específica y está vinculada con otras a través de relaciones como OneToMany, ManyToOne y ManyToMany.

#### User
El [`User`](/src/entity/User.ts) representa a los usuarios de la aplicación, almacenando información personal y de contacto.
- **Campos**:
  - `user_id`: Identificador único para el usuario.
  - `email`: Dirección de correo electrónico del usuario, única en el sistema.
  - `names`: Nombres y otros nombres del usuario.
  - `paternal_surname`: Apellido paterno del usuario.
  - `maternal_surname`: Apellido materno del usuario.
  - `country_code`: Código del país de ubicación del usuario.
  - `phone`: Número de teléfono de contacto del usuario.
  - `age`: Edad del usuario.
  - `city`: Ciudad de residencia del usuario.
- **Relaciones**:
  - `ManyToMany` con `Roles`: Gestiona la asociación de roles a usuarios a través de una tabla intermedia.

#### Roles
El [`Roles`](/src/entity/Roles.ts) define los roles que pueden ser asignados a los usuarios.
- **Campos**:
  - `role_id`: Identificador único para el rol.
  - `role_name`: Nombre del rol.
- **Relaciones**:
  - `ManyToMany` con `User`: Enlaza roles con usuarios permitiendo múltiples roles por usuario.

#### Pets
El [`Pets`](/src/entity/Pets.ts) corresponde a las mascotas registradas en el sistema. Incluye detalles como nombre, edad, raza y tipo, además de estar vinculada a `PetPhotos` y `PetPosts` a través de relaciones `OneToMany`.
- **Campos**:
  - `pet_id`: Identificador único de la mascota.
  - `name`: Nombre de la mascota.
  - `age`: Edad de la mascota.
  - `sex`: Sexo de la mascota.
  - `breed`: Raza de la mascota.
  - `description`: Descripción de la mascota.
  - `type`: Tipo de mascota.
- **Relaciones**:
  - `OneToMany` con `PetPhotos`: Relaciona mascotas con sus fotos.
  - `OneToMany` con `PetPosts`: Vincula mascotas con publicaciones realizadas sobre ellas.

#### PetPhotos
El [`PetPhotos`](/src/entity/PetPhotos.ts) gestiona las fotos de las mascotas. Cada foto está relacionada con una mascota específica a través de `ManyToOne`.
- **Campos**:
  - `photo_id`: Identificador único para la foto.
  - `pet_id`: Identificador de la mascota asociada a la foto.
  - `photo_path`: Ruta del archivo de la foto.

#### PetPosts
El [`PetPosts`](/src/entity/PetPosts.ts) contiene información sobre publicaciones hechas por usuarios acerca de mascotas, incluyendo detalles de contacto y estado.
- **Campos**:
  - `post_id`: Identificador único de la publicación.
  - `pet_id`: Identificador de la mascota a la que se refiere la publicación.
  - `user_id`: Identificador del usuario que hace la publicación.
  - `contact`: Información de contacto proporcionada en la publicación.
  - `status`: Estado actual de la mascota en la publicación.

#### Shelters
El [`Shelters`](/src/entity/Shelters.ts) representa los refugios o centros de adopción, conteniendo información como nombre, ubicación y contacto.
- **Campos**:
  - `shelter_id`: Identificador único del refugio.
  - `name`: Nombre del refugio.
  - `location`: Ubicación del refugio.
  - `url_page`: Página web del refugio.
  - `country_code`: Código del país del refugio.
  - `phone`: Teléfono de contacto del refugio.
  - `photo`: Fotografía o imagen representativa del refugio.

#### ShelterPosts
El [`ShelterPosts`](/src/entity/ShelterPosts.ts) hace publicaciones realizadas por refugios, cada una relacionada con una mascota y un refugio específicos.
- **Campos**:
  - `sp_id`: Identificador único de la publicación del refugio.
  - `shelter_id`: Identificador del refugio que hace la publicación.
  - `pet_id`: Identificador de la mascota asociada a la publicación.
  - `contact`: Información de contacto para la adopción o consulta.
  - `status`: Estado de la publicación o de la mascota en el momento de la publicación.

Estas entidades son vitales para la estructura de datos del sistema y permiten una administración eficaz y escalable conforme crece el alcance del proyecto.

### src/exception
#### HttpException
El [`HttpException`](/src/exception/HttpException.ts) extiende la clase estándar `Error` de JavaScript para manejar errores con información adicional como el código de estado HTTP y detalles específicos del error.
- **Campos**:
  - `statusCode`: Código de estado HTTP asociado con la excepción.
  - `message`: Mensaje descriptivo de la excepción.
  - `errors`: Objeto opcional que puede contener detalles adicionales sobre los errores específicos.

### src/middleware
El directorio [`src/middleware`](/src/middleware/) contiene middleware personalizados para la validación de datos y la autenticación de usuarios.

#### authValidation
El archivo [`authValidation.ts`](/src/middleware/authValidation.ts) maneja la autenticación de los usuarios a través de tokens y asigna roles a los usuarios verificados.
- **Funciones**:
  - `authenticationValidation`: Valida tokens de acceso para autenticar usuarios.
  - `getRoles`: Recupera y adjunta roles al usuario autenticado para su uso posterior en el ciclo de solicitud.

#### pet
El archivo [`pet.ts`](/src/middleware/pet.ts) incluye middleware para validar la creación de publicaciones de mascotas.
- **Funciones**:
  - `petPostValidationMiddleware`: Valida los datos de entrada para publicaciones de mascotas utilizando `class-validator` antes de proceder al manejo de la solicitud.

#### shelter
El archivo [`shelter.ts`](/src/middleware/shelter.ts) proporciona middleware para validar el registro y actualización de refugios.
- **Funciones**:
  - `shelterRegisterValidationMiddleware`: Valida los datos de registro de refugios.
  - `shelterUpdateValidationMiddleware`: Valida los datos de actualización para refugios existentes.

#### user
El archivo [`user.ts`](/src/middleware/user.ts) contiene middleware para la validación de registro y actualización de usuarios.
- **Funciones**:
  - `userRegisterWithRolesValidationMiddleware`: Valida el registro de nuevos usuarios, incluyendo roles específicos.
  - `userRegisterValidationMiddleware`: Valida el registro de usuarios sin roles específicos.
  - `userUpdateValidationMiddleware`: Valida la actualización de datos de usuarios existentes.

### src/model
El directorio [`src/model`](/src/model/) contiene definiciones de tipos y enumerados utilizados en todo el proyecto para mantener la consistencia y facilitar la comprensión del código.
#### FirebaseUser
El archivo [`firebaseUser.ts`](/src/model/firebaseUser.ts) define el tipo `FirebaseUser` que modela los datos del usuario autenticado mediante Firebase.
- **Campos**:
  - `iss`: Emisor del token.
  - `aud`: Audiencia del token.
  - `auth_time`: Tiempo de autenticación.
  - `user_id`: Identificador único del usuario.
  - `sub`: Sujeto del token.
  - `iat`: Tiempo de emisión del token.
  - `exp`: Tiempo de expiración del token.
  - `email`: Correo electrónico del usuario.
  - `email_verified`: Indica si el correo está verificado.
  - `firebase`: Contiene información específica de Firebase como `identities` y `sign_in_provider`.

#### PetStatus
El archivo [`petStatus.ts`](/src/model/petStatus.ts) define un enumerado `PetStatus` que representa el estado de la mascota.
- **Valores**:
  - `AVAILABLE`: La mascota está disponible.
  - `ADOPTED`: La mascota ha sido adoptada.

#### Sex
El archivo [`sex.ts`](/src/model/sex.ts) define un enumerado `Sex` para especificar el sexo de una mascota.
- **Valores**:
  - `MALE`: Masculino.
  - `FEMALE`: Femenino.

#### PetType
El archivo [`petType.ts`](/src/model/petType.ts) define un enumerado `PetType` que categoriza tipos de mascotas.
- **Valores**:
  - `DOG`: Perro.
  - `CAT`: Gato.
  - `BIRD`: Ave.
  - `REPTILE`: Reptil.
  - `RABBIT`: Conejo.
  - `OTHER`: Otros tipos de mascotas.

#### dto
El directorio [`src/model/dto`](/src/model/dto/) contiene objetos de transferencia de datos (DTO) que se utilizan para transferir datos entre la API y los servicios.

##### UserRegisterDTO
Archivo: [`userRegisterDTO.ts`](/src/model/dto/userRegisterDTO.ts)
- **Descripción**: Define los datos necesarios para registrar un usuario.
- **Campos**:
  - `email`: Dirección de correo del usuario.
  - `password`: Contraseña del usuario.
  - `names`: Nombres del usuario.
  - `paternalSurname`: Apellido paterno.
  - `maternalSurname`: Apellido materno.
  - `countryCode`: Código del país.
  - `phone`: Número de teléfono.
  - `age`: Edad.
  - `city`: Ciudad.

##### UserRegisterRolesDTO
Archivo: [`userRegisterRolesDTO.ts`](/src/model/dto/userRegisterRolesDTO.ts)
- **Descripción**: Datos para registrar un usuario con roles específicos.
- **Campos**:
  - `roles`: Roles del usuario.
  - Incluye todos los campos de `UserRegisterDTO`.

##### ShelterRegisterDTO
Archivo: [`shelterRegisterDTO.ts`](/src/model/dto/shelterRegisterDTO.ts)
- **Descripción**: Datos necesarios para registrar un refugio.
- **Campos**:
  - `name`: Nombre del refugio.
  - `location`: Ubicación.
  - `urlPage`: Página web.
  - `countryCode`: Código del país.
  - `phone`: Teléfono.
  - `photo`: Foto del refugio.

##### ShelterUpdateDTO
Archivo: [`shelterUpdateDTO.ts`](/src/model/dto/shelterUpdateDTO.ts)
- **Descripción**: Datos para actualizar la información de un refugio.
- **Campos**: Mismos que `ShelterRegisterDTO`, pero todos son opcionales.

##### PetPostRequestDTO
Archivo: [`petPostRequestDTO.ts`](/src/model/dto/petPostRequestDTO.ts)
- **Descripción**: Datos para publicar una nueva mascota.
- **Campos**:
  - `name`: Nombre de la mascota.
  - `age`: Edad.
  - `sex`: Sexo.
  - `breed`: Raza.
  - `description`: Descripción.
  - `type`: Tipo de mascota.
  - `photos`: Fotos de la mascota.

##### PetPostResponseDTO
Archivo: [`petPostResponseDTO.ts`](/src/model/dto/petPostResponseDTO.ts)
- **Descripción**: Estructura de la respuesta de una publicación de mascota.
- **Campos**:
  - `id`: ID de la publicación.
  - `pet`: Datos detallados de la mascota.
  - `user`: Datos del usuario que realiza la publicación.
  - `contact`: Información de contacto.
  - `status`: Estado de la mascota.

##### PetShelterPostResponseDTO
Archivo: [`petShelterPostResponseDTO.ts`](/src/model/dto/petShelterPostResponseDTO.ts)
- **Descripción**: Respuesta detallada de una publicación de mascota en un refugio.
- **Campos**:
  - `id`: ID de la publicación.
  - `pet`: Datos de la mascota.
  - `shelter`: Datos del refugio.
  - `contact`: Información de contacto.
  - `status`: Estado de la mascota.

##### ShelterResponse
Archivo: [`shelterResponse.ts`](/src/model/dto/shelterResponse.ts)
- **Descripción**: Datos de respuesta para un refugio.
- **Campos**:
  - `id`: ID del refugio.
  - `name`: Nombre.
  - `location`: Ubicación.
  - `urlPage`: Página web.
  - `countryCode`: Código del país.
  - `phone`: Teléfono.
  - `photo`: Foto.

##### GetAllPetPostsResponseDTO
Archivo: [`getAllPetPostsResponseDTO.ts`](/src/model/dto/getAllPetPostsResponseDTO.ts)
- **Descripción**: Respuesta para la consulta de todas las publicaciones de mascotas.
- **Campos**:
  - `id`: ID de la publicación.
  - `pet`: Información detallada de la mascota.
  - `user`: Información del usuario que publica.
  - `contact`: Información de contacto.
  - `status`: Estado de la publicación.

##### GetAllPetsInShelterResponseDTO
Archivo: [`getAllPetsInShelterResponseDTO.ts`](/src/model/dto/getAllPetsInShelterResponseDTO.ts)
- **Descripción**: Respuesta para la consulta de todas las mascotas en un refugio.
- **Campos**:
  - `petPosts`: Lista de publicaciones de mascotas en el refugio.
  - `shelter`: Datos del refugio.

##### UserUpdateDTO
Archivo: [`userUpdateDTO.ts`](/src/model/dto/userUpdateDTO.ts)
- **Descripción**: Define los datos para actualizar un usuario existente.
- **Campos**:
  - `names`: Nombres del usuario.
  - `paternalSurname`: Apellido paterno.
  - `maternalSurname`: Apellido materno.
  - `countryCode`: Código del país.
  - `phone`: Número de teléfono.
  - `age`: Edad.
  - `city`: Ciudad.

##### UserResponse
Archivo: [`userResponse.ts`](/src/model/dto/userResponse.ts)
- **Descripción**: Estructura de la respuesta para los datos de un usuario.
- **Campos**:
  - `id`: Identificador único del usuario.
  - `email`: Dirección de correo electrónico.
  - `names`: Nombres del usuario.
  - `paternalSurname`: Apellido paterno.
  - `maternalSurname`: Apellido materno.
  - `countryCode`: Código del país.
  - `phone`: Número de teléfono.
  - `age`: Edad.
  - `city`: Ciudad.
  - `roles`: Lista de roles asignados al usuario, cada uno con `id` y `name`.

### src/repository
El directorio [`src/repository`](/src/repository/) contiene clases que encapsulan la lógica de acceso a la base de datos y simplifican las operaciones CRUD en las entidades.

#### s3Repository
El archivo [`s3Repository.ts`](/src/repository/s3Repository.ts) contiene funciones para interactuar con AWS S3, incluyendo subir, eliminar y obtener URLs firmadas de archivos.
- **Funciones Principales**:
  - `uploadFile`: Sube un archivo a S3.
  - `deleteFile`: Elimina un archivo de S3.
  - `getSignedUrlByPath`: Genera una URL firmada para acceso público a un archivo por un tiempo limitado.

#### userRepository
El archivo: [`userRepository.ts`](/src/repository/userRepository.ts) maneja operaciones relacionadas con usuarios en la base de datos.
- **Funciones Principales**:
  - `insertUserWithRoles`: Inserta un nuevo usuario con roles específicos.
  - `insertUser`: Inserta un nuevo usuario sin roles específicos.
  - `getUserByEmail`: Busca un usuario por correo electrónico.
  - `updateUserInfoByEmail`: Actualiza la información de un usuario.
  - `deleteUserInfoByEmail`: Elimina un usuario por correo electrónico.

#### petRepository
El archivo [`petRepository.ts`](/src/repository/petRepository.ts) gestiona operaciones de base de datos relacionadas con mascotas, incluyendo la creación de publicaciones y la gestión de fotos de mascotas.
- **Funciones Principales**:
  - `insertPetPostWithPetAndPhotos`: Crea una nueva mascota con fotos y una publicación asociada.
  - `insertPetPostWithPetAndPhotosToShelter`: Asigna una mascota y fotos a un refugio y crea una publicación.
  - `findPetsByShelterId`: Encuentra todas las publicaciones de mascotas asociadas a un refugio específico.

#### shelterRepository
El archivo [`shelterRepository.ts`](/src/repository/shelterRepository.ts) es encargado de las operaciones de base de datos para los refugios, incluyendo la creación, actualización y eliminación de refugios.
- **Funciones Principales**:
  - `insertShelter`: Inserta un nuevo refugio.
  - `updateShelter`: Actualiza un refugio existente.
  - `getShelterById`: Recupera un refugio por su ID.
  - `getAllShelters`: Obtiene todos los refugios registrados.
  - `deleteShelter`: Elimina un refugio.

### src/route


## LICENSE
<!DOCTYPE html>
<html lang="es">
<body>
    <p>
        <a href="https://github.com/Little-Paw-last-dance/backend_littlepaw.git" target="_blank">Little-Paw-last-dance Backend</a> © 2024 por Little Paw está licenciado bajo 
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="license noopener noreferrer">
            Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" style="height:22px; margin-left:3px; vertical-align:text-bottom;">
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" style="height:22px; margin-left:3px; vertical-align:text-bottom;">
            <img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC" style="height:22px; margin-left:3px; vertical-align:text-bottom;">
            <img src="https://mirrors.creativecommons.org/presskit/icons/nd.svg" alt="ND" style="height:22px; margin-left:3px; vertical-align:text-bottom;">
        </a>
    </p>
</body>
</html>