import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from './../../user/entities/user.entity';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    city: string;

    @Column({ type: 'varchar' })
    district: string;

    @Column({ type: 'varchar' })
    avenue: string;

    @Column({ type: 'int' })
    building: number;

    @Column({
        type: 'varchar',
        length: 10
    })
    block: string;

    @Column({ type: 'int' })
    floor: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({ type: 'int' })
    flat: number

    @Column({
        type: 'varchar',
        nullable: true
    })
    title: string;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
    user: User;
}