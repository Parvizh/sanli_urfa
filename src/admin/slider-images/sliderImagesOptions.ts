import { ComponentLoader } from "adminjs";
import { SliderImage } from "src/slider-image/entities/slider-image.entity";

export const sliderImagesOptions = (componentLoader: ComponentLoader) => {
    
    return {
        resource: SliderImage,
        options: {
            properties: {
                image: {
                    components: {
                        list: componentLoader.add('ListSliderImage', 'listSliderImage'),
                        show: componentLoader.add('ShowSliderImage', 'showSliderImage'),
                    }
                }
        },
        actions: {
            new:{
            component: componentLoader.add('NewSliderImage', 'addSliderImage'),
            },
            edit: {
            component: componentLoader.add('EditSliderImage', 'editSliderImage'),
            },
            delete: {
            component: componentLoader.add('DeleteSliderImage', 'deleteSliderImage'),
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
