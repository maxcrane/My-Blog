import React from "react";
import articleUtils from "../../utils/articleUtils";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

class ArticleCard extends React.Component{
	constructor(props) {
		super(props);
	}

	editArticle () {
		const editArticleLink = `edit/${this.props.article.key}`
		this.props.history.push(editArticleLink);
	}

	render() {
		const {index, article, isAdmin} = this.props;
		const editButton = isAdmin ? <span className="glyphicon glyphicon-pencil articlelinkedit" 
	    									     onClick={this.editArticle.bind(this)}>
	    									</span> : null;
	    const deleteButton = isAdmin ? <span className="glyphicon glyphicon-trash articlelinkdelete" 
	    									     onClick={()=>{this.props.deleteArticle(article.key)}}>
	    									</span> : null;
	    var img = null;		
	    if (article.thumbnailUrl && article.thumbnailName) {
	    	img = <img key={`${index}img`} 
					 src={article.thumbnailUrl}
					 alt={article.thumbnailName}
				     className="articlePhoto">
				</img>
	    }

		return (
			<div className="articleCard">
				<Link className="articleLink navlink"
				      key={`${index}link`} 
				      to={{ pathname : `/article/${article.key}`,
							state : {key : article.key}}}>
					<h2 key={index} className="articleTitle">
						{article.title}
					</h2>	
				</Link>

				<p key={`${index}date`} className="articleDate">
				   {articleUtils.getPrettyCreationDate(article.creationDate)}
				</p>

				<p className="articlePreview">{article.preview || article.content.substring(0, 150)}...</p>
			
				<div className="adminButtonContainer"> 
					{editButton}
					{deleteButton}
				</div>
				
				{img}

				<hr className="articleCardDivider"></hr>
			</div>
		);
	}
}	

export default withRouter(ArticleCard);