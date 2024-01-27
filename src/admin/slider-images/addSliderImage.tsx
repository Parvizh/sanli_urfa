import { useState } from 'react'
import * as React from "react";
import axios from 'axios';
import { DropZone, Button } from '@adminjs/design-system'
import { useCurrentAdmin } from 'adminjs'

const AddSliderImage = () => {
    
    
    const [currentAdmin] = useCurrentAdmin()
    
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState(null)
    const [color, setColor] = useState(null)
    
    const url = "/slider-images";

    const handleFile = (e: any) => {
        const file = e[0]
        setFile(file)
    }

    const handleUpload = (event: any) => {

        const formData = new FormData()
        formData.append('sliderImage', file)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setMessage("Image uploaded successfully");
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

export default AddSliderImage