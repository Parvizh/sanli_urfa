import { Box, H1, Label } from "@adminjs/design-system";
import { ActionProps } from "adminjs";
import * as React from "react";

const showContact = (props: ActionProps) => {

    const { record } = props;

    const id = record.params.id;
    const lang = record.params.lang;
    const address = record.params['contacts.address'];
    const email = record.params['contacts.email'];
    const mobile = record.params['contacts.mobile'];
    const working_hours = record.params['contacts.working_hours']

    return (
        <Box bg="white">
            
            {contact(id, 'ID')}
            {contact(lang, 'Language')}
            {contact(address, 'Address')}
            {contact(email, 'Email')}
            {contact(mobile, 'Mobile')}
            {contact(working_hours, 'Working Hours')}   
            
        </Box>
    )

}

const contact = (column: string, name: string) => {

    return(
        <><Box style={{ margin: "20px" }}>
            <Label style={{ color: '#898A9A' }}>{name}</Label>
            <p>{column}</p>
        </Box></>
    )
}

export default showContact;