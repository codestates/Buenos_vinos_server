import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    AfterLoad,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate,
    ManyToMany,
    JoinTable
} from 'typeorm';

import { Type } from './Type'
import { Country } from './country'
import { Food } from './food';
import { User } from './User'
import { Comment } from './Comment';


@Entity({
    name: 'wine',
})
export class Wine extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    name_en: string;

    @Column()
    image: string;

    @Column()
    body: number;

    @Column()
    sweet: number;

    @Column()
    acidic: number;

    @Column()
    alcohol_content: string;

    @Column()
    winery: string;

    @Column({
        type: "longtext"
    })
    content: string;

    @Column()
    rating_sum: number;

    @Column()
    rating_count: number;

    @CreateDateColumn({
        name: "created_at"
      })
    createdAt: Date;
    
    @Column({
        type: 'decimal',
        precision: 5,
        scale: 1,
        default: 0
    })
    rating: number;

    @BeforeInsert()
    @BeforeUpdate()
    @AfterInsert()
    @AfterLoad()
    calculrateRating() {
        this.rating = this.rating_sum / this.rating_count
    }

    @ManyToOne(
        (wine) => Type,
        (type) => type.wine, { onDelete: 'CASCADE' })
        type: Type

    @ManyToOne(
        (wine) => Country,
        (country) => country.wine, { onDelete: 'CASCADE' })
        country: Country
    
    @ManyToMany(() => Food)
    @JoinTable({
        name: 'wine_food'
    })
    food: Food[];

    @ManyToMany(() => User, (user: User) => user.wishlist, { cascade: ["insert", "update", "remove"]})
    wishlist: User[]

    @OneToMany((comment) => Comment, (comment) => comment.wine)
    comment: Comment[];
 }