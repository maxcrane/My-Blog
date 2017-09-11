import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import PhotoDropzone from "../photos/PhotoDropzone.jsx";
import ImageWithButton from "./ImageWithButton.jsx";
import photoUtils from "../../utils/photoUtils";
import {sortByDate} from "../../utils/dateSorter";
import ArticleThumbnail from "../photos/ArticleThumbnail.jsx";

export default class ArticleThumbnailEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            url: props.url,
            name: props.name,
            changePhotoMode: false,
            photos: [],
            isMounted: false,
            showUploadProgress: undefined
        });
    }

    componentDidMount() {
        this.setState({isMounted: true});
        photoUtils.getPhotos(this.receievedPhotos.bind(this));
    }

    componentWillUnmount() {
        this.setState({isMounted: false})
    }

    receievedPhotos(photos) {
        if (this.state.isMounted) {
            this.setState({
                photos: photos || {}
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isMounted) {
            this.setState(nextProps)
        }
    }

    changeButtonClicked() {
        this.setState({
            changePhotoMode: !this.state.changePhotoMode
        });
    }

    imagePicked(img) {
        this.setState(img);
        this.setState({
            changePhotoMode: false
        });
        this.props.onPhotoPicked(img);
    }

    onImageUploaded(name, url) {
        this.setState({name, url});
        this.setState({showUploadProgress: false});
        this.props.onPhotoPicked({name, url});
    }

    onImageFilePicked(event) {
        const photo = event.target.files[0];
        this.setState({showUploadProgress: true});
        photoUtils.addPhoto(photo, undefined, undefined, this.onImageUploaded.bind(this));
    }

    render() {
        const {url, name, photos, showUploadProgress} = this.state;

        const photosToPick = this.state.changePhotoMode ?
            Object.values(photos).sort(sortByDate('uploadDate')).map((photo, index) =>
                <ImageWithButton url={photo.url}
                                 key={index}
                                 name={photo.name}
                                 buttonName="select"
                                 customClasses={"photoWithButtonToPick"}
                                 onButtonClicked={this.imagePicked.bind(this)}/>) : null;
        const styles = {
            uploadButton: {
                verticalAlign: 'middle',
            },
            uploadInput: {
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: '100%',
                opacity: 0,
            },
        };

        return (
            <div className="thumbnailEditorContainer">
                <div className="thumbnailImagePreviewContainer">
                    <div className="thumbnailImageDescriptionContainer">
                        <h3>Article Thumbnail</h3>
                        <p>
                            This is the article thumbnail that will show up on the main articles page.
                            It should ideally be a size of 250px by 500px. Upload a file by dragging it to the dropzone
                            on the right or select an option below.
                        </p>

                        <div className="thumbnailEditorButtonContainer">
                            <RaisedButton label="choose existing photo"
                                          type="submit"
                                          className="buttonsInColumn"
                                          onClick={this.changeButtonClicked.bind(this)}/>
                            <RaisedButton
                                label="upload new photo"
                                labelPosition="before"
                                style={styles.uploadButton}
                                containerElement="label">
                                <input type="file" style={styles.uploadInput}
                                       onChange={(event) => {
                                           this.onImageFilePicked(event)
                                       }}/>
                            </RaisedButton>
                        </div>
                    </div>

                    <PhotoDropzone onImageUploaded={this.onImageUploaded.bind(this)}
                                   showUploadProgress={showUploadProgress}>
                        <ArticleThumbnail url={url} name={name}/>
                    </PhotoDropzone>
                </div>

                <div className="photosToPickContainer">
                    {photosToPick}
                </div>
            </div>
        )
    }
}