import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import auth from "../../utils/auth";
import articleUtils from "../../utils/articleUtils";
import axios from "axios";
import {ArticleCard} from "./ArticleCard.jsx";


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
				}).sort((a, b)=>{
					return new Date(b.creationDate) - new Date(a.creationDate);
				})
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	//TODO: Make this work so article is removed from page after deleted by admin...
	articleDeleted(deletedArticleKey) {
		this.setState({
			articles : articles.filter((article)=>{
				article.key !== deletedArticleKey
			})
		});
	}

	render() {
		return (
			<div className="articleList">
      			{this.state.articles.map((article, index) => 
      				<ArticleCard key={index} 
      							 article={article} 
      							 index={index}
      							 history={this.props.history}
      							 articleDeleted={this.articleDeleted.bind(this)}
      							 adminLoggedIn={this.state.adminLoggedIn}/>
      			)}
    		</div>
		);
	}
}