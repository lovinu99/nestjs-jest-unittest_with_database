import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../dto/create-user.dto';

@Entity('User')
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 }) 
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({default: 'user'})
  role: string;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  constructor(createUserDTo? :CreateUserDto){
    super();
    this.role = "user"
    if(createUserDTo){
      this.name = createUserDTo.name
      this.username = createUserDTo.username
      this.password = createUserDTo.password
      this.email = createUserDTo.email
      if (createUserDTo.role)
          this.role = createUserDTo.role
    }
  }
}