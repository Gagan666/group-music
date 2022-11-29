import React, {Component, useState} from "react";
import { Button, ButtonGroup } from '@mui/material';
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

export default class GetSpotifyCodeAuth extends Component{

    constructor(props){
        super(props);

        this.code  = window.location.search.substring(1).slice(5,);

    }
    
    async componentDidMount()
    {
        const reqPar = {
            method: "POST",
            headers: { 
                'Accept': 'application/json',
            'Content-Type': 'application/json',
            
            },
            body:JSON.stringify({
                host:localStorage.getItem("host"),
                codes:this.code,
            }),
           };
        fetch('http://localhost:8000/spotify/redirect',reqPar).then((res)=>res.json()).then((data)=>{
            this.props.history.push(data["url"])
            
        })
    }

    render()
    {
        return(
           <div>
            {this.code}
           </div>
    );
}
}