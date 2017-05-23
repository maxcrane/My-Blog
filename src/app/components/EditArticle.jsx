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
			key: "",
			title: "",
			content: ""
		};
	}

	componentDidMount() {
		const articleKey = this.props.match.params.title;
		this.setState({
			key : articleKey
		});


		axios.get(`/api/${articleKey}`)
		.then((res)=>{
			this.setState({
				content : res.data.content,
				title : res.data.title
			});
		}).catch(function (error) {
			console.log(error);
		});
	}

	onSaveClicked(title, content) {		
		articleUtils.updateArticle({title, content}, this.state.key);
	}

	render() {
		return (
			<div>
				<ArticleEditor content={this.state.content} title={this.state.title}
							   buttonTitle={"save"} callback={this.onSaveClicked.bind(this)}/>
			</div>
		);
	}
}