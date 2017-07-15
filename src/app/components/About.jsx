import React from "react";

export class About extends React.Component{
	render() {
		return (
			<div className="aboutContainer">
				<img src="/images/about.png"
					 className="aboutImage" 
					 id="about" 
					 alt="about">
				</img>

				<p>
					Hey there! Thanks for stopping by my blog. My name is Max Crane and I'm a 
					software developer based in Seattle, WA.
				</p>
			</div>
		);
	}
}