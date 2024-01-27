import { ComponentLoader } from "adminjs"
import { News } from "src/news/entities/news.entity"

export const newsOptions = (componentLoader: ComponentLoader) => {
    return {
        resource: News,
        options: {
            properties: {
                image: {
                    components: {
                        list: componentLoader.add('ListNews', 'listNews'),
                    }
                }
            },
            actions: {
                new: {
                    component: componentLoader.add('NewNews', 'addNews')
                },
                show: {
                    component: componentLoader.add('ShowNews', 'showNews')
                },
                edit: {
                    component: componentLoader.add('EditNews', 'editNews')
                },
                delete: {
                    component: componentLoader.add('DeleteNews', 'deleteNews'),
                    handler: async (request, response, data) => {
                        
                        return { record: data.record.toJSON() }
                    },
                    guard: null
                },
                bulkDelete: {
                    isAccesible: false,
                    isVisible: false
                }
            }
        }
    }
}