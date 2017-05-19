import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export class Navbar extends React.Component{

	render() {
		return (
				<ul className="navcontainer">
					<Link className="navitem navlink" to="/">HOME</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/about">ABOUT</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/articles">ARTICLES</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/music">PROJECTS</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/music">MUSIC</Link>
		        </ul>
		)
	}
}
