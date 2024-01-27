import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { News } from "./news.entity";

@Entity()
export class NewsTranslation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar" })
  lang: string;

  @Column({type: "varchar"})
  title: string;

  @Column({type: "text"})
  description: string;

  @ManyToOne(() => News, (news) => news.translations, { onDelete: "CASCADE" })
  news: News;
}