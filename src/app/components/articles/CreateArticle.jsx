import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom'
import {ArticleEditor} from "./ArticleEditor.jsx";
import articleUtils from "../../utils/articleUtils";
import SimpleMDE from "simplemde";

class CreateArticle extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isAdmin : props.isAdmin,
			title : null,
			content : null,
			thumbnailName: null,
			thumbnailUrl: null,
			buttons: [
				{name: "save as draft",    callback: this.onSaveDraft.bind(this)},
				{name: "save and publish", callback: this.onPublishArticle.bind(this)}
			]
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isAdmin : nextProps.isAdmin
		});
	}

	onSaveDraft(title, content, thumbnailUrl, thumbnailName) {
		const creationDate = new Date().toJSON();

		articleUtils.saveArticleDraft({
			title, 
			content, 
			thumbnailName, 
			thumbnailUrl,
			creationDate
		}).then((res) =>{
			alert("draft saved!");
		}).catch((err) => {
			alert(err);
		});
	}

	onPublishArticle(title, content, thumbnailUrl, thumbnailName) {
		const creationDate = new Date().toJSON();

		articleUtils.publishArticle({
			title, 
			content, 
			thumbnailName, 
			thumbnailUrl,
			creationDate
		}).then((res) =>{
			const articleLink = `article/${articleUtils.getKeyForTitle(title)}`;
			this.props.history.push(articleLink);
		}).catch((err) => {
			alert(err);
		});
	}

	render() {
		let editor = null;
		let {isAdmin, buttons} = this.state;
		
		if (isAdmin) {
			editor = <ArticleEditor content="" title="" buttons={buttons}/>;
		}
		
		return (
			<div>
				{editor}
			</div>
		);
	}
}

export default withRouter(CreateArticle);