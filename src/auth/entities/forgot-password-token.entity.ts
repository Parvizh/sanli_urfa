import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class ForgotPasswordToken {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    token: string;

    @Column({
        type: 'boolean',
        default: false
    })
    isConfirmed: boolean;

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}