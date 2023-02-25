import React from "react";
import { Link } from "react-router-dom";

const LeftNav = () => {
	return (
		<div className="left-nav-container">
			<div className="icons">
				<div className="icons-bis">
					<Link to="/" activeclassname="active-left-nav">
						<img src="./img/icons/home.svg" alt="home" />
					</Link>
					<br />
					<Link to="/trending" activeclassname="active-left-nav">
						<img src="./img/icons/rocket.svg" alt="trending" />
					</Link>
					<br />
					<Link to="/profil" activeclassname="active-left-nav">
						<img src="./img/icons/user.svg" alt="profil" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LeftNav;
