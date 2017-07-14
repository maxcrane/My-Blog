import React from "react";
import moment from "moment";
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
		const articleCreationDate = new Date(article.creationDate)
		const formattedDate = moment(articleCreationDate).format("MMMM Do, YYYY");

		return (
			<div className="articleCard">
				<Link className="articleLink" 
				      key={`${index}link`} 
				      to={{ pathname : `/article/${article.key}`,
							state : {key : article.key}}}>
					<li key={index} className="articleTitle">
						{article.title}
					</li>	
				</Link>

				<li key={`${index}date`} className="articleDate">
				   {formattedDate}
				</li>

				<img key={`${index}img`} 
					 src={article.thumbnailUrl}
				     className="articlePhoto">
				</img>

				<hr className="articleCardDivider"></hr>
			</div>
		);
	}
}	