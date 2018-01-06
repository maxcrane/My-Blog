import React from "react";
import articleUtils from "../../utils/articleUtils";
import ReactDisqusComments from 'react-disqus-comments';

export class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            title: "",
            thumbnailName: "",
            thumbnailUrl: "",
            creationDate: ""
        };
    }

    componentDidMount() {
        this.getArticle();
    }


    getArticle() {
        const articleUrlKey = this.props.match.params.title;

        articleUtils.getArticleAtUrl(articleUrlKey)
            .then(this.setState.bind(this))
            //TODO:: actually show 404 type error.
            .catch(console.log)
    }

    handleNewComment(comment) {
        console.log(comment.text);
    }

    render() {
        const showdown = require('showdown');
        const showdownHighlight = require("showdown-highlight");
        const converter = new showdown.Converter({
            extensions: [showdownHighlight]
        });
        const markdown = converter.makeHtml(this.state.content);

        const {title, creationDate, thumbnailUrl, thumbnailName} = this.state;
        const prettyDate = creationDate !== "" ?
            articleUtils.getPrettyCreationDate(creationDate) : "";

        var img = null;
        if (thumbnailUrl && thumbnailName) {
            img = <img src={thumbnailUrl}
                       alt={thumbnailName}
                       className="articlePhoto">
            </img>
        }

        const articleKey = this.props.match.params.title;
        const url = `http://maxcrane.org/${articleKey}`;


        return (
            <div className="article">
                <h2 className="articleTitle">{title}</h2>
                <p className="articleDate">{prettyDate}</p>

                {img}

                <div id="content" ref="content"
                     dangerouslySetInnerHTML={{__html: markdown}}/>

                <div className='disquisCommentSection'>
                    <ReactDisqusComments
                        shortname="maxcrane-org"
                        identifier={articleKey}
                        title={articleKey}
                        category_id="123456"
                        onNewComment={this.handleNewComment.bind(this)}/>
                </div>
            </div>
        );

    }
}