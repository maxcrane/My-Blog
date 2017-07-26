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
			        <Link className="navitem navlink navlinkspacing" to="/about">ABOUT</Link><li className="divider">/</li>
			        <Link className="navitem navlink navlinkspacing" to="/articles">ARTICLES</Link>
		        </ul>
		)
	}
}
