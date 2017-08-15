import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import articleUtils from "../../utils/articleUtils";
import {sortByDate} from "../../utils/dateSorter";
import axios from "axios";
import ArticleCard from "./ArticleCard.jsx";
import Loader from "../Loader.jsx";

class ArticleList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="articleList">
      			{this.props.articles.map((article, index) => 
      				<ArticleCard key={index} 
      							 article={article} 
      							 index={index}
      							 history={this.props.history}
      							 deleteArticle={this.props.deleteArticle.bind(this)}
      							 isAdmin={this.props.isAdmin}/>
      			)}
    		</div>
		);
	}
}

export default Loader('articles')(ArticleList);