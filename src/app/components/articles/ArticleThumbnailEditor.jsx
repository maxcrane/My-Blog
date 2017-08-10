import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import {Photos} from "../photos/Photos.jsx";
import ImageWithButton from "./ImageWithButton.jsx";
import photoUtils from "../../utils/photoUtils";
import {sortByDate} from "../../utils/dateSorter";

export default class ArticleThumbnailEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = ({
			url: props.url,
			name: props.name,
			changePhotoMode: false,
			photos: []
		});
	}

	componentDidMount() {
 		photoUtils.getPhotos(this.receievedPhotos.bind(this));
	}

	receievedPhotos(photos) {
		this.setState({
			photos: photos || {}
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState(nextProps)
	}

	changeButtonClicked(){
		this.setState({
			changePhotoMode: !this.state.changePhotoMode
		});
	}

	imagePicked(img){
		this.setState(img);
		this.setState({
			changePhotoMode: false
		});
		this.props.onPhotoPicked(img);
	}

	render() {
		const {url, name, photos} = this.state;
		const img = url && name ? 
					<img src={url} alt={name} className="thumbnailImage"></img> : null;
		const photosToPick = this.state.changePhotoMode ?
			Object.values(photos).sort(sortByDate('uploadDate')).map((photo, index) => 
				<ImageWithButton url={photo.url} 
									key={index}
									name={photo.name} 
									buttonName="select"
									customClasses={"photoWithButtonToPick"}
									onButtonClicked={this.imagePicked.bind(this)}/>) : null;

		return (
			<div className="thumbnailEditorContainer">
				<div className="thumbnailImagePreviewContainer">
					<div className="thumbnailImageDescriptionContainer">
						<h3>Article Thumbnail</h3>
						<p>
							This is the article thumbnail that will show up on the main articles page.
							It should ideally be a size of 250px by 500px.
						</p>
					</div>
					<ImageWithButton   	
						    url={url} 
							name={name} 
							buttonName="choose existing"
							onButtonClicked={this.changeButtonClicked.bind(this)}/>
				</div>
				
				<div className="photosToPickContainer">
					{photosToPick}
				</div>
			</div>	
		)
	}
}