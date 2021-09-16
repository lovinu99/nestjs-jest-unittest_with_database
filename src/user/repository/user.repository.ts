import { Repository, EntityRepository, Connection, Transaction, TransactionManager, EntityManager, Brackets } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { HttpException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    constructor(
        private conn: Connection
    ) {
        super();
    }

    public async createUser(createUserDto: CreateUserDto
    ): Promise<User | any> {
        return await this.conn.transaction(async manager => {
            try {
                const repo = manager.getCustomRepository(UserRepository)

                const newUser = new User(createUserDto)

                return await newUser.save()
            } catch (error) {
                return {
                    message: "created fail, " + error.message,
                    status: 403
                }
            }
        })

    }

    public async findUserWithFilter(query: any): Promise<User[]> {
        const builder = this.createQueryBuilder('user')
        for (let i in query) {
            const parameterName = "token" + i;
            const querystring = "user."+i+" = :"
            builder.orWhere(new Brackets(tokenQb => {
                tokenQb.where(querystring + parameterName);
            })).setParameter(parameterName, query[i]);
        }
        return await builder.getMany()
    }

    public async saveUser(user: User) {
        return await this.save(user)
    }
    public async getById(id: number): Promise<User> {
        return await this.findOne(id)
    }

    public async getByUsername(username: string): Promise<User> {
        return await this.findOne({ username: username })
    }

    async updateUser(updateData: UpdateUserDTO, userId: number): Promise<any> {
        return await this.conn.transaction(async manager => {
            const repo = manager.getCustomRepository(UserRepository)
            try {
                await repo.update(userId, {
                    name: updateData.name,
                    email: updateData.email
                })
                return {
                    status: 200,
                    message: "Updated"
                }
            } catch (error) {
                throw new HttpException("Update failed", 401)
            }
        })
    }

    async deleteUser(userId: number): Promise<any> {
        return await this.conn.transaction(async manager => {
            const repo = manager.getCustomRepository(UserRepository)
            try {
                await repo.delete(userId)
                return {
                    status: 200,
                    message: "Deleted"
                }
            } catch (error) {
                throw new HttpException("Delete failed", 401)
            }
        })

    }
}