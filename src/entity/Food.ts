import {
    Entity,
    ManyToOne,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany
} from 'typeorm';
import { Wine } from './Wine'

@Entity({
    name: 'food',
})
export class Food extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

}