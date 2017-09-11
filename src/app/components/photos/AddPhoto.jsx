import React from "react";
import {Link} from 'react-router-dom'
import photoUtils from "../../utils/photoUtils";

export class AddPhoto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            percentUploaded: 0,
            file: null,
            photoUploaded: false,
            includeLinkToAllPhotos: !Boolean(props.includeLinkToAllPhotos === false),
            onFileUploaded: props.onFileUploaded
        }
    }

    onThumbnailUploaded(event) {
        const file = event.target.files[0];

        this.setState({
            file,
            photoUploaded: false
        })
    }

    onUploadClicked() {
        this.uploadFile();
    }

    uploadFile() {
        if (this.state.file === null) {
            alert("no file selected!");
            return;
        }

        const onProgress = (percentUploaded) => {
            this.setState({percentUploaded});
        };

        const onError = (err) => {

        };

        const onComplete = (imgName, downloadURL) => {
            this.setState({
                percentUploaded: 100,
                photoUploaded: true
            });

            if (this.state.onFileUploaded) {
                this.state.onFileUploaded(imgName, downloadURL);
            }
        }

        photoUtils.addPhoto(this.state.file, onProgress, onError, onComplete);
    }


    render() {
        let uploadButton = null;
        let uploadedMessage = null;
        let allPhotosButton = null;

        if (this.state.photoUploaded) {
            uploadedMessage = <p>{this.state.file.name} uploaded</p>
        }
        else {
            uploadButton = <button className="btn btn-primary center-block"
                                   onClick={this.onUploadClicked.bind(this)}
                                   type="submit">Upload
            </button>
        }

        if (this.state.includeLinkToAllPhotos) {
            allPhotosButton = <Link to="/photos">
                <button className="btn btn-primary center-block"
                        type="submit">All Photos
                </button>
            </Link>;
        }

        return (
            <div className="addPhotoContainer">
                <progress value={this.state.percentUploaded} max="100">0%</progress>
                <input type="file" onChange={(event) => {
                    this.onThumbnailUploaded(event)
                }}></input>
                {uploadButton}
                {uploadedMessage}
                {allPhotosButton}
            </div>
        );
    }
}