import React from "react";
import ReactDOM from "react-dom";

//Root folder
import {About} from "./components/About.jsx";
import {Home} from "./components/Home.jsx";
import {Navbar} from "./components/Navbar.jsx";
import {Footer} from "./components/Footer.jsx";
import {Admin} from "./components/Admin.jsx";

//Photo folder
import {Photos} from "./components/photos/Photos.jsx";
import {AddPhoto} from "./components/photos/AddPhoto.jsx";

//Article folder
import {Article} from "./components/articles/Article.jsx";
import {ArticleList} from "./components/articles/ArticleList.jsx";
import {ArticleCard} from "./components/articles/ArticleCard.jsx";
import {CreateArticle} from "./components/articles/CreateArticle.jsx";
import {EditArticle} from "./components/articles/EditArticle.jsx";

//Inline css
import './css/app.css';
import './css/simplemde.min.css';
import './css/default.min.css';
import './css/opensans.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

ReactDOM.render(
	<Router>
		<div>
		  	<Navbar/>
		    <Switch>
		   		<Route exact path="/"         component={ArticleList}/>
		   		<Route path="/edit/:title"    component={EditArticle}/>
		   		<Route path="/article/:title" component={Article}/>	
		  		<Route path="/about"          component={About}/>
		  		<Route path="/articles"       component={ArticleList}/>
		  		<Route path="/admin"          component={Admin}/>	
		  		<Route path="/create"         component={CreateArticle}/>
		  		<Route exact path="/photos"   component={Photos}/>
		  		<Route path="/photos/add"     component={AddPhoto}/>
		    </Switch>
		    <Footer/>
		</div>
  	</Router>,
  	document.getElementById("app")
);
