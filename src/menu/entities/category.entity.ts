import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({
        type: 'varchar',
        unique: true
    })
    categoryId: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}