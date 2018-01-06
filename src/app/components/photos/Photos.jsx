import React from "react";
import _ from "lodash";
import photoUtils from "../../utils/photoUtils";
import {sortByDate} from "../../utils/dateSorter";
import CopyToClipboard from 'react-copy-to-clipboard';
import PhotoDropzone from './PhotoDropzone.jsx';
import ReactPaginate from 'react-paginate';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export class Photos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: {},
            receivedPhotos: false,
            // TODO: hide page contents if user isn't an admin
            isAdmin: props.isAdmin,
            currentPage: 1,
            pageCount: undefined,
            photosPerPage: 6,
            addPhotoDialogOpen: false,
            snackbarOpen: false,
            snackbarMessage: ''
        }
    }

    componentDidMount() {
        photoUtils.getPhotos(this.receivedPhotos.bind(this));
    }

    componentWillReceiveProps(newProps) {
        if ('isAdmin' in newProps) {
            this.setState({isAdmin: newProps.isAdmin});
        }
    }

    receivedPhotos(photos) {
        //firebase sends back an object that looks like {code : NOT_AUTHORIZED}
        //if the user is not authorized to view photos from the db
        if (photos && !("code" in photos)) {
            photos = photos || {};
            this.setState({photos});
            this.setPageCount();
        }

        this.setState({receivedPhotos: true});
    }

    setPageCount() {
        const {photos, currentPage} = this.state;
        const newPageCount = Math.ceil(Object.values(photos).length / this.state.photosPerPage);
        const newCurrentPage = currentPage > newPageCount ? newPageCount : currentPage;

        this.setState({
            pageCount: newPageCount,
            currentPage: newCurrentPage
        });
    }

    handlePageClick = (data) => {
        const currentPage = data.selected + 1;
        this.setState({currentPage});
    };

    deleteImageClicked(imageKey) {
        const photos = this.state.photos;
        const photoName = photos[imageKey].name;

        if (confirm(`Are you sure you want to delete ${photoName}`)) {
            photoUtils.deletePhoto(photoName, imageKey).then(() => {
                this.setState({
                    photos: _.omit(this.state.photos, imageKey)
                });

                this.setPageCount();
            }).catch((err) => {
                console.log(`err: ${err}`);
            });
        }
    }

    onImageUploaded(photo) {
        const photos = this.state.photos;
        photos[photoUtils.getKeyForPhotoName(photo.name)] = photo;
        this.setState({photos, snackbarOpen: true, snackbarMessage: `successfully uploaded ${photo.name}`});
        this.setPageCount();
    }

    closeSnackbar() {
        this.setState({snackbarOpen: false, snackbarMessage: ''});
    }

    toggleAddPhotoDialogOpen = () => {
        const {addPhotoDialogOpen} = this.state;
        this.setState({addPhotoDialogOpen: !addPhotoDialogOpen});
    };

    static getMarkdownPhotoEmbed(photo) {
        return `![${photo.name}](${photo.url})`;
    }

    openSnackbarForPhotoEmbed(photo) {
        this.setState({
            snackbarMessage: `copied markdown embed to clipboard for image ${photo.name}`,
            snackbarOpen: true
        });
    }

    render() {
        const {photos, currentPage, photosPerPage, pageCount, addPhotoDialogOpen, receivedPhotos, snackbarOpen, snackbarMessage, isAdmin} = this.state;
        const startIndex = (currentPage - 1) * photosPerPage;
        const endIndex = currentPage * photosPerPage;

        const photosToDisplay = Object.keys(photos)
            .map((key) => Object.assign(photos[key], {key}))
            .sort(sortByDate('uploadDate'))
            .slice(startIndex, endIndex);

        const actions = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.toggleAddPhotoDialogOpen.bind(this)}
            />
        ];

        return (
            <div className="photoListContainer">
                {
                    isAdmin ?
                        <div>
                            {
                                pageCount > 1 ? <ReactPaginate previousLabel={"PREVIOUS"}
                                                           nextLabel={"NEXT"}
                                                           pageCount={this.state.pageCount}
                                                           marginPagesDisplayed={2}
                                                           pageRangeDisplayed={5}
                                                           forcePage={this.state.currentPage - 1}
                                                           onPageChange={this.handlePageClick}
                                                           containerClassName={"pagination"}
                                                           subContainerClassName={"pages pagination"}
                                                           activeClassName={"active"}/> : null

                            }

                            <FloatingActionButton onClick={this.toggleAddPhotoDialogOpen.bind(this)}>
                                <AddAPhoto/>
                            </FloatingActionButton>
                        </div>
                        : null
                }


                <div className={"photosContainer"}>
                    {
                        photosToDisplay.map((photo, index) =>
                            <div key={`${index}container`} className="thumbnailImageContainer">
                                <a href={photo.url}>
                                    <img key={index}
                                         className="thumbnailImage"
                                         src={photo.url}
                                         alt={photo.name}/>
                                </a>

                                <a>
		      					<span key={`delete${index}`}
                                      className="glyphicon glyphicon-trash deletePhotoButton"
                                      onClick={() => {
                                          this.deleteImageClicked(photo.url)
                                      }}>
		      					</span>
                                </a>

                                <CopyToClipboard text={Photos.getMarkdownPhotoEmbed(photo)}>
                                    <a onClick={() => {
                                        this.openSnackbarForPhotoEmbed(photo)
                                    }}>
			      					<span key={`copy${index}`}
                                          className="glyphicon glyphicon-copy copyPhotoButton">
			      					</span>
                                    </a>
                                </CopyToClipboard>
                            </div>
                        )
                    }
                </div>

                {

                }

                {
                    photosToDisplay.length === 0 && receivedPhotos ?
                        <p className={"photoListEmpty"}>no photos found :(</p> : null
                }

                <Dialog open={addPhotoDialogOpen}
                        autoScrollBodyContent={true}
                        actionsContainerClassName={"customActionsContainer"}
                        onRequestClose={this.toggleAddPhotoDialogOpen.bind(this)}
                        actions={actions}
                        contentClassName={"addPhotoDialog"}
                >
                    <div className={"addPhotoDialog"}>
                        <PhotoDropzone onImageUploaded={this.onImageUploaded.bind(this)}/>
                    </div>
                </Dialog>

                <Snackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackbar.bind(this)}
                />

            </div>
        );
    }
}