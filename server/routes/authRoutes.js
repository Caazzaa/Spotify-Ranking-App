const express = require('express');
const cors = require('cors');
const { test, registerUser, loginUser, getProfile } = require('../controllers/authControllers');
const { addToList, getFromList } = require('../controllers/ratingsController');

const router = express.Router();

//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/addToList', addToList);
router.get('/profile', getProfile)
router.post('/getFromList', getFromList)

module.exports = router;