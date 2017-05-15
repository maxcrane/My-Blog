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
		console.log("article id: ", this.props.match.params);
		
		axios.get('/api/articles')
		.then((res)=>{
			this.setState({
				articles : res.data
			});
		}).catch(function (error) {
			console.log(error);
		});
	}



	render() {
		return (
			<ul>
      			{this.state.articles.map((article, index) => <h3 key={index}>{article.title}</h3>)}
    		</ul>
		);
	}
}