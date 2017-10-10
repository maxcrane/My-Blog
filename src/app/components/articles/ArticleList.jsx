import React, {Component} from "react";
import ArticleCard from './ArticleCard.jsx';
import Loader from "../Loader.jsx";

class ArticleList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {articles} = this.props;

        return (
            <div className="articleList">
                {
                    articles.map((article, index) =>
                        <ArticleCard key={index}
                                     article={article}
                                     index={index}
                                     history={this.props.history}
                                     deleteArticle={this.props.deleteArticle.bind(this)}
                                     isAdmin={this.props.isAdmin}/>
                    )
                }
                {
                    articles.hasOwnProperty('length') && articles.length === 0 ?
                        <p>
                            no articles yet :(
                        </p> : null
                }
            </div>
        );
    }
}

export default Loader('articles')(ArticleList);