import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'json' })
    cart: JSON;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({
        type: 'boolean',
        default: false
    })
    isDelivered: boolean

    @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
    user: User;
}