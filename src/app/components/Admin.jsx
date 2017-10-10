import React from "react";
import firebase from "firebase";
import auth from "../utils/auth";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Loader from "./Loader.jsx";

class Admin extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			email: null,
			password: null,
			loggedIn: undefined,
			isAdmin: props.isAdmin
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isAdmin : nextProps.isAdmin
		})
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

	render() {
		let form  = null;
		let loggedIn = this.state.loggedIn;

		const style = {
			width: "90%",
			paddingLeft: "10%"
		}

		const loginFields = {
			alignSelf: "center"
		};

		const loginLogoutButton = {
			width: "256px",
			alignSelf: "center",
			marginTop: "20px"
		};

		let usernameField = this.props.isAdmin ? null : 
							<TextField 
						      floatingLabelText="email"
						      floatingLabelFixed={true}
						      onChange={(event)=> this.onEmailChanged(event)}
						      value={this.state.title}
						      style={loginFields}
						    />;

		let passwordField = this.props.isAdmin ? null : 
							<TextField 
								floatingLabelText="password"
								floatingLabelFixed={true}
								onChange={(event)=> this.onPassChanged(event)}
								value={this.state.title}
								style={loginFields}
								type="password"
							/>;

		let loginLogoutbutton = this.props.isAdmin ? 
									<RaisedButton label="logout" secondary={true} 
	    							     onClick={this.onLogout.bind(this)} 
	    							     type="submit"
	    							     style={loginLogoutButton}/>
	   										 : 							
	    							<RaisedButton label="login" 
	      				                onClick={this.onLogin.bind(this)} 
	      				                style={loginLogoutButton} 
	      				                type="submit"/>;
	    
		return (
			<div className="logincontainer">
				{usernameField}
			   	{passwordField}
				{loginLogoutbutton}
			</div>
		);	
	}
}

export default Loader('isAdmin')(Admin);	