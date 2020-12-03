import {
    Entity,
    ManyToOne,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Wine } from './Wine'

@Entity({
    name: 'country',
})
export class Country extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    image: string;

    @ManyToOne(
        (type) => Wine,
        (wine) => wine.country, {onDelete: 'CASCADE'})
    wine: Wine
}