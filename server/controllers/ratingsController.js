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

const getFromList = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId);
        const list = await Rating.find({ userID: userId }).select('_id userID albumID review rating');
        if (!list || list.length === 0) {
            return res.json({
                error: 'No albums found'
            });
        }
        return res.json(list);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addToList,
    getFromList
};
