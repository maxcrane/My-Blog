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
				{name: "save and publish", callback: this.onSubmitArticle.bind(this)},
				{name: "save as draft",    callback: this.onSubmitArticle.bind(this)}
			]
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isAdmin : nextProps.isAdmin
		});
	}

	onSubmitArticle(title, content, thumbnailUrl, thumbnailName) {
		const creationDate = new Date().toJSON();

		articleUtils.saveArticle({
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