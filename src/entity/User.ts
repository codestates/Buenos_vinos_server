import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Wine } from './Wine'
import { Comment } from './Comment'


@Entity({
    name: 'user',
})
    @Unique(['email'])
    
export class User extends BaseEntity {
    //
    @PrimaryGeneratedColumn()
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
    
    @OneToMany((comment) => Comment, (comment) => comment.user)
    comment: Comment[];

    @ManyToMany(() => Wine, (wine: Wine) => wine.user)
    wine: Wine[]

    
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}