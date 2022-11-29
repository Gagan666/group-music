import React, {Component, useEffect, useState} from "react";
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import  {TextField}  from '@mui/material';
import { FormHelperText } from '@mui/material';
import  {FormControl} from "@mui/material";
import {Link}  from "react-router-dom";
import  {Radio} from "@mui/material";
import  {RadioGroup}  from "@mui/material";
import {FormControlLabel} from "@mui/material";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function CreateRoomPage_F(props){
    const history=useHistory();
    const defaultVotes=2;
const [guestCanPause,setguestcanpause]=useState(true);
const [votesToSkip,setvotesToSkip]=useState(defaultVotes);

const handleGuestCanPauseChange=(e)=>{
    
            setguestcanpause(e.target.value === "true" ? true:false);        
    
}

const handleVotesChange=(e)=>{
   
            setvotesToSkip(e.target.value);
    
};

const submitButton=()=>{

    const reqPar = {
     method: "POST",
     headers: { 
         'Accept': 'application/json',
     'Content-Type': 'application/json',
     
     },
     body:JSON.stringify({
         votes_to_skip:votesToSkip,
         guest_can_pause:guestCanPause,
         host:localStorage.getItem("host"),
     }),
    };
    console.log(localStorage.getItem("host"))
    if(localStorage.getItem("host"))
   {
    console.log("updating");
    fetch("http://127.0.0.1:8000/api/update/",reqPar).then((res)=>res.json()).then((data)=>{
       console.log(data);
       props.history.push('/room/'+data['code']);
    //    history.push("/room/"+data["code"]);
   });

    }
    else
    {
        console.log("creating..."); 
        fetch("http://127.0.0.1:8000/api/create/",reqPar).then((res)=>res.json()).then((data)=>{
            console.log(data);
            localStorage.setItem("host",data["host"]);
            localStorage.setItem("member",data['code'])
            props.history.push('/room/'+data['code']);
            history.push("/room/"+data["code"]);
        });
    }

}

{
    if(!localStorage.getItem["member"])
    return(
    
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography component='h4' variant='h4'>
                Create a Room
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText>
                    <div align="center">
                        Guest Control of Playback State
                    </div>
                </FormHelperText>
                <RadioGroup row defaultValue="true" onChange={handleGuestCanPauseChange}>
                    <FormControlLabel value="true" control={<Radio color="primary"/>} label="Play/Pause"/>
                    <FormControlLabel value="false" control={<Radio color="secondary"/>} label="Group Control"/>
                
                </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <FormControl>
            <TextField required={true} type="number" onChange={handleVotesChange} defaultValue={defaultVotes} inputProps={{min:1,style:{textAlign:"center"}}}/>
            <FormHelperText>
                <div align="center">
                    Enter the number of votes needed to skip the song!!
                </div>
            </FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
            <Button color="primary" variant="contained" onClick={submitButton}>Create a Room</Button>
        </Grid>
        <Grid item xs={12} align="center">

            <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>

        </Grid>
    </Grid>
     
    );
    else{
        history.push(`/room/${localStorage['member']}`);
    }
}
}