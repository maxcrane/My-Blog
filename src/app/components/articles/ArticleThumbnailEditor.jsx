import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import PhotoDropzone from "../photos/PhotoDropzone.jsx";
import ImageWithButton from "./ImageWithButton.jsx";
import photoUtils from "../../utils/photoUtils";
import {sortByDate} from "../../utils/dateSorter";
import ArticleThumbnail from "../photos/ArticleThumbnail.jsx";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactPaginate from 'react-paginate';

export default class ArticleThumbnailEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            url: props.url,
            name: props.name,
            chooseExistingPhotoMode: false,
            photos: [],
            isMounted: false,
            showUploadProgress: undefined,
            currentPage: 1,
            pageCount: undefined,
            photosPerPage: 10
        });
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false})
    }

    receivedPhotos(photos) {
        if (this.state.isMounted) {
            this.setState({
                photos: photos || {},
                pageCount: Math.ceil(Object.values(photos).length / this.state.photosPerPage)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isMounted) {
            this.setState(nextProps)
        }
    }

    chooseExistingPhotoClicked() {
        if (!this.state.chooseExistingPhotoMode) {
            photoUtils.getPhotos(this.receivedPhotos.bind(this));
        }

        this.setState({
            chooseExistingPhotoMode: !this.state.chooseExistingPhotoMode
        });
    }

    imagePicked(img) {
        this.setState(img);
        this.setState({
            chooseExistingPhotoMode: false
        });
        this.props.onPhotoPicked(img);
    }

    onImageUploaded(photo) {
        const {name, url} = photo;
        this.setState({name, url});
        this.setState({showUploadProgress: false});
        this.props.onPhotoPicked({name, url});
    }

    onImageFilePicked(event) {
        const photo = event.target.files[0];
        this.setState({showUploadProgress: true});
        photoUtils.addPhoto(photo).then(this.onImageUploaded.bind(this));
    }

    handleClose = () => {
        this.setState({chooseExistingPhotoMode: false});
    };


    handlePageClick = (data) => {
        this.setState({currentPage: data.selected + 1});
    };

    render() {
        const {
            url, name, photos, showUploadProgress,
            chooseExistingPhotoMode, currentPage, photosPerPage
        } = this.state;

        const startIndex = (currentPage - 1) * photosPerPage;
        const endIndex = currentPage * photosPerPage;

        const photosToPick = chooseExistingPhotoMode ?
            Object.values(photos).sort(sortByDate('uploadDate')).slice(startIndex, endIndex).map((photo, index) =>
                <ImageWithButton url={photo.url}
                                 key={index}
                                 name={photo.name}
                                 buttonName="select"
                                 customClasses={"photoWithButtonToPick"}
                                 onButtonClicked={this.imagePicked.bind(this)}/>) : null;
        const actions = [
            <ReactPaginate previousLabel={"PREVIOUS"}
                           nextLabel={"NEXT"}
                           pageCount={this.state.pageCount}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           forcePage={this.state.currentPage - 1}
                           onPageChange={this.handlePageClick}
                           containerClassName={"pagination"}
                           subContainerClassName={"pages pagination"}
                           activeClassName={"active"}/>,
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />
        ];

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
            dialog: {
                height: '90%',
                maxHeight: 'none',
                width: '80%',
                maxWidth: 'none',
            }
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
                                          onClick={this.chooseExistingPhotoClicked.bind(this)}/>
                            <RaisedButton
                                label="upload new photo"
                                labelPosition="before"
                                style={styles.uploadButton}
                                className="buttonsInColumn"
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

                <Dialog open={chooseExistingPhotoMode} autoScrollBodyContent={true}
                        actionsContainerClassName={"customActionsContainer"}
                        onRequestClose={this.handleClose.bind(this)}
                        actions={actions} contentStyle={styles.dialog}>
                    <div className="photosToPickContainer">
                        {photosToPick}
                    </div>
                </Dialog>

            </div>
        )
    }
}