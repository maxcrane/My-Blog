import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import axios from "axios";

export class ArticleList extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			articles: []
		};
	}

	componentDidMount() {		
		axios.get('/api/articles')
		.then((res)=>{
			this.setState({
				articles : res.data
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	getPrettyArticleNameForUrl (title) {
		return title.replace(new RegExp(" ", 'g'), "-");
	}	

	render() {
		return (
			<ul>
      			{this.state.articles.map((article, index) => 
      				<Link key={`${index}link`} to={{
      					pathname : `/${this.getPrettyArticleNameForUrl(article.title)}`,
      					state : {key : article.key}
      				}}><h3 key={index}>{article.title}</h3> </Link>)}
    		</ul>
		);
	}
}