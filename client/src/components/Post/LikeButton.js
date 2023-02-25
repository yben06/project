import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => {
	const [liked, setLiked] = useState(false);
	const uid = useContext(UidContext);
	const dispatch = useDispatch();

	const like = () => {
		dispatch(likePost(post._id, uid));
		setLiked(true);
	};

	const unlike = () => {
		dispatch(unlikePost(post._id, uid));
		setLiked(false);
	};

	useEffect(() => {
		if (post.likers.includes(uid)) setLiked(true);
		else setLiked(false);
	}, [uid, post.likers, liked]);

	return (
		<div className="like-container">
			{uid === null && (
				<Popup
					trigger={<img src="./img/icons/heart.svg" alt="like" />}
					position={["bottom center", "bottom right", "bottom left"]}
					closeOnDocumentClick
				>
					<div>
						<p style={{ color: "black" }}>
							Connectez-vous pour aimer un post !
						</p>
					</div>
				</Popup>
			)}
			{uid && liked === false && (
				<img
					src="./img/icons/heart.svg"
					onClick={like}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							like();
						}
					}}
					alt="like"
					tabIndex="0"
				/>
			)}
			{uid && liked && (
				<img
					src="./img/icons/heart-filled.svg"
					onClick={unlike}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							unlike();
						}
					}}
					alt="unlike"
					tabIndex="0"
				/>
			)}
			<span>{post.likers.length}</span>
		</div>
	);
};

export default LikeButton;
