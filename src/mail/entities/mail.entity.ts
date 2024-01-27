import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  fullName: string;

  @Column({ type: "varchar" })
  mobile: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
