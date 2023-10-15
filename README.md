
## Description

This is the server-side component of my personal pet project, which is an advanced task list designed for organizing various events. Currently, it includes the following features:

1. User registration logic with email confirmation requirement.
2. User profile information editing.
3. Avatar uploads.
4. User connectivity logic (adding friends).
5. Privacy settings to control the visibility of personal information (everyone, only contacts, nobody).
6. Chat functionality between connected users with message delivery and read status tracking.
7. Creation, editing, and deletion of events.
8. Image uploads with thumbnail generation logic associated with specific events.

The application is built using the NestJS framework, and MongoDB is used as the database. The following libraries were utilized in the project:

* `@nestjs/common`: Core library for building Nest applications.
* `@nestjs/config`: Library for configuration management.
* `@nestjs/jwt`: JSON Web Token (JWT) authentication module.
* `@nestjs/mongoose`: Module for integrating MongoDB with Nest.
* `@nestjs/passport`: Authentication middleware for Nest applications.
* `@nestjs/platform-express`: Integration of Express with Nest.
* `@nestjs/platform-socket.io`: WebSockets integration for real-time communication.
* `@nestjs/platform-ws`: WebSockets support for Nest.
* `@nestjs/swagger`: Swagger documentation integration.
* `@nestjs/websockets`: WebSockets module for Nest.
* `bcrypt`: Library for password hashing and validation.
* `class-validator`: Validation library for TypeScript.
* `dotenv`: Environment variable management.
* `mongoose`: MongoDB object modeling for Node.js.
* `passport-jwt`: Passport strategy for JWT authentication.
* `passport-local`: Passport strategy for local username and password authentication.
* `rxjs`: Reactive Extensions for JavaScript.
* `sharp`: High-performance image processing.
* `socket.io`: Real-time, bidirectional communication library.
## Installation

```bash
$ npm install
```
#### Create a `.env` file end fill it, following the example in the `.env.example` file

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```




## Stay in touch

- Author - Oleksii Medvediev
- Linkedin - https://www.linkedin.com/in/link-oleksii-medvediev/

#
