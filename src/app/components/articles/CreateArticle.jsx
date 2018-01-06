import React from "react";
import {withRouter} from 'react-router-dom'
import {ArticleEditor} from "./ArticleEditor.jsx";
import articleUtils from "../../utils/articleUtils";

class CreateArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: props.isAdmin,
            user: props.user,
            title: null,
            content: null,
            thumbnailName: null,
            thumbnailUrl: null,
            buttons: [
                {name: "save as draft", callback: this.onSaveDraft.bind(this)},
                {name: "publish", callback: this.onPublishArticle.bind(this)}
            ]
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isAdmin: nextProps.isAdmin,
            user: nextProps.user
        });
    }

    onSaveDraft(title, content, thumbnailUrl, thumbnailName) {
        const creationDate = new Date().toJSON();
        const authorUid = this.state.user.uid;

        articleUtils.saveDraft({
            title,
            content,
            thumbnailName,
            thumbnailUrl,
            creationDate,
            authorUid
        }).then((res) => {
            //TODO: Make into a toast instead of modal
            alert(`draft saved!`);
            const draftLink = `/edit-draft/${res}`;
            this.props.history.push(draftLink);
        }).catch((err) => {
            alert(err);
        });
    }

    onPublishArticle(title, content, thumbnailUrl, thumbnailName) {
        const creationDate = new Date().toJSON();
        const url = articleUtils.getUrlFromTitle(title);
        const authorUid = this.state.user.uid;

        articleUtils.publishArticle({
            title,
            content,
            thumbnailName,
            thumbnailUrl,
            creationDate,
            authorUid,
            url
        }).then(() => {
            const articleLink = `article/${url}`;
            this.props.history.push(articleLink);
        }).catch((err) => {
            //TODO: Use material UI dialog
            alert(err);
        });
    }

    render() {
        let editor = null;
        let {isAdmin, buttons} = this.state;

        if (isAdmin) {
            editor = <ArticleEditor content="" title="" buttons={buttons}/>;
        }

        return (
            <div>
                {editor}
            </div>
        );
    }
}

export default withRouter(CreateArticle);