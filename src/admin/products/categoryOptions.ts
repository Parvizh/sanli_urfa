import { Category } from "src/menu/entities/category.entity"

export const CategoryOptions = () => {

    return {
        resource: Category,
        options:{
            actions:{

                new:{
                    isAccessible: false,
                    isVisible: false
                },
                delete:{
                    isAccessible: false,
                    isVisible: false
                },
                bulkDelete:{
                    isAccessible: false,
                    isVisible: false
                },
                edit: {
                    isAccessible: false,
                    isVisible: false
                }
            },
            
        }
    }
}