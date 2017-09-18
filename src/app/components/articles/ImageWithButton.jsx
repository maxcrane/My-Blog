import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

export default class ImageWithButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            url: props.url,
            name: props.name,
            onButtonClicked: props.onButtonClicked,
            buttonName: props.buttonName
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps)
    }

    changeButtonClicked() {
        this.props.onButtonClicked({
            url: this.props.url,
            name: this.props.name
        })
    }

    render() {
        const {url, name} = this.state;
        const img = url && name ?
            <img src={url} alt={name}
                 className="imageWithButtonImage"/> : null;
        const className = "imageWithButtonContainer " + this.props.customClasses;

        return (


                <div className={className} onClick={this.changeButtonClicked.bind(this)}>
                    {img}
                </div>

        )
    }
}