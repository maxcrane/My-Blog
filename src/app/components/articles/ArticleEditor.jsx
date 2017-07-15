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
import {AddPhoto} from "../AddPhoto.jsx";
import {Photos} from "../Photos.jsx";

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
			thumbnailName,
			imageMode: "none"
		})
	}

	onPhotoClicked(thumbnailName, thumbnailUrl){
		this.setState({
			thumbnailUrl,
			thumbnailName,
			imageMode: "none"
		})
	}


	render() {
		let titleField = null;
		let textarea = null;
		let editor = null;
		let imageLabel = "Please select an image:";
		let chooseExistingImageButton = null;
		let chooseExistingImage = null;
		let uploadNewImageButton = null;
		let uploadNewImage = null;

		let submitButton = <button className="btn btn-success editorSubmitButton" 
			onClick={this.onButtonClicked.bind(this)}>
			{this.props.buttonTitle}</button>

		titleField = <input className="articleTitleField" 
			type="text" value={this.state.title} placeholder={"Title"}
			onChange={this.onTitleChanged.bind(this)} ></input>

		textarea = React.createElement('textarea', 
			{id: this.id, className : "markdownEditor"});

		editor = React.createElement('div', 
			{id: `${this.id}-wrapper`, className: "markdownEditor"}, textarea);
		
		const {thumbnailUrl, imageMode} = this.state;

		if (thumbnailUrl !== null && thumbnailUrl !== undefined) {
			imageLabel = "Article Image:";
		} 

		chooseExistingImageButton = <button className="btn btn-info center-block editorAddPhotoButton" 
											type="submit"
											onClick={()=>{this.setState({imageMode:'existing'})}}>
										Choose Existing Image
									</button>
		uploadNewImageButton = 		<button className="btn btn-info center-block editorAddPhotoButton" 
											type="submit"
											onClick={()=>{this.setState({imageMode:'new'})}}>
										Upload New Image
									</button>
	

		if (imageMode === 'existing') {
			chooseExistingImage = <Photos isSelectionMode={true} 
						onPhotoClicked={this.onPhotoClicked.bind(this)}/>
		}
		else if (imageMode === 'new') {
			uploadNewImage = <AddPhoto includeLinkToAllPhotos={false}
						  onFileUploaded={this.onPhotoUploaded.bind(this)}/>
		}

		return (
			<div className="articleEditor">
				{titleField}
				{editor}
				<div className="imagePreviewContainer">
					<h3>{imageLabel}</h3>
					<img className="articleEditorImagePreview" 
						 src={thumbnailUrl}></img>
				</div>

				{chooseExistingImageButton}
				{uploadNewImageButton}
				{chooseExistingImage}
				{uploadNewImage}
				{submitButton}
			</div>
		);
	}
}