import React from "react";

export default class ArticleThumbnail extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            url: props.url,
            name: props.name,
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState(nextProps);
    }

    render() {
        const {url, name} = this.state;

        return (
            <div className="thumbnailImageContainer">
                {
                    url && name ? <img src={url} alt={name} className="thumbnailImage"/> : null
                }
            </div>

        )
    }
}