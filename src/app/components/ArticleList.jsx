import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import auth from "../utils/auth";
import articleUtils from "../utils/articleUtils";
import axios from "axios";

export class ArticleList extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			adminLoggedIn: false
		};
		this.setupAuth();
	}

	setupAuth() {
		auth.onAuthStateChanged(function(user) {			
		  	if (user) {
			    this.setState({
			    	adminLoggedIn : true
			    });
		  	}
		}.bind(this));
	}

	componentDidMount() {		
		this.getArticles();
	}

	getArticles() {
		axios.get('/api/articles')
		.then((res)=>{
			this.setState({
				articles : res.data.filter((article)=>{
					return article.title;
				})
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	getPrettyArticleNameForUrl (title) {
		return `article/${title.replace(new RegExp(" ", 'g'), "-")}`;
	}	

	editArticle (title) {
		console.log(title);
	}

	deleteArticle (title) {
		if (!confirm(`are you sure you want to delete ${title}?`)) {
			return;    
		} 

		articleUtils.deleteArticle(title, (err)=>{
			if(err) {
				alert("could not delete");
			}
			else {
				this.getArticles();
				alert("successfully deleted");
			}
		});
	}

	render() {
		let deleteButtons = [];
		let editButtons = [];

	    if (this.state.adminLoggedIn) {
	    	this.state.articles.map((article) => {
	    		editButtons.push(<span className="glyphicon glyphicon-pencil articlelinkedit" 
	    			onClick={()=>{this.editArticle(article.title)}}></span>);
	    		deleteButtons.push(<span className="glyphicon glyphicon-trash articlelinkdelete"
	    			onClick={()=>{this.deleteArticle(article.title)}}></span>);
	    	});
	    } 

		return (
			<ul className="articleList">
      			{this.state.articles.map((article, index) => 
      				<div key={index} className="articlelink">
	      				<Link key={`${index}link`} to={{
	      					pathname : `/${this.getPrettyArticleNameForUrl(article.title || "")}`,
	      					state : {key : article.key}
	      				}}><li key={index}>{article.title}</li></Link>
							{editButtons[index]}
	      					{deleteButtons[index]}
      				</div>
      			)}
    		</ul>
		);
	}
}