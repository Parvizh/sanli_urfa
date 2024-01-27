import { Box, Button, Input, Label, Text } from "@adminjs/design-system";
import * as React from "react";

const Login = () => {
    return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor:'#f5f7fb'}}>

        <Box bg='white' height='50%' width='40%' padding='1vh' boxShadow='0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'>
        <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
            <img width={'40%'} src={'/admin-assets/default-logo.png'} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
        <Text>Admin panel</Text>
        <form action='login' method='POST'>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', gap: 15}}>
            <Box>
                <Label htmlFor='email'>Email:</Label>
                <Input width='20vw' id='email' type="text" name="email" />
            </Box>
            <Box>
                <Label htmlFor='password'>Password:</Label>
                <Input width='20vw' id='password' type="password" name="password" />
            </Box>
            <Button width='10vw' variant="primary" type="submit" >Log in</Button>
            </div>
        </form>
        </div>
        </Box>
    </div>
    );
};

export default Login; 