(function() {
	angular.module('healthcafe.remarks')
		.factory('Remarks', Remarks );

  Remarks.$inject = [ '$q', '$indexedDB' ];

  function Remarks($q, $indexedDB) {
    var cache = null;

    function load() {
      var deferred = $q.defer();

      $indexedDB.openStore( 'remarks', function(remarksStore) {
        remarksStore.getAll().then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    function list() {
      if(cache) {
        return $q.when(cache);
      }

      return load();
    }

    function get(id) {
      var deferred = $q.defer();

      $indexedDB.openStore( 'remarks', function(remarksStore) {
        remarksStore.get(id).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    function remove(id) {
      var deferred = $q.defer();

      $indexedDB.openStore( 'remarks', function(remarksStore) {
        remarksStore.delete(id).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    function create(body) {
      var deferred = $q.defer();

      // Store the remark
      $indexedDB.openStore( 'remarks', function(remarksStore) {
        remarksStore.insert(body).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    return {
      create: create,
      load: load,
      list: list,
      remove: remove,
      get: get,

      defaults: function() { return {
        date: new Date(),
      }; }
    }
  }

})();

