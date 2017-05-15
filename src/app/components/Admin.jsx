import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import axios from "axios";
import firebase from "firebase";

export class Admin extends React.Component{
	constructor(props) {
		super(props);
		
		var config = {
		    apiKey: "AIzaSyB3033HOIzxeeoSLsHsiWBCoRpG_Sbo-4A",
		    authDomain: "blog-987eb.firebaseapp.com",
		    databaseURL: "https://blog-987eb.firebaseio.com",
		    projectId: "blog-987eb",
		    storageBucket: "blog-987eb.appspot.com",
		    messagingSenderId: "198509011282"
		};
		firebase.initializeApp(config);
		this.setupLogin();
		this.state = {
			email: null,
			password: null,
			loggedIn: undefined
		};
	}

	setupLogin() {
		firebase.auth().onAuthStateChanged(function(user) {
			
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
		firebase.auth().signOut().then(function() {
		  this.setState({
		    	loggedIn : false
		    });
		}).catch(function(error) {
		  // An error happened.
		});
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

	render() {
		let button = null;
		let form  = null;
		let loggedIn = this.state.loggedIn;

	    if (loggedIn && loggedIn != undefined) {
	    	button = <button className="btn btn-primary center-block loginbutton" onClick={this.onLogout.bind(this)} type="submit">Logout</button>;
	    } else if (loggedIn != undefined){
	      	button = <button className="btn btn-primary center-block loginbutton" onClick={this.onLogin.bind(this)} type="submit">Login</button>;
	    	form = 	<div className="logincontainer">
							<input  type="text" placeholder="email" className="loginfield form-control"
									onChange={(event)=> this.onEmailChanged(event)} ></input>
							<input type="password" placeholder="Enter Password" className="loginfield form-control"
									onChange={(event)=> this.onPassChanged(event)}></input>
					</div>;
	    }

		return (
			<div>	
				{form}
				{button}
			</div>
		);
	}
}


