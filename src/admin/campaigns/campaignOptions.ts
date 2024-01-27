import { ComponentLoader } from "adminjs";
import { Campaign } from "src/campaigns/entities/campaign.entity"

export const CampaignOptions = (componentLoader: ComponentLoader) => {
    
    return {
        resource: Campaign,
        options: {
            properties: {
                image: {
                    components: {
                        list: componentLoader.add('ListCampaign', 'listCampaigns'),
                        show: componentLoader.add('ShowCampaign', 'showCampaign'),
                    }
                }
        },
        actions: {
            new:{
            component: componentLoader.add('NewCampaign', 'addCampaign'),
            },
            edit: {
            component: componentLoader.add('EditCampaign', 'editCampaign'),
            },
            delete: {
            component: componentLoader.add('DeleteCampaign', 'deleteCampaign'),
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
        },
    }
}
