import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../../utils/auth";
import photoUtils from "../../utils/photoUtils";
import {AddPhoto} from "./AddPhoto.jsx";
import {Photos} from "./Photos.jsx";

export class PhotoPicker extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			//possible values: none, existing, upload
			photoPickingMode : "none" 
		}
	} 

	//Photo info will contain
	//	 photoUrl - where image is hosted
	//	 photoName - name of the photo
	onPhotoPicked(photoName, photoUrl) {
		this.props.onPhotoPicked({
			photoUrl,
			photoName
		});

		this.setState({
			photoPickingMode : "none"
		});
	}

	render() {
		const {photoPickingMode} = this.state;
		let cancelPhotoUploadButton = null;
		let chooseExistingImageButton = null;
		let chooseExistingImage = null;
		let uploadNewImageButton = null;
		let uploadNewImage = null;

		if (photoPickingMode === 'none') {
			chooseExistingImageButton = <button className="btn btn-info center-block editorAddPhotoButton" 
											type="submit"
											onClick={()=>{this.setState({photoPickingMode:'existing'})}}>
										Choose Existing Image
										</button>
			uploadNewImageButton = 		<button className="btn btn-info center-block editorAddPhotoButton" 
											type="submit"
											onClick={()=>{this.setState({photoPickingMode:'upload'})}}>
										Upload New Image
									</button>
		}
		else {
			cancelPhotoUploadButton = <button className="btn btn-danger center-block editorAddPhotoButton" 
											type="submit"
											onClick={()=>{this.setState({photoPickingMode:'none'})}}>
										Cancel
									  </button>
		}
		

		if (photoPickingMode === 'existing') {
			chooseExistingImage = <Photos isSelectionMode={true} 
										  includeAddPhotoButton={false}
										  onPhotoClicked={this.onPhotoPicked.bind(this)}/>
		}
		else if (photoPickingMode === 'upload') {
			uploadNewImage = <AddPhoto includeLinkToAllPhotos={false}
						  onFileUploaded={this.onPhotoPicked.bind(this)}/>
		}

		return (
			<div>
				{cancelPhotoUploadButton}
				{chooseExistingImageButton}
				{uploadNewImageButton}
				{chooseExistingImage}
				{uploadNewImage}
			</div>
		);
	}
}