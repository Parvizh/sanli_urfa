import { Box, Button, DropDown, Text,  DropDownItem, DropDownMenu, DropDownTrigger, Input, Label } from "@adminjs/design-system";
import { useCurrentAdmin } from "adminjs";
import axios from "axios";
import { useState } from "react";
import * as React from "react";

interface Contacts {
    mobile?: string;
    email?: string;
    address?: string;
    working_hours?: string;
}

const addContact = () => {

    const [lang, setLang] = useState(null);
    const [message, setMessage] = useState(null);
    const [color, setColor] = useState(null);
    const [currentAdmin] = useCurrentAdmin();
    const [contacts, setContacts] = useState<Contacts>(null);

    const url = "/contact-info";

    const handleMobile = (e: any) => {
        setContacts({...contacts, mobile: e.target.value})
    }

    const handleEmail = (e: any) => {
        setContacts({...contacts, email: e.target.value})
    }

    const handleAddress = (e: any) => {
        setContacts({...contacts, address: e.target.value})
    }

    const handleWorkingHours = (e: any) => {
        setContacts({...contacts, working_hours: e.target.value})
    }

    const handleSubmit = () => {
        console.log(contacts)
        const data = {
            lang,
            contacts
        }

        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setMessage("Contact added successfully");
            setColor('green')
        })
        .catch(err => {
            console.log(err)
            setMessage(err.response.data.message)
            setColor('red')
        })

    }


    return(
    <Box p="xl" bg="white">
        <Box style={{display: 'flex', alignItems: 'center', gap: 3}}>

            <DropDown>
                <DropDownTrigger>
                    <Button>Select Language</Button>
                </DropDownTrigger>
                <DropDownMenu>
                    <DropDownItem onClick={() => setLang('az')} >Azerbaijani</DropDownItem>
                    <DropDownItem onClick={() => setLang('en')}>English</DropDownItem>
                    <DropDownItem onClick={() => setLang('ru')}>Russian</DropDownItem>
                </DropDownMenu>
            </DropDown>

            <Text>{lang}</Text>
        </Box>
        <br/><br/>

        <Label htmlFor="mobile">Mobile</Label>
        <Input id="mobile" width={1/2} onChange={handleMobile} />
        <br/><br/>

        <Label htmlFor="email">Email</Label>
        <Input id="email" width={1/2} onChange={handleEmail} />
        <br/><br/>

        <Label htmlFor="address">Address</Label>
        <Input id="address" width={1/2} onChange={handleAddress} />
        <br/><br/>

        <Label htmlFor="workingHours">Working Hours</Label>
        <Input id="workingHours" width={1/2} onChange={handleWorkingHours} />
        <br/><br/>

        {message && <div style={{color}}>{message}</div>}
        <br/><br/>

        <Button type="button" onClick={handleSubmit}>Save</Button>
    </Box>)
}

export default addContact;