import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import articleUtils from "../utils/articleUtils";
import {ArticleEditor} from "./ArticleEditor.jsx";
import axios from "axios"
import SimpleMDE from "simplemde";

export class EditArticle extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			initialTitle: "",
			content: "",
			titleChanged: false
		};
	}

	componentDidMount() {
		var articleKey = this.props.match.params.title;
		articleKey = encodeURIComponent(articleKey.replace(new RegExp("-", 'g'), " "));
		
		axios.get(`/api/${articleKey}`)
		.then((res)=>{
			this.setState({
				content : res.data.content,
				initialTitle : unescape(res.data.title)
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	onSaveClicked(title, content) {
		if (title !== this.state.initialTitle) {
			this.state.titleChanged = true;
		}
		
		console.log("titleChanged?" , this.state.titleChanged, this.state.initialTitle);

		articleUtils.updateArticle({title, content}, 
			this.state.titleChanged, this.state.initialTitle);
	}

	render() {
		return (
			<div>
				<ArticleEditor content={this.state.content} title={this.state.initialTitle}
							   buttonTitle={"save"} callback={this.onSaveClicked.bind(this)}/>
			</div>
		);
	}
}