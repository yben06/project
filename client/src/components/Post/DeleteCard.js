import React from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/post.actions";

const DeleteCard = (props) => {
	const dispatch = useDispatch();

	const deleteQuote = () => dispatch(deletePost(props.id));

	return (
		<div
			className="delete1"
			onClick={() => {
				if (window.confirm("Voulez-vous supprimer cet article ?")) {
					deleteQuote();
				}
			}}
			onKeyDown={(event) => {
				if (event.key === "Enter") {
					if (window.confirm("Voulez-vous supprimer cet article ?")) {
						deleteQuote();
					}
				}
			}}
			tabIndex="0"
		>
			<img className="delete" src="./img/icons/trash.svg" alt="trash" />
		</div>
	);
};

export default DeleteCard;
