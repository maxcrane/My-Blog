import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import axios from "axios";
import firebase from "firebase";
import auth from "../utils/auth";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export class Admin extends React.Component{
	constructor(props) {
		super(props);
		this.setupAuth();
		this.state = {
			email: null,
			password: null,
			loggedIn: undefined
		};
	}

	setupAuth() {
		auth.onAuthStateChanged(function(user) {
			
		  if (user) {
		    // User is signed in.
		    this.setState({
		    	loggedIn : true
		    });
		    var displayName = user.displayName;
		    var email = user.email;
		    var emailVerified = user.emailVerified;
		    var photoURL = user.photoURL;
		    var isAnonymous = user.isAnonymous;
		    var uid = user.uid;
		    var providerData = user.providerData;
		    // ...
		  } else {
		    // User is signed out.
		    // ...
		    this.setState({
		    	loggedIn : false
		    });
		  }
		}.bind(this));
	}

	componentDidMount() {
		
	}

	onLogin() {
		var email = this.state.email;
		var pass = this.state.password;

		firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		  console.log(errorCode, errorMessage);
		});
	}

	onLogout() {
		auth.signOut(function() {
		  this.setState({
		    	loggedIn : false
		    });
		}.bind(this), function(error) {
		  // An error happened.
		}.bind(this));
	}

	onEmailChanged(event){
		this.setState({
			email : event.target.value
		});
	}

	onPassChanged(event){
		this.setState({
			password : event.target.value
		});
	}

	onGoToCreate(){

	}

	render() {
		let loginbutton = null;
		let logoutButton = null;
		let form  = null;
		let goToCreate = null;
		let goToPhotos = null;
		let loggedIn = this.state.loggedIn;

		const style = {
			width: "90%",
			paddingLeft: "10%"
		}

		const loginFields = {
			alignSelf: "center"
		};

		const loginButton = {
			width: "256px",
			alignSelf: "center",
			marginTop: "20px"
		};

		console.log(loggedIn);

	    if (loggedIn) {
	    	goToCreate 	= 	<Link  	to="/create"><RaisedButton 
	    	 						label="create an article" 
	    	 						primary={true}
	    	 						fullWidth={true} 
	    	 						style={loginButton}/>
	    	 				</Link>;

	    	goToPhotos 	= 	<Link 	to="/photos"><RaisedButton 
	    							label="manage photos" 
	    							primary={true}
	    							fullWidth={true}/>
	    				 	</Link>;

	    	logoutButton = <RaisedButton label="logout" secondary={true} fullWidth={true} onClick={this.onLogout.bind(this)} type="submit"/>;
	    } else if (loggedIn !== undefined){
	      	loginbutton = <RaisedButton label="login" onClick={this.onLogin.bind(this)} style={loginButton} type="submit"/>;
	    	form = 	<div className="logincontainer">
	    					<TextField 
						      floatingLabelText="email"
						      floatingLabelFixed={true}
						      onChange={(event)=> this.onEmailChanged(event)}
						      value={this.state.title}
						      style={loginFields}
						    />
						    <TextField 
						      floatingLabelText="password"
						      floatingLabelFixed={true}
						      onChange={(event)=> this.onPassChanged(event)}
						      value={this.state.title}
						      style={loginFields}
						      type="password"
						    />
							{loginbutton}
					</div>;
	    }

		return (
			<div style={style}>	
				{form}
				{goToCreate}
				<br />
				<br />
				{goToPhotos}
				<br />
				<br />
				{logoutButton}
			</div>
		);
	}
}