import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {  getTreeRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { User } from '../src/user/entities/user.entity';
import { UserService } from '../src/user/services/user.service';


class fakeUserRepository {
    db: User[] = [
        new User(),
        new User(),
        new User(),
        new User()
    ]

    constructor() {
        this.db.forEach(i => {
            i.username = this.db.indexOf(i).toString()
        })
    }

    find() {
        return this.db
    }

    findOne(id: number) {
        return this.db[id]
    }

    createUser(dto: CreateUserDto) {
        const user = new User()
        this.db.push(user)
        return user
    }
    save(dto: CreateUserDto) {
        const user = new User()
        this.db.push(user)
        return user
    }

    delete(id: number) {
        delete this.db[id]
        return true
    }



}

describe('UserServices', () => {
    let service: UserService;
    let repository: Repository<User>;
    let module: TestingModule;

    jest.setTimeout(600000)


    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: fakeUserRepository,
                },
            ],
        }).compile();
        service = module.get<UserService>(UserService);
        repository = module.get(getRepositoryToken(User));
    })


    describe('UserServices', () => {

        it('get all user', async () => {
            const result = await service.findAll()
            console.log(result)
            expect(result).toBeInstanceOf(Array);
        });

        it('create user', async () => {
            const dto = new CreateUserDto()
            dto.password = "123456"
            const result = await service.create(dto)
            console.log(result)
            expect(result).toBeInstanceOf(User)
        });

        it('get an user by id', async () => {
            const id = 2
            const result = await service.findOneByID(id);
            expect(result.username).toEqual(id.toString());
        });

        it('delete an user', async () => {
            const id = 2
            const result = await service.delete(id);
            expect(result.status).toEqual(200);
        });
    });
})


