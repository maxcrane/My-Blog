import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../../utils/auth";
import articleUtils from "../../utils/articleUtils";
import photoUtils from "../../utils/photoUtils";
import SimpleMDE from "simplemde";
import {PhotoPicker} from "../photos/PhotoPicker.jsx";
import TextField from 'material-ui/TextField';
import ArticleThumbnailEditor from './ArticleThumbnailEditor.jsx';
import RaisedButton from 'material-ui/RaisedButton';


export class ArticleEditor extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			editor : null,
			title: "",
			percentUploaded: 0,
			thumbnailUrl: null,
			thumbnailName: null,
			photoMode: null
		}
		this.id = "markdownEditor";
	}

	componentDidMount(){
		this.createEditor();
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			title : nextProps.title || "",
			thumbnailUrl: nextProps.thumbnailUrl || null,
			thumbnailName: nextProps.thumbnailName || null
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

	onPhotoPicked(photo) {
		this.setState({
			thumbnailUrl: photo.url,
			thumbnailName: photo.name,
		});
	}

	render() {
		let titleField = null;
		let textarea = null;
		let editor = null;
		let imageLabel = "Please select an image:";
		
		let submitButton = <RaisedButton	label={this.props.buttonTitle}
											
											primary={true}
											onClick={this.onButtonClicked.bind(this)} 
											type="submit"/>;

		textarea = React.createElement('textarea', 
			{id: this.id, className : "markdownEditor"});

		editor = React.createElement('div', 
			{id: `${this.id}-wrapper`, className: "markdownEditor"}, textarea);
		
		const {thumbnailUrl, imageMode, thumbnailName} = this.state;

		if (thumbnailUrl !== null && thumbnailUrl !== undefined) {
			imageLabel = "Article Image:";
		} 

		let titleStyle = {
			width: '100%'
		}
		
		return (
			<div className="articleEditor shadow">
				<TextField className="articleTitleField"
			      floatingLabelText="Article Title"
			      onChange={this.onTitleChanged.bind(this)}
			      value={this.state.title}
			      style={titleStyle}
			    />
				{editor}
				<ArticleThumbnailEditor url={thumbnailUrl} 
										name={thumbnailName}
										onPhotoPicked={this.onPhotoPicked.bind(this)}/>
				{submitButton}
			</div>
		);
	}
}