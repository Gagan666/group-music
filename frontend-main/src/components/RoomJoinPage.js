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

export default class RoomJoinPage extends Component{

    constructor(props){
    super(props);
    this.state={
        roomCode:"",
        error:false,
       }
       this.handleTextField=this.handleTextField.bind(this);
       this.onRoomPressed = this.onRoomPressed.bind(this);
   
    }
    handleTextField(e){
        this.setState(
            {
                roomCode:e.target.value,
            }
        )
    }
    async componentDidMount()
    {
          if(localStorage['member'])
          {
            console.log("im in");
            this.props.history.push(`/room/${localStorage['member']}`)
          }
    }
    onRoomPressed(){
        const param = {
            method:"POST",
            headers: { 
                'Accept': 'application/json',
            'Content-Type': 'application/json',
            
            },
            body:JSON.stringify({
                code:this.state.roomCode,
            })
        };
        fetch("http://127.0.0.1:8000/api/join-room",param).then((res)=>{
            if(res.ok)
            {
                localStorage.setItem("member",this.state.roomCode)
                this.props.history.push(`/room/${this.state.roomCode}`);

            }
            else{
                this.setState({ error:"Room not found."});
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    render(){
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                    error={this.state.error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={this.state.roomCode}
                    helperText={this.state.error}
                    variant="outlined"
                    onChange={this.handleTextField}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this.onRoomPressed}>Enter Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>

                </Grid>
            </Grid>
        )
    }
};

