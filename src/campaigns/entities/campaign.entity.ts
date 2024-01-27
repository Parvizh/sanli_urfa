import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Campaign extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    imageUrl: string;
}