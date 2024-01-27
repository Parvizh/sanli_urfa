import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from "typeorm";

@Entity()
export class SliderImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    imageUrl: string;
}
