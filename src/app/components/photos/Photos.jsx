import React from "react";
import _ from "lodash";
import photoUtils from "../../utils/photoUtils";
import {sortByDate} from "../../utils/dateSorter";
import CopyToClipboard from 'react-copy-to-clipboard';
import PhotoDropzone from './PhotoDropzone.jsx';
import ReactPaginate from 'react-paginate';

export class Photos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: {},
            // TODO: hide page contents if user isn't an admin
            isAdmin: props.isAdmin,
            currentPage: 1,
            pageCount: undefined,
            photosPerPage: 6
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
        photos = photos || {};
        this.setState({photos});
        this.setPageCount();
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
        //TODO: (Probably safer to) grab the uuid firebase created instead of using the name as a unique key
        const photos = this.state.photos;
        photos[photo.name] = photo;
        this.setState({photos});
    }

    static getMarkdownPhotoEmbed(photo) {
        return `![${photo.name}](${photo.url})`;
    }

    render() {
        const {photos, currentPage, photosPerPage, pageCount} = this.state;
        const startIndex = (currentPage - 1) * photosPerPage;
        const endIndex = currentPage * photosPerPage;

        const photosToDisplay = Object.keys(photos)
            .map((key)=> Object.assign(photos[key], {key}))
            .sort(sortByDate('uploadDate'))
            .slice(startIndex, endIndex);

        return (
            <div className="photoListContainer">
                {/* TODO Re add this, but have it be triggered by a "add photo" button <PhotoDropzone onImageUploaded={this.onImageUploaded.bind(this)}/>*/}

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
                                          this.deleteImageClicked(photo.key)
                                      }}>
		      					</span>
                            </a>

                            <CopyToClipboard text={Photos.getMarkdownPhotoEmbed(photo)}>
                                <a>
			      					<span key={`copy${index}`}
                                          className="glyphicon glyphicon-copy copyPhotoButton">
			      					</span>
                                </a>
                            </CopyToClipboard>
                        </div>
                    )
                }

                {
                    pageCount ? <ReactPaginate previousLabel={"PREVIOUS"}
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
            </div>
        );
    }
}