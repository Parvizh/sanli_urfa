import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { HttpService } from "@nestjs/axios";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import * as https from "https";
import * as fs from "fs";
import { Connection, QueryRunner, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { v4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentToken } from "./entities/payment-token.entity";

const parser = new XMLParser();
const builder = new XMLBuilder({});

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentToken) private readonly paymentTokenRepository: Repository<PaymentToken>,
    private readonly httpService: HttpService,
    private readonly connection: Connection
  ) { }

  async create(createPaymentDto: CreatePaymentDto, user: User): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const token: string = v4();
      const paymentTokenData = this.paymentTokenRepository.create({ token, user });
      if (!paymentTokenData) throw new BadRequestException('Could not create a token!');
      const paymentToken = await this.paymentTokenRepository.save(paymentTokenData);
      if (createPaymentDto.paymentType === 'Cash') return { payment_token: paymentToken.token };

      const url: string = process.env.CAPITAL_BASE_URL + ':' + process.env.CAPITAL_PORT + '/Exec';
      const objectBody = {
        TKKPG: {
          Request: {
            Operation: 'CreateOrder',
            Language: createPaymentDto.language,
            Order: {
              OrderType: 'Purchase',
              Merchant: 'E1000010',
              Amount: createPaymentDto.amount * 100,
              Currency: 944,
              Description: 'xxxxxxxx',
              ApproveURL: `${process.env.BASE_URL}/payment/success/${token}`, //to be changed to confirm URl
              CancelURL: `${process.env.BASE_URL}/payment/failed/${token}`,
              DeclineURL: `${process.env.BASE_URL}/payment/failed/${token}`
            }
          }
        }
      };
      const xmlBody = builder.build(objectBody);
      const config = {
        headers: { "Content-Type": "application/xml" },
        httpsAgent: new https.Agent({
          host: process.env.CAPITAL_HOST,
          port: parseInt(process.env.CAPITAL_PORT),
          path: '/',
          rejectUnauthorized: false,
          cert: fs.readFileSync("./src/helpers/kapital-certificates/digitest.crt", 'utf-8'),
          key: fs.readFileSync("./src/helpers/kapital-certificates/digitest.key", 'utf-8'),
          passphrase: process.env.CAPITAL_PASSPHRASE
        })
      };

      const response = await this.httpService.axiosRef.post(url, xmlBody, config);

      if (response) {
        await queryRunner.commitTransaction();

        return parser.parse(response.data);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();

      console.error(error)
    } finally {
      await queryRunner.release();
    }
  }

  async deletePaymentToken(token: string) {
    try {
      const paymentToken = await this.paymentTokenRepository.findOneBy({ token });
      if (!paymentToken) throw new NotFoundException('Could not find payment token!')
      await this.paymentTokenRepository.remove(paymentToken);

      return { message: 'Successfully deleted payment token' };
    } catch (error) {
      console.error(error);

      return { message: error.message };
    }
  }
}