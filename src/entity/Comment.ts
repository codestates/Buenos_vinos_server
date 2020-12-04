import {
    Entity,
    ManyToOne,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn
} from 'typeorm';
import { User } from './User';
import { Wine } from './Wine';

@Entity({
    name: 'comment',
})
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(
        (comment) => Wine,
        (wine) => wine.comment, { cascade: ["insert", "update", "remove"]})
        wine: Wine
    
    @ManyToOne(
        (comment) => User,
        (user) => user.comment, { cascade: ["insert", "update", "remove"]})
        user: User
    
    @Column({
        type: "longtext"
    })
    content: string

    @Column()
    rating: number

    @CreateDateColumn({
        name: "created_at"
      })
    createdAt: Date;



}