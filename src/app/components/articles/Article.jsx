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
        const url = `https://maxcrane.org/${articleKey}`;
        const shortName = 'maxcrane-org';
        const categoryId='7669460'; //this the default category named 'general'

        return (
            <div className="article">
                <h2 className="articleTitle">{title}</h2>
                <p className="articleDate">{prettyDate}</p>

                {img}

                <div id="content" ref="content"
                     dangerouslySetInnerHTML={{__html: markdown}}/>

                <div className='disquisCommentSection'>
                    <ReactDisqusComments
                        shortname={shortName}
                        identifier={articleKey}
                        title={articleKey}
                        url={url}
                        category_id={categoryId}
                        onNewComment={this.handleNewComment.bind(this)}/>
                </div>
            </div>
        );

    }
}