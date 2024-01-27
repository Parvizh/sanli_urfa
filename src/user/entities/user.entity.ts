import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Role } from "../../auth/entities/role.entity";
import { Address } from '../../address/entities/address.entity'
import { Order } from "src/order/entities/order.entity";
import { PaymentToken } from "../../payment/entities/payment-token.entity";

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  imageUrl: string;

  @Column({
    type: 'boolean',
    default: false
  })
  isConfirmed: boolean;

  @ManyToOne(type => Role, (role) => role.users)
  role: Role;

  @RelationId((user: User) => user.role)
  @Column()
  roleId: number;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}