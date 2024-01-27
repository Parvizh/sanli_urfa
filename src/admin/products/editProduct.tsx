import { Box, Button, CheckBox, DropZone, Label } from "@adminjs/design-system";
import { ActionProps, useCurrentAdmin } from "adminjs";
import axios from "axios";
import { useState } from "react";
import * as React from "react";

const editProduct = (props: ActionProps) => {

    const { record } = props

    const [currentAdmin] = useCurrentAdmin();

    const imageUploadUrl = "/menu/image/upload/"+record.params.id;
    const isActiveUrl = "/menu/active-status/"+record.params.id;

    const [file, setFile] = useState(null)
    const [message, setMessage] = useState(null)
    const [color, setColor] = useState(null)
    const [checked, setChecked] = useState(record.params.isActive)

    const handleFile = (e: any) => {
        const file = e[0]
        setFile(file)
    }

    const handleChecked = () => {
        setChecked(!checked)
    }

    const handleUpload = () => {

        const formData = new FormData()
        formData.append('image', file)

        axios.patch(imageUploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setMessage("Image updated successfully");
            setColor('green')
        })
        .catch(err => {
            setMessage(err.response.data.message)
            setColor('red')
        })
    }

    const handleIsActiveRequest = () => {

        const data = {
            isActive: checked
        }

        axios.patch(isActiveUrl, data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setMessage("isActive updated successfully");
            setColor('green')
        })
        .catch(err => {
            setMessage(err.response.data.message)
            setColor('red')
        })  
    }

    const handleSave = () => {
        if (file) {
            handleUpload();
        }

        if (checked !== record.params.isActive) {
            handleIsActiveRequest();
        }     
    }

    return (
        <form>
            
            <Box p="xl">
            <label>
                <input type="checkbox" onChange={handleChecked} checked={checked}/>
                isActive
            </label>
            </Box>
            <label>Select file</label>
            <DropZone onChange={(e) => handleFile(e)}></DropZone>
            <br />
            {message && <div style={{color}}>{message}</div>}
            <div style={{textAlign: "center"}}>
                <Button type="button" onClick={handleSave}>Save</Button>
            </div>
        </form>
    )
}

export default editProduct;