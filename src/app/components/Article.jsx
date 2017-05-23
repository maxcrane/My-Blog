import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import axios from "axios"
import hljs from "highlight.js"


export class Article extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			title: ""
		};
		hljs.initHighlightingOnLoad();
	}

	componentDidMount() {
		var articleKey = this.props.match.params.title;
			
		axios.get(`/api/${articleKey}`)
		.then((res)=>{
			this.setState({
				text : res.data.content,
				title : unescape(res.data.title)
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	render() {
		var showdown  = require('showdown'),
	    converter = new showdown.Converter(),
	    text      = this.state.text,
	    markdown      = converter.makeHtml(text);

		return (
			<div className="article">
				<h3>{this.state.title}</h3>
				<div id="content" dangerouslySetInnerHTML={{ __html:  markdown}} />
			</div>
		);
	}
}