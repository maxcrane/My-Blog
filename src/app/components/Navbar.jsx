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
			    	<Link className="navitem navlink" to="/">home</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/about">about</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/articles">articles</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/music">music</Link><li className="divider">/</li>
			        <Link className="navitem navlink" to="/music">thing</Link>
		        </ul>
		)
	}
}