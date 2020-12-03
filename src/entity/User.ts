import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity({
    name: 'user',
})
    @Unique(['email'])
    
export class User extends BaseEntity {
    //
    @PrimaryGeneratedColumn({
        name: 'id_user',
    })
    id: number;

    @Column()
    @Length(4, 20)
    email: string;

    @Column({
        unique: true
    })
    nickname: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column({
        nullable: true
    })
    google: string;

    @Column({
        nullable: true
    })
    facebook: string;

    @Column({
        nullable: true
    })
    kakao: string;

    @CreateDateColumn({
        name: "created_at"
      })
      createdAt: Date;

    
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}