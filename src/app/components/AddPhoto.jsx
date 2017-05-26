import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import auth from "../utils/auth";
import photoUtils from "../utils/photoUtils";

export class AddPhoto extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {
			percentUploaded: 0
		}
	} 

	componentDidMount(){
	}

	componentWillReceiveProps(nextProps){

	}

		onThumbnailUploaded(event){
		const file = event.target.files[0];

		const onProgress = (snapshot) => {
			this.setState({
				percentUploaded: (snapshot.bytesTransferred/snapshot.totalBytes) * 100
			});
		};

		const onError = (err) => {

		};

		const onComplete = () => {
			this.setState({
				percentUploaded: 100
			});
			alert("file uploaded!");
		}
 
		photoUtils.addPhoto(file, onProgress, onError, onComplete);
	}



	render() {
		return (
			<div>
				<progress value={this.state.percentUploaded} max="100">0%</progress>
				<input type="file" onChange={(event)=>{this.onThumbnailUploaded(event)}}></input>
			</div>
		);
	}
}