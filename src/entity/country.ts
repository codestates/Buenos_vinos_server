import {
    Entity,
    ManyToOne,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';

import { Wine } from './Wine'

@Entity({
    name: 'country',
})
export class Country extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

    @OneToMany((wine) => Wine, (wine) => wine.country)
    wine: Wine[];
}