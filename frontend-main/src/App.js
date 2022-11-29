import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,

} from "react-router-dom";
// import CreateRoomPage from './components/CreateRoomPage';
import CreateRoomPage_F from './components/CreateRoomPage_F';
import RoomJoinPage from './components/RoomJoinPage';
import Room from './components/Room';
import HomePage from './components/HomePage';
import CreateRoomPage from './components/CreateRoomPage';
import Settings from './components/Settings';
import GetSpotifyCodeAuth from './components/GetSpotifyCodeAuth';
function App() {
  return (
<div className='center'>
    <Switch>
       <Route exact path="/" component={HomePage}></Route>
       <Route exact path='/roomcode' component={GetSpotifyCodeAuth}/> 

      <Route exact path='/room/:roomCode' component={Room}/>
       <Route exact path='/join' component={RoomJoinPage}/> 
       
       <Route exact path='/create' component={CreateRoomPage}/> 
       <Route exact path='/settings' component={Settings}/> 
       
    </Switch>
    </div>

  );
}

export default App;
