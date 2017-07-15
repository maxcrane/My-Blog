import React from "react";
import articleUtils from "../../utils/articleUtils";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

//TODO: Re-add delete/edit buttons to this component
export class ArticleCard extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		const {index, article} = this.props;
	
		return (
			<div className="articleCard">
				<Link className="articleLink" 
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

				<img key={`${index}img`} 
					 src={article.thumbnailUrl}
				     className="articlePhoto">
				</img>

				<hr className="articleCardDivider"></hr>
			</div>
		);
	}
}	