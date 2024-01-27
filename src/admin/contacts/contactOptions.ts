import { ComponentLoader } from "adminjs";
import { ContactInfo } from "src/contact-info/entities/contact-info.entity";

export const ContactOptions = (componentLoader: ComponentLoader) => {

    return {
        resource: ContactInfo,
        options: {
            properties: {
                id:{
                    position: 3
                },
                contacts: {
                    isVisible: false,
                    isAccesible: false
                },
                address: {
                    components: {
                        list: componentLoader.add('ListContact', 'listContacts'),
                    }
                },
                email: {
                    components: {
                        list: componentLoader.add('ListContact', 'listContacts'),
                    }
                },
                mobile: {
                    components: {
                        list: componentLoader.add('ListContact', 'listContacts'),
                    }
                },
                working_hours: {
                    components: {
                        list: componentLoader.add('ListContact', 'listContacts'),
                    }
                }
            },
            actions: {
                new: {
                    component: componentLoader.add('NewContact', 'addContact'),
                },
                show:{
                    component: componentLoader.add('ShowContact', 'showContact'),
                },
                edit:{
                    component: componentLoader.add('EditContact', 'editContact'),
                }
            }
        },
        

    }

}