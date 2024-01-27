import { useState } from 'react'
import * as React from "react";
import axios from 'axios';
import { Button, DropZone } from '@adminjs/design-system'
import { ActionProps, useCurrentAdmin } from 'adminjs'

const EditCampaign = (props: ActionProps) => {
    const { record } = props

    const [currentAdmin] = useCurrentAdmin();

    const url = "/campaigns/"+record.params.id;

    const [file, setFile] = useState(null)
    const [message, setMessage] = useState(null)
    const [color, setColor] = useState(null)

    const handleFile = (e: any) => {
        const file = e[0]
        setFile(file)
    }

    const handleUpload = () => {

        const formData = new FormData()
        formData.append('campaignsFile', file)

        axios.patch(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            console.log(res)
            setMessage("Image updated successfully");
            setColor('green')
        })
        .catch(err => {
            setMessage(err.response.data.message)
            setColor('red')
        })
    }
    
    return (
        <form>
            <label>Select file</label>
            <DropZone onChange={(e) => handleFile(e)}></DropZone>
            <br />
            {message && <div style={{color}}>{message}</div>}
            <div style={{textAlign: "center"}}>
                <Button type="button" onClick={handleUpload}>Upload</Button>
            </div>
        </form>
    )
}

export default EditCampaign