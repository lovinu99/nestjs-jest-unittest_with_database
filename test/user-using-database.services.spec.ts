// import { Logger } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
// import { connect } from 'http2';
// import { combineLatestInit } from 'rxjs/internal/observable/combineLatest';
// import { User } from '../src/user/entities/user.entity';
// import { UserRepository } from '../src/user/repository/user.repository';
// import { UserService } from '../src/user/services/user.service';
// import { UserModule } from '../src/user/user.module';
// import { BaseEntity, getConnection, getConnectionOptions, getCustomRepository, Repository } from 'typeorm';


// describe('UserServices', () => {
//     let token = getRepositoryToken(User)
//     let service: UserService;
//     let repository: Repository<User>
//     let module: TestingModule;

//     jest.setTimeout(600000)

//     beforeAll(async () => {
//         // let connect = await createTestingConnections
//         module = await Test.createTestingModule({
//             imports: [
//                 ConfigModule.forRoot(),
//                 TypeOrmModule.forRoot({
//                     type: "mssql",
//                     host: "181.215.242.79",
//                     port: 16544,
//                     username: "admin",
//                     password: "adminADMIN1",
//                     database: "testing",
//                     logging: ["query", "error"],
//                     entities: [
//                         User
//                     ],
//                     migrationsRun: true,
//                     synchronize: true,
//                     autoLoadEntities: true,
//                     extra: {
//                         "validateConnection": true,
//                         "trustServerCertificate": true
//                     }
//                 }),
//                 TypeOrmModule.forFeature([User]),

//             ],
//             providers: [
//                 UserService
//             ],
//         }).compile();
//         service = module.get<UserService>(UserService);
//         repository = module.get(token);
//     })

//     afterAll(async () => {
//         getConnection().close()
//     })
//     describe('UserServices', () => {
//         var id: number

//         it('create an user, return created user', async () => {
//             const createUserDTO = {
//                 name: "jest_testing",
//                 username: "jest_testing",
//                 password: "123456",
//                 email: "jest_testing",
//                 role: "admin"
//             }
//             const result = await service.create(createUserDTO)
//             console.log(result)
//             id = result.id
//             expect(result.name).toEqual("jest_testing");
//         });

//         it('get all user, return array of User', async () => {
//             const result = await service.findAll()
//             console.log(result)
//             expect(result).toBeInstanceOf(Array);
//         });

//         it('update an user, id: '+ id, async () => {
//             const createUserDTO = {
//                 name: "jest_testing",
//                 email: "jest_testing"
//             }
//             const result = await service.update(createUserDTO,id)
//             console.log(result)
//             expect(result.status).toEqual(200);
//         });

//         it('delete an user, id: '+ id, async () => {
//             const result = await service.delete(id)
//             console.log(result)
//             expect(result.status).toEqual(200);
//         });

//     });
// })


