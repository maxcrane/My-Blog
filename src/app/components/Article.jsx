import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export class Article extends React.Component{
	componentDidMount() {
		//console.log("article id: ",this.props.match.params);
	}

	render() {
		return (
			<div className="row">
				<h3>ID: {this.props.match.params.articleId}</h3>
			</div>
		);
	}
}