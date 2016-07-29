var mongoose = require('mongoose');
var Words = mongoose.model('Words');

module.exports = {
  getWords,
  saveWord,
  deleteWord
};

function sendJSON(res, status, json) {
  res.status(status);
  res.json(json);
}

function withWords(callback) {
  function find() {
    Words.find()
    .exec((err, doc) => {
      if (err) {
        sendjson(res, 404, err);
      } else if (!doc) {
        sendjson(res, 404, {message: 'no words saved.'})
      } else if (doc.length === 0) {
        Words.create({}, (err, doc) => {
          if (err) {
            sendjson(res, 404, err);
          } else {
            find();
          }
        });
      } else {
        callback(doc[0]);
      }
    });
  }
  find();
}

function getWords(req, res) {
  withWords((doc) => {
    sendJSON(res, 200, doc.words);
  });
}

function saveWord(req, res) {
  if (!req.body.word) {
    sendJSON(res, 400, {message: 'No word was sent in the POST body.'});
  } else {
    withWords((doc) => {
      doc.words.push(req.body.word);
      doc.save((err, words) => {
        if (err) {
          sendJSON(res, 404, err);
        } else {
          sendJSON(res, 201, words);
        }
      });
    });
  }
}

function deleteWord(req, res) {
  var index = Number(req.params.index);
  if (isNaN(index)) {
    sendJSON(res, 400, {message: `Sent invalid index in URL: ${index}`});
  } else {
    withWords((doc) => {
      doc.words.splice(index, 1);
      doc.save((err) => {
        if (err) {
          sendJSON(res, 404, err);
        } else {
          sendJSON(res, 204, null);
        }
      });
    });
  }
}
