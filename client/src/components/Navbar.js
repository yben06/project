import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";

const Navbar = () => {
	const uid = useContext(UidContext);
	const userData = useSelector((state) => state.userReducer);

	return (
		<nav>
			<div className="nav-container">
				<div className="logo">
					<Link to="/">
						<div className="logo">
							<img src="./img/phenix(1).png" alt="icon" />
							<h3 className="rac">Bleu Phoenix</h3>
						</div>
					</Link>
				</div>
				{uid ? (
					<ul>
						<li />
						<li className="welcome">
							<Link to="/profil">
								<h5 className="bien">
									Bienvenue {userData.pseudo}
									{userData.isAdmin && " (admin)"}
								</h5>
							</Link>
						</li>
						<Logout />
					</ul>
				) : (
					<ul>
						<li />
						<li>
							<Link to="/profil">
								<img src="./img/icons/login.svg" alt="login" />
							</Link>
						</li>
					</ul>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
