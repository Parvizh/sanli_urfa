import { Box, Button, Input, Label } from "@adminjs/design-system";
import { ActionProps, useCurrentAdmin } from "adminjs";
import axios from "axios";
import { useState } from "react";
import * as React from "react";

const editContact = (props: ActionProps) => {

    const { record } = props

    const [mobile, setMobile] = useState(record.params['contacts.mobile']);
    const [email, setEmail] = useState(record.params['contacts.email']);
    const [address, setAddress] = useState(record.params['contacts.address']);
    const [workingHours, setWorkingHours] = useState(record.params['contacts.working_hours']);
    const [message, setMessage] = useState(null);
    const [color, setColor] = useState(null);
    const [currentAdmin] = useCurrentAdmin();

    

    const url = "/contact-info/"+record.params.lang;

    const handleMobile = (e: any) => {
        setMobile(e.target.value);
    }

    const handleEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const handleAddress = (e: any) => {
        setAddress(e.target.value);
    }

    const handleWorkingHours = (e: any) => {
        setWorkingHours(e.target.value);
    }

    const handleSubmit = () => {
        const data = {
            mobile, 
            email, 
            address, 
            working_hours: workingHours
        }

        console.log(data)

        axios.patch(url, data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setMessage("Contact updated successfully");
            setColor('green')
        })
        .catch(err => {
            setMessage(err.response.data.message)
            setColor('red')
        })

    }

    return(
    <Box p="xl" bg="white">
        <Label htmlFor="mobile">Mobile</Label>
        <Input id="mobile" value={mobile} width={1/2} onChange={handleMobile} />
        <br/><br/>

        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} width={1/2} onChange={handleEmail} />
        <br/><br/>

        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} width={1/2} onChange={handleAddress} />
        <br/><br/>

        <Label htmlFor="workingHours">Working Hours</Label>
        <Input id="workingHours" value={workingHours} width={1/2} onChange={handleWorkingHours} />
        <br/><br/>

        {message && <div style={{color}}>{message}</div>}
        <br/><br/>

        <Button type="button" onClick={handleSubmit}>Save</Button>
    </Box>)
}

export default editContact;