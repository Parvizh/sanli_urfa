import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Vacancy } from './vacancy.entity';

@Entity()
export class VacancyInformation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    information: string;

    @ManyToOne(() => Vacancy, (vacancy) => vacancy.information, { onDelete: "CASCADE" })
    vacancy: Vacancy;
}