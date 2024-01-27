import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

({})

@Entity()
export class PaymentToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", unique: true})
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}