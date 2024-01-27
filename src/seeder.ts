import { seeder } from "nestjs-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./auth/entities/role.entity";
import { RoleSeeder } from "./auth/role.seeder";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Address } from "./address/entities/address.entity";
import { User } from "./user/entities/user.entity";
import { Order } from "./order/entities/order.entity";

seeder({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "mysql",
                host: configService.get("DATABASE_HOST"),
                port: configService.get("DATABASE_PORT"),
                username: configService.get("DATABASE_USER"),
                password: configService.get("DATABASE_PASSWORD"),
                database: configService.get("DATABASE_SCHEMA"),
                autoLoadEntities: true,
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        TypeOrmModule.forFeature([Role, User, Address, Order])
    ]
}).run([RoleSeeder])