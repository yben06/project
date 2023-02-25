import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../actions/post.actions";
import { UidContext } from "../AppContext";

const EditDeleteComment = ({ comment, postId }) => {
	const [isAuthor, setIsAuthor] = useState(false);
	const [edit, setEdit] = useState(false);
	const [text, setText] = useState("");
	const userData = useSelector((state) => state.userReducer);
	const uid = useContext(UidContext);
	const dispatch = useDispatch();

	const handleEdit = (e) => {
		e.preventDefault();

		if (text) {
			dispatch(editComment(postId, comment._id, text));
			setText("");
			setEdit(false);
		}
	};

	const handleDelete = () => dispatch(deleteComment(postId, comment._id));

	useEffect(() => {
		const checkAuthor = () => {
			if (uid === comment.commenterId) {
				setIsAuthor(true);
			}
		};
		checkAuthor();
	}, [uid, comment.commenterId]);

	return (
		<div className="edit-comment">
			{(isAuthor || userData.isAdmin) && edit === false && (
				<span
					onClick={() => setEdit(!edit)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							setEdit(!edit);
						}
					}}
					tabIndex="0"
				>
					<img src="./img/icons/edit.svg" alt="edit-comment" />
				</span>
			)}
			{(isAuthor || userData.isAdmin) && edit && (
				<form action="" onSubmit={handleEdit} className="edit-comment-form">
					<label
						htmlFor="text"
						onClick={() => setEdit(!edit)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								setEdit(!edit);
							}
						}}
						tabIndex="0"
					>
						Editer
					</label>

					<br />
					<input
						type="text"
						name="text"
						onChange={(e) => setText(e.target.value)}
						defaultValue={comment.text}
					/>
					<br />
					<div className="btn">
						<span
							onClick={() => {
								if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
									handleDelete();
								}
							}}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									if (
										window.confirm("Voulez-vous supprimer ce commentaire ?")
									) {
										handleDelete();
									}
								}
							}}
							tabIndex="0"
						>
							<img src="./img/icons/trash.svg" alt="delete" />
						</span>
						<input type="submit" value="Valider modification" />
					</div>
				</form>
			)}
		</div>
	);
};

export default EditDeleteComment;
