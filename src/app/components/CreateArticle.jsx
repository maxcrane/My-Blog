import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import addArticle from "../utils/addArticle";
import SimpleMDE from "simplemde";


export class CreateArticle extends React.Component{
	constructor(props) {
		super(props);
		this.setupAuth();
		this.state = {
			adminLoggedIn : true,
			title : null,
			editor : null
		}
		this.id = "markdownEditor";
	}

	componentDidMount(){
		this.createEditor();
	}

	createEditor(){
		this.editor = new SimpleMDE({ 
			element: document.getElementById(this.id)
		});
	}

	setupAuth() {
		auth.onAuthStateChanged(function(user) {			
		  if (user) {
		    this.setState({
		    	adminLoggedIn : true
		    });
		  } else {
		    this.setState({
		    	adminLoggedIn : false
		    });
		  }
		}.bind(this));
	}

	submitArticle() {
		const articleTitle = this.state.title;
		const articleContent = this.editor.value();

		if (articleTitle != null && articleTitle !== "" &&
			articleContent != null && articleContent != ""){
			addArticle.addArticle({
				title : articleTitle,
				content : articleContent
			})
			console.log("create article named " + articleTitle);
		}
		else {
			console.log("article title missing...");
		}
		
	}

	onTitleChanged(event) {
		this.setState({
			title : event.target.value.trim()
		});
	}


	render() {
		let titleField = null;
		let submitButton = null;
		let adminLoggedIn = this.state.adminLoggedIn;
		
		if (adminLoggedIn != null && adminLoggedIn) {
			titleField = <input className="articleTitleField" type="text" placeholder="article title" 
									onChange={(event)=> this.onTitleChanged(event)} ></input>
			submitButton = <button className="btn btn-primary" onClick={this.submitArticle.bind(this)}>Submit</button>
		}

		let textarea = React.createElement('textarea', {id: this.id, className : "markdownEditor"});
    	let editor =  React.createElement('div', {id: `${this.id}-wrapper`, className: "markdownEditor"}, textarea);
		
		return (
			<div>
				{titleField}
				{submitButton}
				{editor}
			</div>
		);
	}
}