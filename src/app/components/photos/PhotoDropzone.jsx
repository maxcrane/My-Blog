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
        photoUtils.addPhoto(photo).then((photo)=> {
            const {name, url} = photo;
            this.onPhotoUploaded({name, url});
        }).catch(this.onUploadError.bind(this));

        this.setState({showUploadProgress: true});
    }

    componentWillReceiveProps(nextProps) {
        const {showUploadProgress} = nextProps;

        if (typeof showUploadProgress === 'boolean') {
            this.setState({showUploadProgress})
        }
    }


    onUploadError(error) {
        this.setState({showUploadProgress: false});
        setTimeout(()=>{alert(error)}, 50);
    }

    onPhotoUploaded(photo) {
        this.setState({showUploadProgress: false});
        this.props.onImageUploaded({name: photo.name, url : photo.url});
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