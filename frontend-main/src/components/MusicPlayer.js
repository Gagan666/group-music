import React, {Component, useState} from "react";
import { Button,Card,IconButton, LinearProgress } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import  {TextField}  from '@mui/material';
import { FormHelperText } from '@mui/material';
import  {FormControl} from "@mui/material";
import {Link}  from "react-router-dom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';

export default class MusicPlayer extends Component{

    constructor(props){
        super(props);
        this.pauseSong = this.pauseSong.bind(this);
        this.playSong = this.playSong.bind(this);

    }
pauseSong()
{
    const reqPar = {
        method: "POST",
        headers: { 
            'Accept': 'application/json',
        'Content-Type': 'application/json',
        
        },
        body:JSON.stringify({
            code:localStorage.getItem("member"),
            host:localStorage.getItem("host"),
        }),
       };
    fetch("http://127.0.0.1:8000/spotify/pause",reqPar);
    
}
playSong()
{
    const reqPar = {
        method: "POST",
        headers: { 
            'Accept': 'application/json',
        'Content-Type': 'application/json',
        
        },
        body:JSON.stringify({
            code:localStorage.getItem("member"),
            host:localStorage.getItem("host"),
        }),
       };
    fetch("http://127.0.0.1:8000/spotify/play",reqPar);
    
}

    render(){
        const songProgress = (this.props.time/this.props.duration)*100;
        return(
        <Card>
            <Grid container alignItems="center">
                <Grid item  align="center" xs={4}>
                <img src={this.props.image_url} height="100%" width="100%"/>
                </Grid>
            <Grid item align="center" xs={8}>
                <Typography component="h5" variant="h5">
                    {this.props.title}
                </Typography>
                <Typography color="textSecondary" variant = "subtitle1">
                    {this.props.artist}
                </Typography>
                <div>
                    <IconButton onClick={
                        ()=>{
                        this.props.is_playing? this.pauseSong():this.playSong()
                        }}>
                        {this.props.is_playing?<PauseIcon/>:<PlayArrowIcon/>}
                    </IconButton>
                    <IconButton>
                        <SkipNextIcon/>
                    </IconButton>
                </div>
            </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress}/>
        </Card>
        );
    } 
}