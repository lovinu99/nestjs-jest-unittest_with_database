import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {  getTreeRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { User } from '../src/user/entities/user.entity';
import { UserService } from '../src/user/services/user.service';


// run test: npm test

/**
 * Sử dụng mock khi muốn tạo một bộ test giả cho chức năng, tránh phụ thuộc vào các chức năng khác
 * Ví dụ: UserServices được DI tiêm vào từ UserRepository
 * method findAll() của UserServices, sử dụng method find() của UserRepository
 * khi đó, ta sử dụng mock để tạo một fake UserRepository, tạo một hàm find() fake trả về kết quả ta muốn
 * ( Như trong trường hợp bên dưới, fake hàm find() trả về giá trị ta muốn là mảng User[] ta đã tạo)
 * Như vậy, method findAll() của services sẽ lấy giá trị từ hàm find() fake này để xử lý
 * cuối cùng trả về kết quả
 * ta sẽ so sánh kết quả đó với kết quả mong muốn bằng expect
 * 
 * Cách này hữu dụng khi ta không biết cách hoạt động của các hàm bên trong, ta chỉ quan tâm đến việc xử lý
 * của hàm ta đang test. Hoặc trong các trường hợp không muốn phụ thuộc vào các yếu tố khác như API, Database
 */


// fake UserRepository
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


    // trước mỗi test case
    beforeEach(async () => {
        // tạo module test
        module = await Test.createTestingModule({
            imports: [
                // do có sử dụng bycrt và .env nên cần import module này để setup
                ConfigModule.forRoot(),
            ],
            // import các thành phần cần thiết
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: fakeUserRepository,
                },
            ],
        }).compile();

        // tạo các biến cần dùng.
        service = module.get<UserService>(UserService);
        repository = module.get(getRepositoryToken(User));
    })


    // bọc các test case
    describe('UserServices', () => {

        // 1 test case
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


