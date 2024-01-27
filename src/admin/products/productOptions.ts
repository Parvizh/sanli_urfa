import { ComponentLoader } from "adminjs";
import { Product } from "src/menu/entities/product.entity";

export const ProductOptions = (componentLoader: ComponentLoader) => {

    return {
        resource: Product,
        options: {
            properties: {
                image: {
                    components: {
                        list: componentLoader.add('ListProductImage', 'listProducts'),
                        show: componentLoader.add('ShowProductImage', 'listProducts')
                    }
                },
                imageUrl: {
                    isVisible: {
                        list: false,
                        filter: false,
                        show: true,
                        edit: false, 
                    },
                }
            },
            actions: {
                edit:{
                    component: componentLoader.add('EditProduct', 'editProduct'),
                },
                new: {
                    isAccesible: false,
                    isVisible: false
                },
                delete: {
                    isAccesible: false,
                    isVisible: false
                },
                bulkDelete: {
                    isAccesible: false,
                    isVisible: false
                }

            }
        }
    }
}