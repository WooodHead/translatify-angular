var express = require('express');
var wordsCtrl = require('../controllers/words-ctrl');
var router = express.Router();

router.get('/words', wordsCtrl.getWords);
router.post('/words', wordsCtrl.saveWord);
router.delete('/words/:index', wordsCtrl.deleteWord);

module.exports = router;
