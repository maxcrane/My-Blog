import React from "react";
import SimpleMDE from "simplemde";
import TextField from 'material-ui/TextField';
import ArticleThumbnailEditor from './ArticleThumbnailEditor.jsx';
import RaisedButton from 'material-ui/RaisedButton';


export class ArticleEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: null,
            title: props.title || "",
            content: props.content || "",
            percentUploaded: 0,
            thumbnailUrl: null,
            thumbnailName: null,
            photoMode: null
        };
        this.id = "markdownEditor";
    }

    componentDidMount() {
        this.createEditor();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title || "",
            thumbnailUrl: nextProps.thumbnailUrl || null,
            thumbnailName: nextProps.thumbnailName || null
        });

        if (this.state.editor) {
            this.state.editor.value(nextProps.content);
        }
    }

    createEditor() {
        const editor = new SimpleMDE({
            element: document.getElementById(this.id),
            renderingConfig: {
                //will will highlight code using highlight.js
                codeSyntaxHighlighting: true
            }
        });

        editor.value(this.state.content || "");
        this.setState({editor});
    }

    onTitleChanged(event) {
        this.setState({
            title: event.target.value
        });
    }

    onButtonClicked(callback) {
        let text = this.state.editor.value();
        callback(this.state.title.trim(), text,
            this.state.thumbnailUrl, this.state.thumbnailName);
    }

    onPhotoPicked(photo) {
        this.setState({
            thumbnailUrl: photo.url,
            thumbnailName: photo.name,
        });
    }

    render() {
        let buttons = this.props.buttons;
        let textarea = React.createElement('textarea',
            {id: this.id, className: "markdownEditor"});

        let editor = React.createElement('div',
            {id: `${this.id}-wrapper`, className: "markdownEditor"}, textarea);

        const {thumbnailUrl, thumbnailName} = this.state;

        let titleStyle = {
            width: '100%'
        };

        return (
            <div className="articleEditor shadow">
                <TextField className="articleTitleField"
                           floatingLabelText="Article Title"
                           onChange={this.onTitleChanged.bind(this)}
                           value={this.state.title}
                           style={titleStyle}
                />
                {editor}
                <ArticleThumbnailEditor url={thumbnailUrl}
                                        name={thumbnailName}
                                        onPhotoPicked={this.onPhotoPicked.bind(this)}/>
                {
                    buttons.map((button) => <RaisedButton
                        key={button.name}
                        label={button.name}
                        primary={true}
                        onClick={() => {
                            this.onButtonClicked(button.callback)
                        }}
                        className="buttonsInColumn"
                        type="submit"/>)
                }
            </div>
        );
    }
}