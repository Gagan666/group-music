import React, {Component} from "react";
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
import { useLocation } from "react-router-dom";

export default class CreateRoomPage extends Component{
    // defaultVotes = 1;
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
      };
    constructor(props){
    super(props);
    this.state={
        guestCanPause: this.props.guestCanPause,
        votesToSkip: this.props.votesToSkip,
        errorMsg: "",
        successMsg: "",
    };
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.submitButton = this.submitButton.bind(this);
    // this.location = useLocation();
};
    handleVotesChange(e){
        this.setState(
            {
                votesToSkip:e.target.value,
                
            }
        );
    };

    handleGuestCanPauseChange(e){
        this.setState(
            {
                guestCanPause: e.target.value === "true" ? true:false,
            }
        )
    };
    async componentDidMount(){
        
        // console.log(this.location.pathname)
        if(localStorage['member'])
          {
            this.props.history.push(`/room/${localStorage['member']}`)
          }
    }
    submitButton(){
    
        const reqPar = {
            method: "POST",
            headers: { 
                'Accept': 'application/json',
            'Content-Type': 'application/json',
            
            },
            body:JSON.stringify({
                votes_to_skip:this.state.votesToSkip,
                guest_can_pause:this.state.guestCanPause,
                host:localStorage.getItem("host"),
            }),
           };
           const xyz=JSON.stringify({
            guest_can_pause:this.state.guestCanPause,
            host:localStorage.getItem("host"),
            votes_to_skip:this.state.votesToSkip,
        })
           console.log(xyz)
           if(localStorage.getItem("host"))
          {
           console.log("updating");
           fetch("http://127.0.0.1:8000/api/update/",reqPar).then((res)=>res.json()).then((data)=>{
              console.log(data);
              this.props.history.push('/room/'+data['code']);
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
                   this.props.history.push('/room/'+data['code']);

               });
           }
    }


    render(){
        
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
                    <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel value="true" control={<Radio color="primary"/>} label="Play/Pause"/>
                        <FormControlLabel value="false" control={<Radio color="secondary"/>} label="Group Control"/>
                    
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                <TextField required={true} type="number" onChange={this.handleVotesChange} defaultValue={this.state.votesToSkip} inputProps={{min:1,style:{textAlign:"center"}}}/>
                <FormHelperText>
                    <div align="center">
                        Enter the number of votes needed to skip the song!!
                    </div>
                </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.submitButton}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
    
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
    
            </Grid>
        </Grid>
         
        );
       
    }
        
    
};

