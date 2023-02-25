import axios from "axios";

export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";

export const GET_USER_ERRORS = "GET_USER_ERRORS";

export const getUser = (uid) => {
	return async (dispatch) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}api/user/${uid}`,
			);
			dispatch({ type: GET_USER, payload: res.data });
		} catch (err) {
			return console.error(err);
		}
	};
};

export const uploadPicture = (data, id) => async (dispatch) => {
	try {
		const res = await axios.patch(
			`${process.env.REACT_APP_API_URL}api/file/upload`,
			data,
		);
		const { errors } = res.data;
		if (errors) {
			dispatch({ type: GET_USER_ERRORS, payload: errors });
		} else {
			dispatch({ type: GET_USER_ERRORS, payload: "" });
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}api/user/${id}`,
			);
			const { picture } = res.data;
			dispatch({ type: UPLOAD_PICTURE, payload: picture });
		}
	} catch (err) {
		console.error(err);
	}
};

export const updateBio = (userId, bio) => {
	return async (dispatch) => {
		try {
			await axios({
				method: "put",
				url: `${process.env.REACT_APP_API_URL}api/user/${userId}`,
				data: { bio },
			});
			dispatch({ type: UPDATE_BIO, payload: bio });
		} catch (err) {
			return console.error(err);
		}
	};
};

export const followUser = (followerId, idToFollow) => {
	return async (dispatch) => {
		try {
			await axios({
				method: "patch",
				url: `${process.env.REACT_APP_API_URL}api/user/follow/${followerId}`,
				data: { idToFollow },
			});
			dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
		} catch (err) {
			return console.error(err);
		}
	};
};

export const unfollowUser = (followerId, idToUnfollow) => {
	return async (dispatch) => {
		try {
			await axios({
				method: "patch",
				url: `${process.env.REACT_APP_API_URL}api/user/unfollow/${followerId}`,
				data: { idToUnfollow },
			});
			dispatch({ type: UNFOLLOW_USER, payload: { idToUnfollow } });
		} catch (err) {
			return console.error(err);
		}
	};
};
