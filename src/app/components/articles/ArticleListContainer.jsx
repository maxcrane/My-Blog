import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import auth from "../../utils/auth";
import articleUtils from "../../utils/articleUtils";
import {sortByDate} from "../../utils/dateSorter";
import axios from "axios";
import ArticleList from "./ArticleList.jsx";


export class ArticleListContainer extends React.Component{
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
				articles : res.data.filter(article => article.title).sort(sortByDate('creationDate'))
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	deleteArticle (key) {
		if (!confirm(`are you sure you want to delete ${key}?`)) {
			return;    
		} 

		articleUtils.deleteArticle(key, (err)=>{
			if(err) {
				alert("could not delete", err);
			}
			else {
				this.articleDeleted(key);
			}
		});
	}

	articleDeleted(deletedArticleKey) {
		this.setState({
			articles : this.state.articles.filter(article => 
									article.key !== deletedArticleKey)
		});
	}

	render() {
		return (
			<ArticleList articles={this.state.articles} 
						 adminLoggedIn={this.state.adminLoggedIn}
						 deleteArticle={this.deleteArticle.bind(this)}
						 history={this.props.history}/>
		);
	}
}