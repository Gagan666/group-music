import React, {Component, useState} from "react";
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
import CreateRoomPage_F from "./CreateRoomPage_F";
import MusicPlayer from "./MusicPlayer";
export default class Room extends Component{

    constructor(props){
        super(props);
        this.state={
            votesToSkip:2,
            guestCanPause:false,
            isHost:false,
            RoomExist:false,
            spotifyAuthenticated:false,
            song:{}
        }
        this.roomCode = this.props.match.params.roomCode;
        this.leaveroom = this.leaveroom.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        // this.getRoomDetails();
        this.getCurrentSong=this.getCurrentSong.bind(this);
        
    }
    
    componentWillUnmount()
    {
        clearInterval(this.interval);
    }
    leaveroom(){
        const reqPar={
            method: "POST",
     headers: { 
         'Accept': 'application/json',
     'Content-Type': 'application/json',
     
     },
     body:JSON.stringify({
         code:this.roomCode,
     }),

    };

    if(localStorage.getItem('host')){
    fetch("http://127.0.0.1:8000/api/delete-room",reqPar).then((res)=>res.json()).then((data)=>console.log(data))
   
    }
         
    localStorage.removeItem("member");
    if(localStorage.getItem("host"))
    localStorage.removeItem("host");
    }

    authenticateSpotify(){
        const reqPar = {
            method: "POST",
            headers: { 
                'Accept': 'application/json',
            'Content-Type': 'application/json',
            
            },
            body:JSON.stringify({
                host:localStorage.getItem("host")
            }),
           };
        fetch('http://localhost:8000/spotify/is-authenticated',reqPar).then((res)=>res.json()).then((data)=>{
            // this.setState({spotifyAuthenticated:data.status})
            console.log("authenticated:"+data.status)
            if(!data.status){
                fetch("http://localhost:8000/spotify/get-auth-url").then((res)=>res.json()).then((data)=>{
                    window.location.replace(data.url);
                })
            }
        })
    }
    getCurrentSong(){
        const reqPar = {
            method: "POST",
            headers: { 
                'Accept': 'application/json',
            'Content-Type': 'application/json',
            
            },
            body:JSON.stringify({
                code:localStorage.getItem("member")
            }),
           };
        fetch("http://127.0.0.1:8000/spotify/current_song",reqPar).then((response)=>{
            if(!response.ok)
            return {};
            else
            return response.json();
        }).then((data)=>{
            this.setState({
                song:data
            });
            console.log(data);
        })
    }
    async componentDidMount()
    {
        const host = localStorage.getItem("host");
        let is_host=false;
        if(host!=null)
            is_host=true;
        fetch('http://localhost:8000/api/get-room?code='+this.roomCode).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            
            if(!data['msg'] && localStorage.getItem("member"))
           { 
            this.state.RoomExist=true;

            this.setState({
                votesToSkip:data.votes_to_skip,
                guestCanPause:data.guest_can_pause,
                isHost:is_host,
                //check if current user is host or not
            });
            if(this.state.isHost)
            {
                this.authenticateSpotify();

            }
            this.interval = setInterval(this.getCurrentSong, 1000);

        }
        else
        {
            this.state.RoomExist=false;
        }
        });

    }
  
    renderSettingsButton(){
        let data ={
            votesToSkip:this.state.votesToSkip,
            guestCanPause:this.state.guestCanPause,
        }
        return(
            <Grid item xs={12} align="center">
                <Link
                to={
                    {
                        pathname: "/settings",
                        state:data
                    }
                }>
            <Button variant="contained" color="primary" >
                Settings
                </Button>
                </Link>
            </Grid>  
        )
    }
    render()
    {
        if(this.state.RoomExist)
        {
            
            return(
            <Grid container spacing={1}>
               <Grid item xs={12} align="center">
               <Typography variant="h4" compact="h4">
                        Code : {this.roomCode}
                    </Typography>
               </Grid>
               <MusicPlayer {...this.state.song}/>

               {this.state.isHost?this.renderSettingsButton():console.log("Member")}
               <Grid item xs={12} align="center">
               <Button variant="contained" color="secondary" onClick={this.leaveroom} to="/" component={Link}>
                {this.state.isHost?this.value='Dismantle Room':'Leave Room'}
                
                </Button>
               </Grid>
            </Grid>
        )}
        else{
            return(
                <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Typography variant="h4" compact="h4">
                         Join Or Create A Room
                     </Typography>
                </Grid>
                
                <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                 Back To Home
                 
                 </Button>
                </Grid>
             </Grid>
            )
        }
    }
}