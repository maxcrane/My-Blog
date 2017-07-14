import React from "react";
import ReactDOM from "react-dom";
import {About} from "./components/About.jsx";
import {Home} from "./components/Home.jsx";
import {Navbar} from "./components/Navbar.jsx";
import {Admin} from "./components/Admin.jsx";
import {Photos} from "./components/Photos.jsx";
import {AddPhoto} from "./components/AddPhoto.jsx";
import {Article} from "./components/articles/Article.jsx";
import {ArticleList} from "./components/articles/ArticleList.jsx";
import {CreateArticle} from "./components/articles/CreateArticle.jsx";
import {EditArticle} from "./components/articles/EditArticle.jsx";

import './css/app.css';
import './css/simplemde.min.css';
import './css/default.min.css';

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
		</div>
  	</Router>,
  	document.getElementById("app")
);
