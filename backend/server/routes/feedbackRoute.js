const express = require('express')
const feedbackController = require('../app/controllers/feedbackController');
const router = express.Router();


router.patch('/:id', feedbackController.makeAsRead)
router.get('/', feedbackController.getAllFeedback)
router.post('/', feedbackController.addNewFeedback)

module.exports = router