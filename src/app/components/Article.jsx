import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import axios from "axios";

export class Article extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			title: "",
			thumbnailName: "",
			thumbnailUrl: "",
		};
	}

	componentDidMount() {
		this.getArticle();
	}


	getArticle() {
		var articleKey = this.props.match.params.title;
			
		axios.get(`/api/${articleKey}`)
		.then((res)=>{
			const article = res.data;

			this.setState({
				text: article.content,
				title: article.title,
				thumbnailName: article.thumbnailName,
				thumbnailUrl: article.thumbnailUrl
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	render() {
		var showdown  = require('showdown');
		var showdownHighlight = require("showdown-highlight")
		let converter = new showdown.Converter({
		    extensions: [showdownHighlight]
		});

	    var text      = this.state.text,
	    markdown      = converter.makeHtml(text);

		return (
			<div className="article">
				<h3 className="articleTitle">{this.state.title}</h3>
				<img src={this.state.thumbnailUrl} 
					 alt={this.state.thumbnailName}
					 className="articlePhoto"></img>
				<div id="content" ref="content" dangerouslySetInnerHTML={{ __html:  markdown}} />
			</div>
		);

	}
}