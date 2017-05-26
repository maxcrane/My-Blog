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
			photos : {}
		}
		
	}

	componentDidMount() {
		photoUtils.getPhotos(this.receievedPhotos.bind(this));
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
		let addPhotoButton = <Link to="/photos/add"><button className="btn btn-primary center-block" type="submit">Add Photo</button></Link>;
		let photoKeys = Object.keys(this.state.photos);

		return (
			<div className="photoListContainer">
				{
					Object.values(this.state.photos).map((photo, index) => 
						<div key={`${index}container`} className="photoContainer">
							<a href={photo.url}>
								<img key={index} 
	      						 src={photo.url} 
	      						 alt={photo.name}
	      						 className="photoInList"/>
		      				</a> 

		      				<a href="javascript:;">
		      					<span 
		      						  key={`delete${index}`}
		      						  className="glyphicon glyphicon-trash deletePhotoButton" 
		      						  onClick={()=>{this.deleteImageClicked(photoKeys[index])}}>
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