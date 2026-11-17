const express = require('express');
const router = express.Router();
const { getCelebrityLooks, createCelebrityLook } = require('../controllers/celebrityController');

router.get('/', getCelebrityLooks);
router.post('/', createCelebrityLook);

module.exports = router;