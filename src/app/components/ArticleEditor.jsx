import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import articleUtils from "../utils/articleUtils";
import SimpleMDE from "simplemde";

export class ArticleEditor extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			editor : null,
			title: ""
		}
		this.id = "markdownEditor";
		
	}

	componentDidMount(){
		this.createEditor();
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			title : nextProps.title
		});

		if (this.state.editor) {
			this.state.editor.value(nextProps.content);
		}
	}

	createEditor(){
		this.setState({
			editor : new SimpleMDE({ 
				element: document.getElementById(this.id)
			})
		});
	}

	onTitleChanged(event) {
		this.setState({
			title : event.target.value
		});
	}

	onButtonClicked(){
		let text = this.state.editor.value();
		this.props.callback(this.state.title.trim(), text);
	}


	render() {
		let titleField = null;
		let textarea = null;
		let editor = null;
		let submitButton = <button className="btn btn-primary" onClick={this.onButtonClicked.bind(this)}>{this.props.buttonTitle}</button>

		titleField = <input className="articleTitleField" type="text" value={this.state.title} placeholder={"article title"}

								onChange={this.onTitleChanged.bind(this)} ></input>
		textarea = React.createElement('textarea', {id: this.id, className : "markdownEditor"});
		editor =  React.createElement('div', {id: `${this.id}-wrapper`, className: "markdownEditor"}, textarea);
		
		return (
			<div>
				{titleField}
				{editor}
				{submitButton}
			</div>
		);
	}
}