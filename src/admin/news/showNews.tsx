import { Box, Label } from "@adminjs/design-system";
import { ActionProps, useCurrentAdmin } from "adminjs";
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from "react";

const showNews = (props: ActionProps) => {

    const { record } = props;

    const [currentAdmin] = useCurrentAdmin();
    const [news, setNews] = useState(null);

    const url = "/news/panel/admin/"+record.params.id;

    useEffect(() => {
        axios.get(url, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setNews(res.data)
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })

    }, [])

    return (<Box bg="white" padding='2vh'>

        <Box>
            <Label style={{ color: '#898A9A' }}>ID</Label>
            {news && news.id}
        </Box>

        <Box>
            <Label style={{ color: '#898A9A' }}>Date</Label>
            {news && news.date}
        </Box>

        <Box>
            <img style={{height: "500px"}} src={news && currentAdmin.baseUrl + "/" + news.imageUrl} alt="news image" />
        </Box>

        <Box>
            <Label style={{ color: '#898A9A' }}>Translations</Label>
            { news && news.translations.length === 0 && <p>No translations</p>}
            { news && news.translations.map((data) => {
                return Translation(data)
            })}
        </Box>

    </Box>)
}

const Translation = (translation: any) => {
    
        return(
            <Box padding='2vh' >
                <Box margin='1vh'>
                    <p style={{fontWeight: 'bold'}}>Language</p>
                    <p>{translation.lang}</p>
                </Box>
                <Box margin='1vh'>
                    <p style={{fontWeight: 'bold'}}>Title</p>
                    <p>{translation.title}</p>
                </Box>
                <Box margin='1vh'>
                    <p style={{fontWeight: 'bold'}}>Description</p>
                    <p>{translation.description}</p>
                </Box>
            </Box>
        )
}


export default showNews;