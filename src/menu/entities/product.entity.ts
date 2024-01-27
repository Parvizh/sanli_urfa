import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn, RelationId } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    itemId: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'varchar',
        nullable: true
    })
    imageUrl: string;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE' })
    category: Category;

    @RelationId((product: Product) => product.category)
    @Column()
    categoryId: number;
}