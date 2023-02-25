const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
	try {
		const allowedTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];
		if (!allowedTypes.includes(req.file.mimetype)) throw Error("invalid file");

		if (req.file.size > 1000000) throw Error("max size");
	} catch (err) {
		const errors = uploadErrors(err);
		return res.status(201).json({ errors });
	}

	try {
		const { filename } = req.file;
		const updatedUser = await UserModel.findByIdAndUpdate(
			req.body.userId,
			{
				$set: { picture: `${process.env.REACT_APP_API_URL}assets/${filename}` },
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		);
		return res.status(200).json({ user: updatedUser });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
