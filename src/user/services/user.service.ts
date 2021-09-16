import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, getManager, In, Repository, Transaction, TransactionManager } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { response } from 'express';
import { UserRepository } from '../repository/user.repository';
import { async } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) { }


    async create(user: CreateUserDto): Promise<User> {
        const hashPassword = bcrypt.hashSync(user.password, parseInt(process.env.SALTROUNDS))
        user.password = hashPassword
        return await this.repository.save(user)
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find();
    }

    async findWithFilter(query: any): Promise<User[]> {
        return null
    }

    async findOneByID(id: number): Promise<User> {
        return await this.repository.findOne(id)
    }

    async findByIdList(ids: number[]): Promise<User[]> {
        return await this.repository.find({
            where: {
                id: In(ids)
            }
        })
    }

    async findOneByName(name: string): Promise<User> {
        return await this.repository.findOne({ username: name })
    }



    async update(updateData: UpdateUserDTO, userId: number): Promise<any> {
        try {
            await this.repository.update(userId, {
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
    }

    async delete(userId: number): Promise<any> {
        try {
            await this.repository.delete(userId)
            return {
                status: 200,
                message: "Deleted"
            }
        } catch (error) {
            throw new HttpException("Delete failed", 401)
        }
    }
}
