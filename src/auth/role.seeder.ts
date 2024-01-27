import { Injectable } from "@nestjs/common";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class RoleSeeder implements Seeder {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private readonly dataSource: DataSource
    ) { }

    async seed() {
        const defaultRoles = [
            this.roleRepository.create({ name: 'admin' }),
            this.roleRepository.create({ name: 'user' })
        ];

        return this.dataSource
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values(defaultRoles)
            .execute();
    }

    async drop() {
        return this.roleRepository.delete({});
    }
}