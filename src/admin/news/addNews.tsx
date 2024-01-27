import { useState } from "react"
import * as React from "react";
import { Box, Button, DatePicker, DropDown, DropDownItem, DropDownMenu, DropDownTrigger, DropZone, FormGroup, Input, Label, Select, Text, TextArea } from "@adminjs/design-system"
import axios from "axios";
import { useCurrentAdmin } from "adminjs";

const AddNews = () => {

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lang, setLang] = useState('');
    const [translations, setTranslations] = useState([]); // [{lang: 'en', title: 'title', description: 'description'}
    const [newsDate, setNewsDate] = useState(new Date());
    const [saveMessage, setSaveMessage] = useState(null);
    const [currentAdmin] = useCurrentAdmin();

    const url = "/news";

    const handleFile = (e: any) => {
        const file = e[0];
        setFile(file);
    }

    const handleDate = (e: any) => {
        const date = new Date(e);
        setNewsDate(date)
    }

    const addTranslation = () => {
        if (lang === '' || title === '' || description === '') {
            return;
        }

        const langExists = translations.find(obj => obj.lang === lang);
        if (langExists) {
            return;
        }

        setTranslations([...translations, {lang, title, description}]);
        setLang('');
        setTitle('');
        setDescription('');
    }

    const handleTranslationLang = (newLang: string, lang: string) => {
       
        const newState = translations.map(obj => {
            if (obj.lang === lang) {
                return {...obj, lang: newLang}
            }
            return obj;
        })

        setTranslations(newState);
    }

    const handleTranslationTitle = (e: any, lang: string) => {
        const value = e.target.value;
        const newState = translations.map(obj => {
            if (obj.lang === lang) {
                return {...obj, title: value}
            }
            return obj;
        })

        setTranslations(newState);
    }

    const handleTranslationDescription = (e: any, lang: string) => {
        const value = e.target.value;
        const newState = translations.map(obj => {
            if (obj.lang === lang) {
                return {...obj, description: value}
            }
            return obj;
        })

        setTranslations(newState);
    }

    const handleDelete = (lang: string) => {
        const newState = translations.filter(obj => obj.lang !== lang);
        setTranslations(newState);
    }

    const handleSubmit = () => {

        const formData = new FormData();

        formData.append('newsImage', file);
        
        const date = newsDate.toISOString().split('T')[0];
        formData.append('date', date);

        formData.append('translations', JSON.stringify(translations));

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${currentAdmin.token}`
            }}
        ).then(() => {
            setSaveMessage({message: 'News saved successfully', color: 'green'});
        }
        ).catch(err => {
            setSaveMessage({message: err.response.data.message, color: 'red'});
        })

    }

    return (
        <Box bg="white">

            <Box padding="2vw">
                <Label>Upload new image</Label>
                <DropZone onChange={(e) => handleFile(e)} />
            </Box>

            <Box padding="2vw">
                <Label htmlFor="newsDate">Select date</Label>
                <DatePicker id="newsDate" value={newsDate}  onChange={(e) => handleDate(e)} />
            </Box>
            
            {translations.map((item, index) => {
                return(
                    <Box padding="2vw" key={index} >

                        <Box style={{display: 'flex', alignItems: 'center', gap: 3}}>

                        <DropDown>
                            <DropDownTrigger>
                                <Button>Select Language</Button>
                            </DropDownTrigger>
                            <DropDownMenu>
                                <DropDownItem onClick={() => handleTranslationLang('az', item.lang)} >Azerbaijani</DropDownItem>
                                <DropDownItem onClick={() => handleTranslationLang('en', item.lang)}>English</DropDownItem>
                                <DropDownItem onClick={() => handleTranslationLang('ru', item.lang)}>Russian</DropDownItem>
                            </DropDownMenu>
                        </DropDown>

                        <Text>{item.lang}</Text>
                        </Box>
                        <Label>Title</Label>
                        <Input value={item.title} width={3/4} onChange={(e: any) => handleTranslationTitle(e, item.lang)}/> 
                        <Label>Description</Label>
                        <TextArea value={item.description} width={3/4} onChange={(e: any) => handleTranslationDescription(e, item.lang)}/> 
                        <Button size="sm" ml="lg" onClick={() => handleDelete(item.lang)}>Delete</Button>
                    </Box>
                )
            })}
            
            <Box padding="2vw" >
                <Label>Add translation</Label>
                <Box>
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

                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} width={3/4} onChange={(e: any) => setTitle(e.target.value)} />

                    <Label htmlFor="description">Description</Label>
                    <TextArea id="description" value={description} width={3/4} onChange={(e: any) => setDescription(e.target.value)} />

                    <Button size="sm" ml="lg" type="submit" onClick={addTranslation}>Add</Button>
                </Box>

            </Box>

            <Box padding="2vw">
                {saveMessage && <Text color={saveMessage.color}>{saveMessage.message}</Text>}
                <Button type="button" onClick={handleSubmit}>Save</Button>
            </Box>

        </Box>
    )
}

export default AddNews