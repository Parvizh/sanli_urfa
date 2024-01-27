import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vacancy } from "./vacancy.entity";

@Entity()
export class VacancyRequirement extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    requirement: string;

    @ManyToOne(() => Vacancy, (vacancy) => vacancy.requirements, { onDelete: "CASCADE" })
    vacancy: Vacancy;
}