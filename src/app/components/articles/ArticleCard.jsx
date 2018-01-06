import React from "react";
import articleUtils from "../../utils/articleUtils";
import {
    Link,
    withRouter
} from 'react-router-dom';

class ArticleCard extends React.Component {
    constructor(props) {
        super(props);
    }

    editArticle() {
        const article = this.props.article;

        const linkPrefix = (this.props.isDraft || article.draftKey) ? 'edit-draft' : 'edit';
        const linkKey = this.props.isDraft ? article.key : article.draftKey || article.url;
        const editArticleLink = `${linkPrefix}/${linkKey}`;
        this.props.history.push(editArticleLink);
    }

    render() {
        const {index, article, isAdmin} = this.props;
        const editButton = isAdmin ? <span className="glyphicon glyphicon-pencil articlelinkedit"
                                           onClick={this.editArticle.bind(this)}>
	    									</span> : null;
        const deleteButton = isAdmin ? <span className="glyphicon glyphicon-trash articlelinkdelete"
                                             onClick={() => {
                                                 this.props.deleteArticle(article)
                                             }}>
	    									</span> : null;
        let img = null;
        if (article.thumbnailUrl && article.thumbnailName) {
            img = <img key={`${index}img`}
                       src={article.thumbnailUrl}
                       alt={article.thumbnailName}
                       className="articlePhoto">
            </img>
        }

        if (article.content === undefined) {
            article.content = "";
        }

        return (
            <div className="articleCard">
                <div className="articleLinkContainer">
                    <Link className="articleLink navlink"
                          key={`${index}link`}
                          to={{
                              pathname: `/article/${article.url}`,
                              state: {key: article.url}
                          }}>

                        <h2 key={index} className="articleTitle">
                            {article.title}
                        </h2>

                    </Link>
                    {editButton}
                    {deleteButton}
                </div>


                <p key={`${index}date`} className="articleDate">
                    {articleUtils.getPrettyCreationDate(article.creationDate)}
                </p>

                <p className="articlePreview">{article.preview || article.content.substring(0, 150)}...</p>

                <div className="articleImageContainer">
                    {img}
                </div>

            </div>
        );
    }
}

export default withRouter(ArticleCard);