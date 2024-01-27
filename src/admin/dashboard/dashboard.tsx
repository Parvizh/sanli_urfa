import * as React from "react";
import { Box, Button, Text } from "@adminjs/design-system";
import { useNavigationResources } from "adminjs";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    return (
        <div style={{padding: '1vh', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', gap: 5}}>
            <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
                <img src={'/admin-assets/default-logo.png'} />
            </div>
            <div style={{display: 'flex', alignItems:'center', justifyContent:'center', gap: 5, flexWrap:'wrap'}}>
                <Button onClick={() => navigate('resources/Product')}>Products</Button>
                <Button onClick={() => navigate('resources/Category')}>Categories</Button>
                <Button onClick={() => navigate('resources/ContactInfo')}>Contacts</Button>
                <Button onClick={() => navigate('resources/Campaign')}>Campaigns</Button>
                <Button onClick={() => navigate('resources/Vacancy')}>Vacancies</Button>
                <Button onClick={() => navigate('resources/News')}>News</Button>
                <Button onClick={() => navigate('resources/SliderImage')}>Slider</Button>
                <Button onClick={() => navigate('resources/SocialNetworkLink')}>Socials</Button>
                <Button onClick={() => navigate('resources/User')}>Users</Button>
            </div>
        </div>
    )
}

export default Dashboard;