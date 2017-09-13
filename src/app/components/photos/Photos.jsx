import React from "react";
import _ from "lodash";
import {Link} from 'react-router-dom'
import auth from "../../utils/auth";
import photoUtils from "../../utils/photoUtils";
import {sortByDate} from "../../utils/dateSorter";
import CopyToClipboard from 'react-copy-to-clipboard';
import PhotoDropzone from './PhotoDropzone.jsx';

export class Photos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: {},
            isSelectionMode: Boolean(props.isSelectionMode),
            onPhotoClicked: props.onPhotoClicked,
            loggedIn: false,
            includeAddPhotoButton: props.includeAddPhotoButton !== false
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(function (user) {
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

    deleteImageClicked(imageKey) {
        const photos = this.state.photos;
        const photoName = photos[imageKey].name;

        if (confirm(`Are you sure you want to delete ${photoName}`)) {
            photoUtils.deletePhoto(photoName, imageKey).then((data) => {
                this.setState({
                    photos: _.omit(this.state.photos, imageKey)
                });
            }).catch((err) => {
                console.log(`err: ${err}`);
            });
        }
    }

    static getMarkdownPhotoEmbed(photo) {
        return `![${photo.name}](${photo.url})`;
    }

    render() {
        let {photos} = this.state;
        let addPhotoButton = (this.state.loggedIn && this.state.includeAddPhotoButton) ?
            <Link to="/photos/add">
                <button className="btn btn-primary center-block addPhotoButton"
                        type="submit">
                    Add Photo
                </button>
            </Link> : null;
        for (var key in photos) {
            photos[key].key = key;
        }

        return (
            <div className="photoListContainer">
                {
                    Object.values(photos).sort(sortByDate('uploadDate')).map((photo, index) =>
                        <div key={`${index}container`} className="thumbnailImageContainer">
                            <a href={this.state.isSelectionMode ? "javascript:;" : photo.url}>
                                <img key={index}
                                     className="thumbnailImage"
                                     src={photo.url}
                                     alt={photo.name}/>
                            </a>

                            <a href="javascript:;">
		      					<span style={this.state.isSelectionMode ? {display: "none"} : {}}
                                      key={`delete${index}`}
                                      className="glyphicon glyphicon-trash deletePhotoButton"
                                      onClick={() => {
                                          this.deleteImageClicked(photo.key)
                                      }}>
		      					</span>
                            </a>

                            <a href="javascript:;">
		      					<span style={this.state.isSelectionMode ? {} : {display: "none"}}
                                      key={`delete${index}`}
                                      className="glyphicon glyphicon-plus deletePhotoButton"
                                      onClick={() => {
                                          this.state.onPhotoClicked(photo.name, photo.url)
                                      }}>
		      					</span>
                            </a>

                            <CopyToClipboard text={Photos.getMarkdownPhotoEmbed(photo)}>
                                <a href="javascript:;">
			      					<span key={`copy${index}`}
                                          className="glyphicon glyphicon-copy copyPhotoButton">
			      					</span>
                                </a>
                            </CopyToClipboard>
                        </div>
                    )
                }
                <PhotoDropzone/>
            </div>
        );
    }
}