import { Role } from "src/auth/entities/role.entity"

export const RoleOptions = () => {

    return {
        resource: Role,
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