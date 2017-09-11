import React from "react";
import Dropzone from 'react-dropzone'
import photoUtils from "../../utils/photoUtils";
import CircularProgress from 'material-ui/CircularProgress';

export default class PhotoDropzone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploadProgress: false
        }
    }

    onDrop(acceptedFiles, rejectedFiles) {
        //TODO: Only accept image file formats, show error message for other file types
        const [photo] = acceptedFiles;
        photoUtils.addPhoto(photo, undefined, this.onError.bind(this), this.onPhotoUploaded.bind(this));
        this.setState({
            showUploadProgress: true
        })
    }

    componentWillReceiveProps(nextProps) {
        const {showUploadProgress} = nextProps;

        if (typeof showUploadProgress === 'boolean') {
            this.setState({showUploadProgress})
        }
    }


    onError() {
        //TODO: Handle this, show an error message
    }

    onPhotoUploaded(photoName, photoUrl) {
        this.setState({
            showUploadProgress: false
        });

        this.props.onImageUploaded(photoName, photoUrl);
    }

    render() {
        return (
            <div>
                <Dropzone className="customDropzone"
                          activeClassName="dropZoneActive"
                          onDrop={this.onDrop.bind(this)}>
                    {
                        this.state.showUploadProgress ?
                            <div className="flexContainerCenterItem">
                                <CircularProgress
                                    size={150}
                                    thickness={5}
                                />
                            </div> : null
                    }
                    {this.state.showUploadProgress ? null : this.props.children}
                </Dropzone>
            </div>

        )
    }
}