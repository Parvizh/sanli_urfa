import { Box, Label } from "@adminjs/design-system";
import { ActionProps, useCurrentAdmin } from "adminjs";
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from "react";

const showVacancy = (props: ActionProps) => {

    const { record } = props;

    const [currentAdmin] = useCurrentAdmin();
    const [vacancy, setVacancy] = useState(null);

    const url = "/vacancies/admin/"+record.params.id;

    useEffect(() => {
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setVacancy(res.data)
        })
        .catch(err => {
            console.log(err)
        })

    }, [])

    return (<Box bg="white">

        {vacancy && VacancyColumn(vacancy.vacancy, 'Vacancy')}
        {vacancy && VacancyColumn(vacancy.location, 'Location')}
        {vacancy && VacancyColumn(vacancy.lang, 'Language')}
        {vacancy && VacancyColumn(vacancy.expiresAt, 'Expiry date')}
        
        <Box style={{ margin: "20px" }}>
            <Label style={{ color: '#898A9A' }}>Requirements</Label>
            { vacancy && vacancy.requirements.map((data) => {
                return <p key={data.id}>{data.requirement}</p>
            })}
        </Box>
     
        <Box style={{ margin: "20px" }}>
            <Label style={{ color: '#898A9A' }}>Information</Label>
            { vacancy && vacancy.information.map((data) => {
                return <p key={data.id}>{data.information}</p>
            })}
        </Box>

    </Box>)
}

const VacancyColumn = (column: string, name: string) => {

    return(
        <><Box style={{ margin: "20px" }}>
            <Label style={{ color: '#898A9A' }}>{name}</Label>
            <p>{column}</p>
        </Box></>
    )
}

export default showVacancy;