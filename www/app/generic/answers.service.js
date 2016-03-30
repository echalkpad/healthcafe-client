(function() {
	angular.module('healthcafe.generic')
		.factory('Answers', Answers );

  Answers.$inject = [ '$http', '$q', 'uuid2', 'config', '$indexedDB' ];

	function Answers($http, $q, uuid2, config, $indexedDB) {
    this.cache = null;

    function create(body) {
      var deferred = $q.defer();

      // Create the datapoint itself
      var answer = createAnswer(body);

      // Store the datapoint
      $indexedDB.openStore( 'answers', function(answerStore) {
        answerStore.insert(answer).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    function createAnswer( body ) {

      var answer = {
        date_time: new Date(),
        questionnaire: body.questionnaire,
        answers: body.answers
      }

      return answer;
    }

    function list() {
      var deferred = $q.defer();

      $indexedDB.openStore( 'answers', function(answerStore) {
        answerStore.getAll().then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    function listByQuestionnaire( questionnaire ) {
      var deferred = $q.defer();

      $indexedDB.openStore( 'answers', function(answerStore) {

        answerStore.query()

        var query = answerStore.query()
          .$index("questionnaire")
          .$eq(questionnaire);

        answerStore.findWhere(query).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    return {
      create: create,
      list: list,
      listByQuestionnaire: listByQuestionnaire
    };
  }
})();

