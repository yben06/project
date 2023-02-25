const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = (req, res) => {
	PostModel.find((err, docs) => {
		if (!err) res.send(docs);
		else console.error(`Error to get data : ${err}`);
	}).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
	if (req.file) {
		try {
			const allowedTypes = [
				"image/jpg",
				"image/png",
				"image/jpeg",
				"image/gif",
			];
			if (!allowedTypes.includes(req.file.mimetype))
				throw Error("invalid file");

			if (req.file.size > 1000000) throw Error("max size");
		} catch (err) {
			const errors = uploadErrors(err);
			return res.status(201).json({ errors });
		}
	}

	try {
		const { posterId, message, video } = req.body;
		const { filename } = req.file || {};
		const picture =
			req.file !== null && filename !== undefined
				? `${process.env.REACT_APP_API_URL}assets/${filename}`
				: "";
		const newPost = new PostModel({
			posterId,
			message,
			picture,
			video,
			likers: [],
			comments: [],
		});

		const post = await newPost.save();
		return res.status(201).json(post);
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.updatePost = (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	const updatedRecord = {
		message: req.body.message,
	};

	PostModel.findByIdAndUpdate(
		req.params.id,
		{ $set: updatedRecord },
		{ new: true },
		(err, docs) => {
			if (!err) res.send(docs);
			else console.log(`Update error : ${err}`);
		},
	);
};

module.exports.deletePost = (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
		if (!err) res.send(docs);
		else console.log(`Delete error : ${err}`);
	});
};

module.exports.likePost = async (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		const [post, user] = await Promise.all([
			PostModel.findByIdAndUpdate(
				req.params.id,
				{
					$addToSet: { likers: req.body.id },
				},
				{ new: true },
			),
			UserModel.findByIdAndUpdate(
				req.body.id,
				{
					$addToSet: { likes: req.params.id },
				},
				{ new: true },
			),
		]);
		res.send({ post, user });
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.unlikePost = async (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		const [post, user] = await Promise.all([
			PostModel.findByIdAndUpdate(
				req.params.id,
				{
					$pull: { likers: req.body.id },
				},
				{ new: true },
			),
			UserModel.findByIdAndUpdate(
				req.body.id,
				{
					$pull: { likes: req.params.id },
				},
				{ new: true },
			),
		]);
		res.send({ post, user });
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.commentPost = (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		return PostModel.findByIdAndUpdate(
			req.params.id,
			{
				$push: {
					comments: {
						commenterId: req.body.commenterId,
						commenterPseudo: req.body.commenterPseudo,
						text: req.body.text,
						timestamp: new Date().getTime(),
					},
				},
			},
			{ new: true },
		)
			.then((data) => res.send(data))
			.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.editCommentPost = (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		return PostModel.findById(req.params.id, (err, docs) => {
			const theComment = docs.comments.find((comment) =>
				comment._id.equals(req.body.commentId),
			);

			if (!theComment) return res.status(404).send("Comment not found");
			theComment.text = req.body.text;

			return docs.save((err) => {
				if (!err) return res.status(200).send(docs);
				return res.status(500).send(err);
			});
		});
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.deleteCommentPost = (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		return PostModel.findByIdAndUpdate(
			req.params.id,
			{
				$pull: {
					comments: {
						_id: req.body.commentId,
					},
				},
			},
			{ new: true },
		)
			.then((data) => res.send(data))
			.catch((err) => res.status(500).json({ message: err }));
	} catch (err) {
		return res.status(400).send(err);
	}
};
