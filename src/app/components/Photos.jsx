import React from "react";
import _ from "lodash";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import photoUtils from "../utils/photoUtils";


export class Photos extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			photos : {},
			isSelectionMode : Boolean(props.isSelectionMode),
			onPhotoClicked : props.onPhotoClicked,
			loggedIn: false
		}
	}

	componentDidMount() {
		auth.onAuthStateChanged(function(user) {			
		  if (user) {
		    photoUtils.getPhotos(this.receievedPhotos.bind(this));
		    this.setState({
		    	loggedIn: true
		    });
		  } 
		}.bind(this));
	}

	receievedPhotos(photos) {
		this.setState({
			photos: photos || {}
		})
	}

	componentWillReceiveProps(nextProps) {

	}

	deleteImageClicked(imageKey) {
		const photos = this.state.photos;
		const photoName = photos[imageKey].name;

		if(confirm(`Are you sure you want to delete ${photoName}`)){
			photoUtils.deletePhoto(photoName, imageKey).then((data) => {
				this.setState({
					photos : _.omit(this.state.photos, imageKey)
				});
			}).catch((err) => {
				console.log(`err: ${err}`);
			});
		}
	}

	render() {
		let addPhotoButton = this.state.loggedIn ?  
							<Link to="/photos/add">
								<button className="btn btn-primary center-block addPhotoButton" 
										type="submit">
										Add Photo
								</button>
							</Link> : null;
		let photoKeys = Object.keys(this.state.photos);

		return (
			<div className="photoListContainer">
				{
					Object.values(this.state.photos).map((photo, index) => 
						<div key={`${index}container`} className="photoContainer">
							<a href={this.state.isSelectionMode ? "javascript:;" : photo.url}>
								<img key={index} 
	      						 src={photo.url} 
	      						 alt={photo.name}/>
		      				</a> 
	      					<a href="javascript:;">
		      					<span style={this.state.isSelectionMode ? {display: "none"} : {}}
		      						  key={`delete${index}`}
		      						  className="glyphicon glyphicon-trash deletePhotoButton" 
		      						  onClick={()=>{this.deleteImageClicked(photoKeys[index])}}>
		      					</span>
	      					</a>
	      					<a href="javascript:;">
		      					<span style={this.state.isSelectionMode ? {} : {display: "none"}}
		      						  key={`delete${index}`}
		      						  className="glyphicon glyphicon-plus deletePhotoButton" 
		      						  onClick={()=>{this.state.onPhotoClicked(photo.name, photo.url)}}>
		      					</span>
	      					</a>
	      				</div>
      				)
      			}
				{addPhotoButton}
			</div>
		);
	}
}