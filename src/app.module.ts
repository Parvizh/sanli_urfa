import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { ContactInfoModule } from './contact-info/contact-info.module';
import { SocialNetworkLinksModule } from './social-network-links/social-network-links.module';
import { MailModule } from './mail/mail.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { NewsModule } from "./news/news.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { SliderImagesModule } from './slider-image/slider-images.module';
import { HttpModule } from "@nestjs/axios";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { backupMenu } from "./helpers/menu-helper";
import { MenuModule } from './menu/menu.module';
import { AddressModule } from './address/address.module';
import Redis from "ioredis";
import { CartsModule } from "./carts/carts.module";
import { DeliveryModule } from './delivery/delivery.module';
import { OrdersModule } from './order/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from "@adminjs/nestjs";
import * as AdminJSTypeorm from '@adminjs/typeorm'
import AdminJS from 'adminjs'
import { ComponentLoader } from 'adminjs'
import { CampaignOptions } from "./admin/campaigns/campaignOptions";
import { ProductOptions } from "./admin/products/productOptions";
import { ContactOptions }from "./admin/contacts/contactOptions";
import { CategoryOptions } from "./admin/products/categoryOptions";
import { VacancyOptions } from "./admin/vacancies/vacancyOptions";
import { newsOptions } from "./admin/news/newsOptions";
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user/user.service";
import { sliderImagesOptions } from "./admin/slider-images/sliderImagesOptions";
import { socialNetworkLinkOptions } from "./admin/socialNetworkLink/socialNetworkLinkOptions";
import Login from "./admin/login/login";
import { User } from "./user/entities/user.entity";
import { RoleOptions } from "./admin/roles/rolesOptions";
import { UserOptions } from "./admin/users/userOptions";

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
})

AdminJS.prototype.overrideLogin({component: Login})

const componentLoader = new ComponentLoader();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    ScheduleModule.forRoot(),
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          port: configService.get("MAIL_PORT"),
          auth: {
            user: configService.get("MAIL_USER"),
            pass: configService.get("MAIL_PASSWORD")
          }
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>("MAIL_FROM")}>`
        }
      }),
      inject: [ConfigService]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
          onClientCreated: (redisClient: Redis) => {
            redisClient.on('ready', async () => {
              if (! await redisClient.get('carts')) {
                redisClient.set('carts', JSON.stringify({})).then((cartsResponse) => {
                  if (cartsResponse) console.log('Successfully initialized empty carts');
                  else console.log('Error initializing the empty carts');
                });
              }
              // backupMenu(redisClient)
              //   .then(menuResponse => {
              //     if (menuResponse) console.log('Successfully updated whole menu');
              //     else {
              //       console.log('error while doing backup.');
              //       backupMenu(redisClient);
              //     }
              //   })
              //   .catch(err => {
              //     console.log(err);
              //     backupMenu(redisClient);
              //   });
              // setInterval(() => backupMenu(redisClient), 60000000);
            });
            redisClient.on('error', async () => {
              console.log('Error while connecting to client');
            });
          }
        },
      }),
      inject: [ConfigService]
    }),
    AdminModule.createAdminAsync({
      imports: [AuthModule, UserModule],
      inject: [AuthService, UserService],
      useFactory: (authService: AuthService, userService: UserService) => ({
        adminJsOptions: {
          rootPath: '/admin',
          componentLoader,
          env: {
            BASE_URL: process.env.BASE_URL,
          },
          dashboard:{
            component: componentLoader.add('Dashboard', './admin/dashboard/dashboard')
          },
          branding:{
            companyName: 'Shanliurfa Admin Panel',
            withMadeWithLove: false,
            favicon: 'admin-assets/favicon.ico',
            logo: 'admin-assets/default-logo.png',
          },
          resources: [
            ContactOptions(componentLoader),
            ProductOptions(componentLoader),
            CategoryOptions(),
            CampaignOptions(componentLoader),
            VacancyOptions(componentLoader),
            newsOptions(componentLoader),
            sliderImagesOptions(componentLoader),
            socialNetworkLinkOptions(),
            UserOptions(componentLoader),
            RoleOptions()
          ],
        },
        auth: {
          authenticate: async (email, password) => {
            try {
              const login = await authService.login({ email, password });

              const user = await userService.findByEmail(email, true);

              if (user.role.name === 'admin') {
                return Promise.resolve({ email, password, token: login.access_token, baseUrl: process.env.BASE_URL });
              }
              return null;
            } catch (error) {
              console.log(error)
              return null;
            }
    
            
          },
          cookieName: 'adminjs',
          cookiePassword: 'secret'
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret'
        },
      }),
    }),
    HttpModule,
    ContactInfoModule,
    SocialNetworkLinksModule,
    MailModule,
    CampaignsModule,
    NewsModule,
    UserModule,
    AuthModule,
    VacanciesModule,
    SliderImagesModule,
    MenuModule,
    AddressModule,
    CartsModule,
    DeliveryModule,
    OrdersModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }