import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom'
import auth from "../../utils/auth";
import articleUtils from "../../utils/articleUtils";
import {ArticleEditor} from "./ArticleEditor.jsx";
import axios from "axios"
import SimpleMDE from "simplemde";

class EditArticle extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			key: "",
			title: "",
			content: "",
			thumbnailName: "",
			thumbnailUrl: "",
			creationDate: "",
			buttons: [],
			draftMode: true
		};
	}

	componentDidMount() {
		const articleKey = this.props.match.params.title;
		this.setState({
			key : articleKey
		});
		this.fetchDraftAndArticle(articleKey);
	}

	setButtons() {
		const {draftMode} = this.state;
		const publishButtonTitle = draftMode ? "publish draft" : "publish changes now";
		const draftButtonTitle = draftMode ? "save changes to draft" : "save changes as draft";
		const buttons = [
			{name: publishButtonTitle, callback: this.onPublishClicked.bind(this)},
			{name: draftButtonTitle,    callback: this.onSaveDraftClicked.bind(this)}
		];

		if (draftMode) {
			buttons.push({
				name: "delete draft", 
				callback: this.onDeleteDraftClicked.bind(this)
			})
		}

		this.setState({buttons});
	}

	fetchDraftAndArticle(articleKey) {
		Promise.all([articleUtils.getArticle(articleKey), 
			        articleUtils.getDraft(articleKey)])
					.then(vals => {
			const [article, draft] = vals;
			const draftMode = Boolean(draft);
			this.setState({draftMode});
			this.setState(draftMode ? draft : article);
			this.setButtons();
		}).catch((err)=>{
			alert(err);
		});
	}

	onDeleteDraftClicked() {
		if (!confirm(`Are you sure you want to delete the draft?`)) {
			return;
		}

		const articleKey = this.state.key;
		articleUtils.deleteDraft(articleKey)
			.then((resolve) => {
				alert("draft deleted");
				this.props.history.push('/articles');
			}).catch((err) => {
				alert(err);
			});
	}

	onPublishClicked(title, content, thumbnailUrl, thumbnailName) {	
		const article = {title, content, thumbnailUrl, thumbnailName, 
								    creationDate : this.state.creationDate}
		const articleKey = this.state.key;

		articleUtils.publishArticle(article, articleKey).then((res) =>{
			const articleLink = `/article/${articleKey}`;
			this.props.history.push(articleLink);
		}).catch((err) => {
			alert(err);
		});
		
	}

	onSaveDraftClicked(title, content, thumbnailUrl, thumbnailName) {
		const article = {title, content, thumbnailUrl, thumbnailName, 
								    creationDate : this.state.creationDate}
		const articleKey = this.state.key;

		articleUtils.saveArticleDraft(article, articleKey).then((res) =>{
			alert("draft saved!");
		}).catch((err) => {
			alert(err);
		});
	}

	render() {
		return (
			<div>
				<ArticleEditor {...this.state}/>
			</div>
		);
	}
}

export default withRouter(EditArticle);