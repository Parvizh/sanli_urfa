import { ComponentLoader } from 'adminjs';
import { User } from 'src/user/entities/user.entity';

export const UserOptions = (componentLoader: ComponentLoader) => {
  return {
    resource: User,
    options: {
      properties: {
        password: {
          isVisible: false,
          isAccessible: false,
        },
        orders: {
          components: {
            show: componentLoader.add('ShowUserOrders', 'viewOrders'),
          },
          isVisible:{
            list: false,
            show: true
          }
        },
        addresses: {
            components: {
              show: componentLoader.add('ShowUserAddresses', 'viewAddresses'),
            },
            isVisible:{
                list: false,
                show: true
            }
          },

      },
      actions: {
        new: {
          isAccessible: false,
          isVisible: false,
        },
        delete: {
          isAccessible: false,
          isVisible: false,
        },
        bulkDelete: {
          isAccessible: false,
          isVisible: false,
        },
        edit: {
          isAccessible: false,
          isVisible: false,
        },
      },
    },
  };
};
