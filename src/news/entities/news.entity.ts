import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewsTranslation } from "./news-translation.entity";

@Entity()
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar"})
  imageUrl: string;

  @Column({type: "date"})
  date: Date;

  @OneToMany(() => NewsTranslation, (newsTranslation) => newsTranslation.news)
  translations: NewsTranslation[];
}