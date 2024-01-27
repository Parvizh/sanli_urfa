import { Box, Button, Icon, Text, Input, Label, DatePicker, DropDown, DropDownItem, DropDownMenu, DropDownTrigger } from "@adminjs/design-system";
import { useCurrentAdmin } from "adminjs";
import axios from "axios";
import { useState } from "react";
import * as React from "react";

interface Information {
    id: number;
    value: string;
}

const addVacancy = () => {

    const [vacancy, setVacancy] = useState('');
    const [location, setLocation] = useState('');
    const [lang, setLang] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [initialInfo, setInitialInfo] = useState('');
    const [message, setMessage] = useState(null);
    const [color, setColor] = useState(null);
    const [initialRequirement, setInitialRequirement] = useState('');
    const [information, setInformation] = useState<Information[]>([]);
    const [requirements, setRequirements] = useState<Information[]>([]);
    const [currentAdmin] = useCurrentAdmin();

    const url = "/vacancies";

    const addInformation = (e: any) => {
        e.preventDefault();
        const value = initialInfo;

        if (value === '') {
            setMessage('Information field cannot be empty');
            setColor('red');
            return;
        }

        setInformation([...information, {id: information.length + 1, value}])
        setInitialInfo('');
    }

    const addRequirement = (e: any) => {
        e.preventDefault();
        const value = initialRequirement;


        if (value === '') {
            setMessage('Information field cannot be empty');
            setColor('red');
            return;
        }

        setRequirements([...requirements, {id: requirements.length + 1, value}])
        setInitialRequirement('');
    }

    const handleInformation = (e: any, id: number) => {
        const value = e.target.value;


        const newState = information.map(obj => {
            if (obj.id === id) {
              return {...obj, value};
            }
      
            return obj;
          });
      
          setInformation(newState);
    }

    const handleRequirement = (e: any, id: number) => {
        const value = e.target.value;

        const newState = requirements.map(obj => {
            if (obj.id === id) {
                return {...obj, value};
            }

            return obj;
        });

        setRequirements(newState);
    }

    const deleteInformation = (id: number) => {
        setInformation(current =>
            current.filter(information => {
              // 👇️ remove object that has id equal to 2
              return information.id !== id;
            }),
          );
    }

    const deleteRequirement = (id: number) => {
        setRequirements(current =>
            current.filter(requirement => {
                // 👇️ remove object that has id equal to 2
                return requirement.id !== id;
            }),
        );
    }

    const handleSubmit = () => {
        
        const data = {
            vacancy,
            location,
            lang,
            expiresAt: expiryDate,
            information: information.map(item => item.value),
            requirements: requirements.map(item => item.value)
        }

        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer '+ currentAdmin.token
            }
        })
        .then(res => {
            setMessage("Vacancy created successfully");
            setColor('green')
        })
        .catch(err => {
            setMessage(err.response.data.message)
            setColor('red')
        }) 

    }


    return(
    <Box p="xl" bg="white">
        <Label htmlFor="vacancy">Vacancy</Label>
        <Input id="vacancy" width={1/2} onChange={(e: any) => setVacancy(e.target.value)} />
        <br/><br/>

        <Label htmlFor="location">Location</Label>
        <Input id="location" width={1/2} onChange={(e: any) => setLocation(e.target.value)} />
        <br/><br/>

        <Label>Information</Label>
        {information.map((item) => {
            return(
                <div key={item.id.toString()}>
                <Input value={item.value} width={1/4} onChange={(e: any) => handleInformation(e, item.id)}/>
                <Button size="sm" ml="lg" onClick={()=> deleteInformation(item.id)}>Delete</Button>
                <br/><br/>
                </div>
            )
        })}

        <form>
        <Input width={1/2} value={initialInfo} onChange={(e: any) => setInitialInfo(e.target.value)} />
        <Button size="sm" ml="lg" onClick={addInformation}>Add</Button>
        </form>
        <br/><br/>

        <Label>Requirements</Label>
        {requirements.map((item) => {
            return(
                <div key={item.id.toString()}>
                <Input value={item.value} width={1/4} onChange={(e: any) => handleRequirement(e, item.id)}/>
                <Button size="sm" ml="lg" onClick={()=> deleteRequirement(item.id)}>Delete</Button>
                <br/><br/>
                </div>
            )
        })}

        <form>
        <Input width={1/2} value={initialRequirement} onChange={(e: any) => setInitialRequirement(e.target.value)} />
        <Button size="sm" ml="lg" onClick={addRequirement}>Add</Button>
        </form>
        <br/><br/>

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

        <Box width={1/2}>
            <Label htmlFor="expDate">Expiry Date</Label>
            <DatePicker id="expDate" value={expiryDate} width={1/2} onChange={(e) => setExpiryDate(new Date(e).toISOString())} />
            <br/><br/>    
        </Box>
        
        {message && <div style={{color}}>{message}</div>}

        <Button type="button" onClick={handleSubmit}>Save</Button>
    </Box>)
}

export default addVacancy;