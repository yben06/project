import React, { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Log = (props) => {
	const [signUpModal, setSignUpModal] = useState(props.signup);
	const [signInModal, setSignInModal] = useState(props.signin);

	const handleModals = (e) => {
		if (e.target.id === "register") {
			setSignInModal(false);
			setSignUpModal(true);
		} else if (e.target.id === "login") {
			setSignUpModal(false);
			setSignInModal(true);
		}
	};

	return (
		<div className="connection-form">
			<div className="form-container">
				<ul>
					<li
						onClick={handleModals}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handleModals();
							}
						}}
						id="register"
						className={signUpModal ? "active-btn" : null}
						tabIndex="0"
					>
						S'inscrire
					</li>
					<li
						onClick={handleModals}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handleModals();
							}
						}}
						id="login"
						className={signInModal ? "active-btn" : null}
						tabIndex="0"
					>
						Se connecter
					</li>
				</ul>
				{signUpModal && <SignUpForm />}
				{signInModal && <SignInForm />}
			</div>
		</div>
	);
};

export default Log;
