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

### logger
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