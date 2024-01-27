import { ActionProps, useCurrentAdmin } from "adminjs";
import { useState } from "react";
import * as React from "react";
import axios from "axios";
import { Button } from "@adminjs/design-system";

const DeleteNews = (props: ActionProps) => {

    const { record } = props;

    const [currentAdmin] = useCurrentAdmin();

    const url = "/news/"+record.params.id;

    const [message, setMessage] = useState(null);
    const [color, setColor] = useState(null);

    const handleDelete = (event: any) => {

        axios.delete(url, {
            headers: {
                Authorization: "Bearer " + currentAdmin.token,
            },
        }).then((res) => {
            setMessage("News deleted successfully");
            setColor('green');
            event.target.disabled = true;
        }).catch((err) => {
            setMessage(err.response.data.message)
            setColor('red')
        });
    }

    return (
    <div>
        {message && <div style={{color}}>{message}</div>}
        <br/>
        <Button type="button" onClick={handleDelete}>Delete</Button>
    </div>
    )
};

export default DeleteNews;