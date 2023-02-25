const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
	const users = await UserModel.find().select("-password");
	res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	UserModel.findById(req.params.id, (err, docs) => {
		if (!err) res.send(docs);
		else console.log(`ID unknown : ${err}`);
	}).select("-password");
};

module.exports.updateUser = async (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		await UserModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					bio: req.body.bio,
				},
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		)
			.then((data) => res.send(data))
			.catch((err) => res.status(500).send({ message: err }));
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

module.exports.deleteUser = async (req, res) => {
	if (!ObjectID.isValid(req.params.id))
		return res.status(400).send(`ID unknown : ${req.params.id}`);

	try {
		await UserModel.remove({ _id: req.params.id }).exec();
		res.status(200).json({ message: "Successfully deleted. " });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

module.exports.follow = async (req, res) => {
	const { id } = req.params;
	const { idToFollow } = req.body;

	if (!(ObjectID.isValid(id) || ObjectID.isValid(idToFollow))) {
		return res.status(400).send(`ID unknown: ${id}`);
	}

	try {
		const [user1, user2] = await Promise.all([
			UserModel.findByIdAndUpdate(
				id,
				{ $addToSet: { following: idToFollow } },
				{ new: true, upsert: true },
			),
			UserModel.findByIdAndUpdate(
				idToFollow,
				{ $addToSet: { followers: id } },
				{ new: true, upsert: true },
			),
		]);

		return res.send({ user1, user2 });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

module.exports.unfollow = async (req, res) => {
	const { id } = req.params;
	const { idToUnfollow } = req.body;

	if (!(ObjectID.isValid(id) || ObjectID.isValid(idToUnfollow))) {
		return res.status(400).send(`ID unknown: ${id}`);
	}

	try {
		const [user1, user2] = await Promise.all([
			UserModel.findByIdAndUpdate(
				id,
				{ $pull: { following: idToUnfollow } },
				{ new: true, upsert: true },
			),
			UserModel.findByIdAndUpdate(
				idToUnfollow,
				{ $pull: { followers: id } },
				{ new: true, upsert: true },
			),
		]);

		return res.send({ user1, user2 });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
