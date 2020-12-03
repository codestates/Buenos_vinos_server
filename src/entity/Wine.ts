import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    AfterLoad,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterInsert,
    AfterUpdate
} from 'typeorm';

import { Type } from './Type'
import { Country } from './country'

@Entity({
    name: 'wine',
})
export class Wine extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    wine: string;

    @Column()
    wine_kr: string;

    @Column()
    image: string;

    @Column()
    types_id: number;

    @Column()
    body: number;

    @Column()
    sweet: number;

    @Column()
    acidic: number;

    @Column()
    counties_id: number;

    @Column()
    alcohol_content: string;

    @Column()
    winery: string;

    @Column()
    content: string;

    @Column()
    rating_sum: number;

    @Column()
    rating_count: number;

    @CreateDateColumn({
        name: "created_at"
      })
    createdAt: Date;
    
    
    @Column()
    rating: number;

    @BeforeInsert()
    @BeforeUpdate()
    @AfterInsert()
    @AfterLoad()
    calculrateRating() {
        this.rating = this.rating_sum / this.rating_count
        // this.rating = (this.rating_sum / this.rating_count).toFixed(1)
    }

    @OneToMany((type) => Type, (type) => type.wine)
    type: Type[];

    @OneToMany((country) => Country, (country) => country.wine)
    country: Country[];
 }