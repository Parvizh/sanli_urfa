import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { VacancyRequirement } from './vacancy-requirement.entity';
import { VacancyInformation } from './vacancy-information.entity';

@Entity()
export class Vacancy extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    expiresAt: string;

    @Column({ type: 'varchar' })
    vacancy: string;

    @Column({ type: 'varchar' })
    location: string;

    @Column({ type: 'varchar' })
    lang: string;

    @OneToMany(() => VacancyRequirement, (vacancyRequirement) => vacancyRequirement.vacancy)
    requirements: VacancyRequirement[];

    @OneToMany(() => VacancyInformation, (vacancyInformation) => vacancyInformation.vacancy)
    information: VacancyInformation[];
}
