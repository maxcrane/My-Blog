import React from "react";
import articleUtils from "../../utils/articleUtils";
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
			creationDate: ""
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
			this.setState(article);
		}).catch(function (error) {
			console.log(error);
		});
	}

	render() {
		const showdown  = require('showdown');
		const showdownHighlight = require("showdown-highlight")
		const converter = new showdown.Converter({
		    extensions: [showdownHighlight]
		});
	    const markdown = converter.makeHtml(this.state.content);

	    const {title, creationDate, thumbnailUrl, thumbnailName} = this.state;
	    const prettyDate = creationDate !== "" ? 
	    	articleUtils.getPrettyCreationDate(creationDate) : "";

	    var img = null;
	    if (thumbnailUrl !== "" && thumbnailName !== "") {
	    	img = <img src={thumbnailUrl} 
					   alt={thumbnailName}
					   className="articlePhoto">
				  </img>
	    }

		return (
			<div className="article" >
				<h2 className="articleTitle">{title}</h2>
				<p  className="articleDate">{prettyDate}</p>

				{img}
				
				<div id="content" ref="content" 
					 dangerouslySetInnerHTML={{ __html:  markdown}} />
			</div>
		);

	}
}