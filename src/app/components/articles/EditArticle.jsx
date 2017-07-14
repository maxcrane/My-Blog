import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../../utils/auth";
import articleUtils from "../../utils/articleUtils";
import {ArticleEditor} from "./ArticleEditor.jsx";
import axios from "axios"
import SimpleMDE from "simplemde";

export class EditArticle extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			key: "",
			title: "",
			content: "",
			thumbnailName: "",
			thumbnailUrl: "",
			creationDate: ""
		};
	}

	componentDidMount() {
		const articleKey = this.props.match.params.title;
		this.setState({
			key : articleKey
		});


		axios.get(`/api/${articleKey}`)
		.then((res)=>{
			const article = res.data;
			this.setState(article);
		}).catch(function (error) {
			console.log(error);
		});
	}

	onSaveClicked(title, content, thumbnailUrl, thumbnailName) {		
		articleUtils.updateArticle({title, content, thumbnailUrl, thumbnailName, 
								    creationDate : this.state.creationDate}, 
					this.state.key);
	}

	render() {
		return (
			<div>
				<ArticleEditor content={this.state.content} 
							   title={this.state.title}
							   thumbnailUrl={this.state.thumbnailUrl} 
							   thumbnailName={this.state.thumbnailName} 
							   buttonTitle={"save"} 
							   callback={this.onSaveClicked.bind(this)}/>
			</div>
		);
	}
}