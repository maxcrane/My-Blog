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
		return `${title.replace(new RegExp(" ", 'g'), "-")}`;
	}	

	editArticle (key) {
		const editArticleLink = `edit/${key}`
		this.props.history.push(editArticleLink);
	}

	deleteArticle (key) {
		if (!confirm(`are you sure you want to delete ${key}?`)) {
			return;    
		} 

		articleUtils.deleteArticle(key, (err)=>{
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
	    			onClick={()=>{this.editArticle(article.key)}}></span>);
	    		deleteButtons.push(<span className="glyphicon glyphicon-trash articlelinkdelete"
	    			onClick={()=>{this.deleteArticle(article.key)}}></span>);
	    	});
	    } 

		return (
			<ul className="articleList">
      			{this.state.articles.map((article, index) => 
      				<div key={index} className="articlelink">
      					<div className="photoContainer">
	      					
		      				<Link key={`${index}link`} to={{
		      					pathname : `/article/${article.key}`,
		      					state : {key : article.key}
		      				}}><img key={`${index}img`} 
	      						 src={article.thumbnailUrl}
	      						 className="articlePhoto"></img>
		      					<li key={index}
		      					   className="articleTitle">{article.title}</li>
		      				</Link>
							{editButtons[index]}
		      				{deleteButtons[index]}
	      				</div>
      				</div>
      			)}
    		</ul>
		);
	}
}