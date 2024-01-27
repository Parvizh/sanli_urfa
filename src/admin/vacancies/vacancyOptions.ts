import { ComponentLoader } from "adminjs";
import { Vacancy } from "src/vacancies/entities/vacancy.entity";

export const VacancyOptions = (componentLoader: ComponentLoader) => {

    return {
        resource: Vacancy,
        options: {
            actions: {
                new: {
                    component: componentLoader.add('NewVacancy', 'addVacancy')
                },
                show: {
                    component: componentLoader.add('ShowVacancy', 'showVacancy')
                },
                edit: {
                    component: componentLoader.add('EditVacancy', 'editVacancy')
                }

            }


        }

    }
}