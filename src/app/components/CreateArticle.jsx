import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import addArticle from "../utils/addArticle";

export class CreateArticle extends React.Component{
	constructor(props) {
		super(props);
		this.setupAuth();
		this.state = {
			adminLoggedIn : true,
			title : null
		}
	}

	setupAuth() {
		auth.onAuthStateChanged(function(user) {			
		  if (user) {
		    this.setState({
		    	adminLoggedIn : true
		    });
		  } else {
		    this.setState({
		    	adminLoggedIn : true
		    });
		  }
		}.bind(this));
	}

	submitArticle() {
		const articleTitle = this.state.title;

		if (articleTitle != null && articleTitle !== ""){
			addArticle.addArticle({
				title : articleTitle
			})
			console.log("create article named " + articleTitle);
		}
		else {
			console.log("article title missing...");
		}
		
	}

	onTitleChanged(event) {
		this.setState({
			title : event.target.value
		});
	}


	render() {
		let titleField = null;
		let submitButton = null;
		let adminLoggedIn = this.state.adminLoggedIn;

		if (adminLoggedIn != null && adminLoggedIn) {
			titleField = <input  type="text" placeholder="article title" 
									onChange={(event)=> this.onTitleChanged(event)} ></input>
			submitButton = <button className="btn btn-primary" onClick={this.submitArticle.bind(this)}>Submit</button>
		}

		return (


			<div>
				{titleField}
				{submitButton}
			</div>
		);
	}
}