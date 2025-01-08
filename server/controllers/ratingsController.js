const User = require('../models/user')
const Rating = require('../models/ratings')

const addToList = async (req, res) => {
    try {
        console.log(req.album);
        const { album, userId, review = null, rating = null } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                error: 'User not found'
            });
        }
        const newRating = await Rating.create({
            userID: userId,
            albumID: album,
            review,
            rating
        });

        return res.json(newRating);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addToList,
};
