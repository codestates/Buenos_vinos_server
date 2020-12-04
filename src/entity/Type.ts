
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
    name: 'type',
})
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "longtext"
    })
    type_content: string;

    @Column({
        type: "longtext"
    })
    sweet_content: string;

    @Column({
        type: "longtext"
    })
    acidic_content: string;

    @Column({
        type: "longtext"
    })
    body_content: string;

    @OneToMany((wine) => Wine, (wine) => wine.type)
    wine: Wine[];


 }