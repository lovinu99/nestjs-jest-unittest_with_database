import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { UserService } from '../src/user/services/user.service';
import { getConnection, Repository } from 'typeorm';



/**
 * *************** Trong tài liệu họ khuyên nên tránh test bằng cách query database ( avoid hit database ....)
 * 
 * cách này cần phải import Typeorm vào để config connection
 * hiểu đơn giản thì như ta tạo module, cần gì để chạy thì import, provid nó vào
 * để query db thì ta dùng typeorm, nên ta import nó vào
 * config nó tới 1 database để test
 * 
 * so với cách mock thì cách này dùng trực tiếp mấy class có sẵn ( dùng UserServices, các Repository từ Typeorm)
 * nên sẽ phụ thuộc vào database và typeorm
 * trong trường hợp muốn test các case không có sẵn trong database thì test = mock sẽ tiện hơn
 * 
 * flow: 
 *      tạo module test, tùy chỉnh conncection để typeorm tự chạy migrate, drop db,...
 *      chạy theo thứ tự các it, như bên dưới thì create > FindAll > update > delete
 *      xem log để thấy các câu query và kết quả
 * 
 * đọc ghi chú ở từng line để rõ hơn
 */
describe('UserServices', () => {
    let token = getRepositoryToken(User)
    let service: UserService;
    let repository: Repository<User>
    let module: TestingModule;

    // call cloud nên tốn thêm thời gian, lệnh này để đủ time connect
    jest.setTimeout(600000)

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                //
                ConfigModule.forRoot(),
                // khai báo typeorm để liên kết tới, migrationsRun: true - synchronize: true để database tự drop sau test
                // log sau khi test sẽ thấy các lệnh như migrate table, drop table,...
                TypeOrmModule.forRoot({
                    type: "mssql",
                    host: "181.215.242.79",
                    port: 16544,
                    username: "admin",
                    password: "adminADMIN1",
                    database: "testing",
                    logging: ["query", "error"],
                    entities: [
                        User
                    ],
                    migrationsRun: true,
                    synchronize: true,
                    autoLoadEntities: true,
                    extra: {
                        "validateConnection": true,
                        "trustServerCertificate": true
                    }
                }),
                TypeOrmModule.forFeature([User]),

            ],
            providers: [
                UserService
            ],
        }).compile();
        service = module.get<UserService>(UserService);
        repository = module.get(token);
    })

    afterAll(async () => {
        getConnection().close()
    })
    describe('UserServices', () => {
        var id: number

        it('create an user, return created user', async () => {
            const createUserDTO = {
                name: "jest_testing",
                username: "jest_testing",
                password: "123456",
                email: "jest_testing",
                role: "admin"
            }
            const result = await service.create(createUserDTO)
            console.log(result)
            id = result.id
            console.log(id)
            expect(result.name).toEqual("jest_testing");
        });

        it('get all user, return array of User', async () => {
            const result = await service.findAll()
            console.log(result)
            expect(result).toBeInstanceOf(Array);
        });

        it('update an user, id: '+ id, async () => {
            const createUserDTO = {
                name: "jest_testing",
                email: "jest_testing"
            }
            const result = await service.update(createUserDTO,id)
            console.log(result)
            expect(result.status).toEqual(200);
        });

        it('delete an user, id: '+ id, async () => {
            const result = await service.delete(id)
            console.log(result)
            expect(result.status).toEqual(200);
        });

    });
})


