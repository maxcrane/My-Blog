import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../../utils/auth";
import {ArticleEditor} from "./ArticleEditor.jsx";
import articleUtils from "../../utils/articleUtils";
import SimpleMDE from "simplemde";

export class CreateArticle extends React.Component{
	constructor(props) {
		super(props);
		this.setupAuth();
		this.state = {
			adminLoggedIn : true,
			title : null,
			content : null
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
		    	adminLoggedIn : false
		    });
		  }
		}.bind(this));
	}

	onSubmitArticle(title, content, thumbnailUrl, thumbnailName) {
		const creationDate = new Date().toJSON();
		
		if (title != null && title !== "" &&
			content != null && content != ""){
			articleUtils.addArticle({
				title, 
				content, 
				thumbnailName, 
				thumbnailUrl,
				creationDate
			})

			const articleLink = `article/${articleUtils.getKeyForTitle(title)}`;
			this.props.history.push(articleLink);
		}
		else {
			console.log("article title missing...");
		}
	}


	render() {
		let editor = null;
		let adminLoggedIn = this.state.adminLoggedIn;
		
		if (adminLoggedIn != null && adminLoggedIn) {
			editor = <ArticleEditor content="" title="" buttonTitle="create"
				callback={ this.onSubmitArticle.bind(this) }/>;
		}
		
		return (
			<div>
				{editor}
			</div>
		);
	}
}