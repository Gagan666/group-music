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

export default class HomePage extends Component{

    constructor(props){
        super(props);

    }
    
    async componentDidMount()
    {
          if(localStorage['member'])
          {
            console.log("im in");
            this.props.history.push(`/room/${localStorage['member']}`)
          }
    }

    render()
    {
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        Group Music
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                   <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/join" component={Link}>Join Room</Button>
                    <Button color="secondary" to="/create" component={Link}>Create Room</Button>
                   
                   </ButtonGroup>
                </Grid>
            </Grid>
    );
}
}