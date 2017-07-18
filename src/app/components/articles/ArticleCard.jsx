import React from "react";
import articleUtils from "../../utils/articleUtils";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

export class ArticleCard extends React.Component{
	constructor(props) {
		super(props);
	}

	editArticle () {
		const editArticleLink = `edit/${this.props.article.key}`
		this.props.history.push(editArticleLink);
	}

	deleteArticle (key) {
		if (!confirm(`are you sure you want to delete ${key}?`)) {
			return;    
		} 

		articleUtils.deleteArticle(key, (err)=>{
			if(err) {
				alert("could not delete", err);
			}
			else {
				this.props.articleDeleted(key);
			}
		});
	}

	render() {
		const {index, article, adminLoggedIn} = this.props;
		const editButton = adminLoggedIn ? <span className="glyphicon glyphicon-pencil articlelinkedit" 
	    									     onClick={this.editArticle.bind(this)}>
	    									</span> : null;
	    const deleteButton = adminLoggedIn ? <span className="glyphicon glyphicon-trash articlelinkdelete" 
	    									     onClick={()=>{this.deleteArticle(article.key)}}>
	    									</span> : null;

		return (
			<div className="articleCard">
				<Link className="articleLink" 
				      key={`${index}link`} 
				      to={{ pathname : `/article/${article.key}`,
							state : {key : article.key}}}>
					<h2 key={index} className="articleTitle articleTitleLink">
						{article.title}
					</h2>	
				</Link>

				<p key={`${index}date`} className="articleDate">
				   {articleUtils.getPrettyCreationDate(article.creationDate)}
				</p>

				<div className="adminButtonContainer"> 
					{editButton}
					{deleteButton}
				</div>
				
				<img key={`${index}img`} 
					 src={article.thumbnailUrl}
				     className="articlePhoto">
				</img>

				<hr className="articleCardDivider"></hr>
			</div>
		);
	}
}	