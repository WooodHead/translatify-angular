angular
  .module('translatify', [])
  .controller('translatifyCtrl', translatifyCtrl);

function lookup(dictionaries, word) {
  for (var i = 0; i < dictionaries.length; i++) {
    var dictionary = dictionaries[i];
    if (dictionary[word]) {
      return dictionary[word];
    }
  }
}

function translateText(dictionaries, text, whenNoMatch) {
  dictionaries = Array.isArray(dictionaries) ? dictionaries : [dictionaries];

  whenNoMatch = typeof whenNoMatch === 'function' ? whenNoMatch : function(word, translations) {
    translations.push(word);
  };

  var translations = [];

  for (var start = 0; start < text.length; start++) {
    var translation = null;
    for (var wordLength = Math.min(10, text.length - start); wordLength > 0; wordLength--) {
      var word = text.slice(start, start + wordLength);
      translation = lookup(dictionaries, word);
      if (translation) {
        translations.push({
          word: word,
          pronunciation: translation.pronunciation,
          meaning: translation.meaning
        });
        // (- 1) to offset the start++ at the end of the loop
        start += wordLength - 1;
        break;
      }
    }
    if (!translation) {
      whenNoMatch(text[start], translations);
    }
  }
  return translations;
}

translatifyCtrl.$inject = ['$scope'];
function translatifyCtrl($scope) {
  var rootEl = document.querySelector('#root');
  var text = rootEl.textContent;

  $scope.state = {
    text: text,
    translations: translateText(dictionaries, text),
    wordList: Object.keys(dictionaries[0]).slice(0, 2),
    rootEl: rootEl
  };

  getWords();

  $scope.removeEntry = removeEntry;
  $scope.saveTranslation = saveTranslation;
  $scope.isTranslation = isTranslation;
  $scope.isString = isString;

  // This is kind of a hack but I don't think there's a way around it.
  setTimeout(tooltipify, 1);

  function tooltipify() {
    $('.translation').tooltip()
  }

  function getWords() {
    $.ajax({
      url: '/api/words/',
      method: 'GET',
      success: function(wordList) {
        if (wordList) {
          $scope.state.wordList = wordList;
          console.log(wordList);
          $scope.$apply();
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  }

  function removeEntry(index) {
    $.ajax({
      url: '/api/words/' + index,
      method: 'delete',
      success: function() {
        $scope.state.wordList.splice(index, 1);
        $scope.$apply();
      },
      error: function(err) {
        console.log(err);
      }
    });
  }

  function saveTranslation(translation) {
    $.ajax({
      url: '/api/words/',
      method: 'POST',
      data: {word: translation.word},
      success: function(data) {
        $scope.state.wordList.push(translation.word);
        $scope.$apply();
      },
      error: function(err) {
        console.log(err);
      }
    });
  }

  function isTranslation(translation) {
    return !!(
      typeof translation === 'object' && translation.word &&
      translation.meaning && translation.pronunciation
    );
  }

  function isString(translation) {
    return typeof translation === 'string';
  }
}
