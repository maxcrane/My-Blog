import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import articleUtils from "../utils/articleUtils";
import photoUtils from "../utils/photoUtils";
import SimpleMDE from "simplemde";
import {AddPhoto} from "./AddPhoto.jsx";
import {Photos} from "./Photos.jsx";

export class ArticleEditor extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			editor : null,
			title: "",
			percentUploaded: 0,
			thumbnailUrl: null,
			thumbnailName: null
		}
		this.id = "markdownEditor";
	}

	componentDidMount(){
		this.createEditor();
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			title : nextProps.title,
			thumbnailUrl: nextProps.thumbnailUrl,
			thumbnailName: nextProps.thumbnailName
		});

		if (this.state.editor) {
			this.state.editor.value(nextProps.content);
		}
	}

	createEditor(){
		this.setState({
			editor : new SimpleMDE({ 
				element: document.getElementById(this.id),
				renderingConfig: {
					//will will highlight code using highlight.js
					codeSyntaxHighlighting: true
				}
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
		this.props.callback(this.state.title.trim(), text, 
							this.state.thumbnailUrl, this.state.thumbnailName);
	}

	onThumbnailUploaded(event){
		const file = event.target.files[0];

		const onProgress = (snapshot) => {
			const percentUploaded = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
			this.setState({
				percentUploaded
			});
		};

		const onError = (err) => {

		};

		const onComplete = () => {
			this.setState({
				percentUploaded: 100
			});
		}
 
		photoUtils.addImage(file, onProgress, onError, onComplete);
	}

	onPhotoUploaded(thumbnailName, thumbnailUrl){
		this.setState({
			thumbnailUrl,
			thumbnailName
		})
	}

	onPhotoClicked(thumbnailName, thumbnailUrl){
		this.setState({
			thumbnailUrl,
			thumbnailName
		})
	}


	render() {
		let titleField = null;
		let textarea = null;
		let editor = null;
		let submitButton = <button className="btn btn-primary editorSubmitButton" 
			onClick={this.onButtonClicked.bind(this)}>
			{this.props.buttonTitle}</button>

		titleField = <input className="articleTitleField" 
			type="text" value={this.state.title} placeholder={"article title"}
			onChange={this.onTitleChanged.bind(this)} ></input>

		textarea = React.createElement('textarea', 
			{id: this.id, className : "markdownEditor"});

		editor = React.createElement('div', 
			{id: `${this.id}-wrapper`, className: "markdownEditor"}, textarea);
		
		return (
			<div>
				{titleField}
				{editor}
				{submitButton}
				<AddPhoto includeLinkToAllPhotos={false}
						  onFileUploaded={this.onPhotoUploaded.bind(this)}/>
				<img src={this.state.thumbnailUrl}></img>
				<Photos isSelectionMode={true} 
						onPhotoClicked={this.onPhotoClicked.bind(this)}/>
			</div>
		);
	}
}