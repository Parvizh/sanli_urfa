import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { HttpService } from "@nestjs/axios";
import { Cart, CartsService } from "src/carts/carts.service";
import { AddressService } from "src/address/address.service";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { OrdersService } from "src/order/orders.service";
import { PaymentService } from "../payment/payment.service";
import { Connection, QueryRunner } from "typeorm";

@Injectable()
export class DeliveryService {
    constructor(
        private readonly cartsService: CartsService,
        private readonly httpService: HttpService,
        private readonly addressService: AddressService,
        private readonly orderService: OrdersService,
        private readonly paymentService: PaymentService,
        private readonly connection: Connection
    ) { }

    async create(user: User, cartToken: string, createDeliveryDto: CreateDeliveryDto): Promise<any> {
        const queryRunner: QueryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cart: Cart = await this.cartsService.getByToken(cartToken);
            if (!cart.addressId) throw new BadRequestException('Address is not provided, could not create delivery');

            const address = await this.addressService.getById(cart.addressId);
            const accessToken = await this.getAccessToken();
            const url = process.env.IIKO_BASE_URL + 'deliveries/create';
            const items = this.parseItems(cart);

            const paymentTypes = await this.getPaymentTypeId(accessToken);
            const paymentTypeId = paymentTypes[0].id;
            const paymentType = createDeliveryDto.paymentType;
            const payments = {
                paymentTypeKind: createDeliveryDto.paymentType,
                sum: cart.totalPrice,
                paymentTypeId,
                isProcessedExternally: paymentType === 'Card',
                isFiscalizedExternally: paymentType === 'Card'
            }

            const payload = JSON.stringify({
                organizationId: process.env.ORGANIZATION_ID,
                terminalGroupId: process.env.TERMINAL_GROUP_ID,
                createOrderSettings: null,
                order: {
                    id: null,
                    externalNumber: null,
                    completeBefore: null,
                    phone: user.phone_number,
                    orderTypeId: null,
                    orderServiceType: "DeliveryByCourier",
                    deliveryPoint: {
                        coordinates: null,
                        address: {
                            street: {
                                classifierId: null,
                                id: null,
                                name: address.avenue,
                                city: address.city
                            },
                            index: null,
                            house: String(address.building),
                            flat: String(address.flat),
                            entrance: address.block,
                            floor: String(address.floor),
                            doorphone: null,
                            regionId: null // TODO: select region with respect to its id
                        },
                        externalCartographyId: null,
                        comment: address.description || "no comment provided",
                    },
                    comment: "test sifarişi, baxmayın",
                    customer: {
                        name: user.firstname + ' ' + user.lastname,
                        type: "one-time"
                    },
                    quests: null,
                    marketingSourceId: null,
                    operatorId: null,
                    items: items,
                    combos: null,
                    payments: [payments],
                    tips: null,
                    sourceKey: null,
                    discountInfo: null,
                    iikoCard5Info: null,
                }
            });

            const response = await this.httpService.axiosRef.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            console.log(response);

            await this.orderService.create({ cart }, user);
            await this.cartsService.delete(cartToken);
            await this.paymentService.deletePaymentToken(createDeliveryDto.paymentToken);

            await queryRunner.commitTransaction();

            return { message: "Delivery was successfully created." };
        } catch (error) {
            await queryRunner.rollbackTransaction();

            console.error(error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async getAccessToken() {
        const payload = JSON.stringify({ apiLogin: process.env.ORGANIZATION_LOGIN });
        const url = process.env.IIKO_BASE_URL + 'access_token';

        try {
            const response = await this.httpService.axiosRef.post(url, payload, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data.token;
        } catch (error) {
            throw new ForbiddenException("Could not authorize to the IIKO api.");
        }
    }

    private async getPaymentTypeId(accessToken: string) {
        const url = process.env.IIKO_BASE_URL + 'payment_types';
        const payload = JSON.stringify({ organizationIds: [process.env.ORGANIZATION_ID] });
        const response = await this.httpService.axiosRef.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });
        return response.data.paymentTypes;
    }

    parseItems(cart: Cart) {
        return cart.items.map(item => {
            const additions = item.meal.additions;
            const modifiers = additions.length === 0 ? null :
                additions.map((addition) => {
                    const { name, ...rest } = addition;
                    return {
                        ...rest,
                        productGroupId: null,
                        positionId: null
                    };
                })

            return {
                productId: item.itemId,
                modifiers: modifiers,
                price: item.price / item.amount,
                positionId: null,
                type: "Product",
                amount: item.amount,
                productSizeId: null,
                comboInformation: null,
                comment: item.itemDescription || "no description provided"
            }
        });
    }
}