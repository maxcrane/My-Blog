import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import articleUtils from "../../utils/articleUtils";
import ArticleList from "./ArticleList.jsx";

//TODO: Link drafts to special draft preview instead of published article page
export default class Drafts extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			drafts: []
		}
	}


	componentDidMount() {		
		this.getDrafts();
	}

	getDrafts() {
		articleUtils.getDrafts().then((drafts)=> {
			this.setState({
				drafts: Object.keys(drafts).map((key)=> {
					let draft = drafts[key];
					draft.key = key;
					return draft;
				})
			})
		}).catch((err) => {
			console.log(err)
		});
	}

	deleteDraft (key) {
		if (!confirm(`are you sure you want to delete ${key}?`)) {
			return;    
		} 

		articleUtils.deleteDraft(key)
			.then((res) => {
				alert("draft deleted");
			}).catch((err) => {
				alert("error deleting draft ", err);
			});
	}

	render() {
		const {drafts} = this.state;
		return (
			<div>
				{
					drafts.length ? <ArticleList isAdmin={this.props.isAdmin} 
								deleteArticle={this.deleteDraft.bind(this)}
								articles={this.state.drafts}/> :
								<p className="noDraftFoundText">no drafts found</p>
				}
			</div>
		);
	}
}