import React from "react";
import _ from "lodash";
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
            photoUtils.deletePhoto(photoName, imageKey).then(() => {
                this.setState({
                    photos: _.omit(this.state.photos, imageKey)
                });
            }).catch((err) => {
                console.log(`err: ${err}`);
            });
        }
    }

    onImageUploaded(photo) {
        //TODO: (Probably safer to) grab the uuid firebase created instead of using the name as a unique key
        const photos = this.state.photos;
        photos[photo.name] = photo;
        this.setState({ photos });
    }

    static getMarkdownPhotoEmbed(photo) {
        return `![${photo.name}](${photo.url})`;
    }

    render() {
        let {photos} = this.state;
        for (let key in photos) {
            photos[key].key = key;
        }

        return (
            <div className="photoListContainer">
                <PhotoDropzone onImageUploaded={this.onImageUploaded.bind(this)}/>
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

            </div>
        );
    }
}