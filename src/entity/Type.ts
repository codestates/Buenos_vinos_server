
import {
    Entity,
    ManyToOne,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Wine } from './Wine'

@Entity({
    name: 'type',
})
export class Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

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

    @ManyToOne(
        (type) => Wine,
        (wine) => wine.types_id, {onDelete: 'CASCADE'})
    wine: Wine
 }