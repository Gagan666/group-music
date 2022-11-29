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
import {Collapse} from "@mui/material"
import Alert from '@mui/material/Alert';
export default class Settings extends Component{
    // defaultVotes = 1;

    constructor(props){
    super(props);
    this.state={
        guestCanPause: this.props.location.state.guestCanPause,
        votesToSkip: this.props.location.state.votesToSkip,
        error: "",
        success: "",
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
//  async componentDidMount()
//  {
// Allowed only for host
//  }
    handleGuestCanPauseChange(e){
        this.setState(
            {
                guestCanPause: e.target.value === "true" ? true:false,
            }
        )
    };
   
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



           console.log("updating");
           fetch("http://127.0.0.1:8000/api/update/",reqPar).then((res)=>{
            res.json();
            if(res.ok){
              this.setState({
                success:"Room updated successfully",
                error:"",
              })
            }else
           { 
            this.setState({
                success:"",
                error:"Error Updating the room",
              })
        }
        }).then((data)=>{
              console.log(data);
           
            //   this.props.history.push('/room/'+data['code']);
           //    history.push("/room/"+data["code"]);
          });
       
 
    }


    render(){
        return(
            
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">

                <Collapse in={this.state.success!=""} >
                <Alert severity="success" onClose={()=>{this.setState({success:""})}}>{this.state.success}</Alert>
                </Collapse>
                <Collapse in={this.state.error!=""}>
                <Alert severity="error" onClose={()=>{this.setState({error:""})}}>{this.state.error}</Alert>
                </Collapse>

            </Grid>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    Update Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.state.guestCanPause} onChange={this.handleGuestCanPauseChange}>
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
                <Button color="primary" variant="contained" onClick={this.submitButton}>Update Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
    
                <Button color="secondary" variant="contained" to={'/room/'+localStorage.getItem('member')} component={Link}>Back</Button>
    
            </Grid>
        </Grid>
         
        );
       
    }
        
    
};

