(function() {
	angular.module('healthcafe.remarks')
		.factory('Remarks', Remarks );

  Remarks.$inject = [ '$q' ];

  function Remarks($q) {
    var cache = [
        {
          id: 1,
          date: new Date( 2016, 0, 1, 10, 20, 30 ),
          message: "Started using blood pressure medicine"
        },
        {
          id: 2,
          date: new Date( 2016, 0, 9, 10, 20, 30 ),
          message: "Severe flu"
        }
    ];

    function list() {
      return $q.when(cache);
    }

    function get(id) {
      for( i = 0; i < cache.length; i++ ) {
        if( cache[i].id == id )
          return $q.when(cache[i]);
      }

      return $q.fail("Not found");
    }

    function remove(id) {
      for( i = 0; i < cache.length; i++ ) {
        if( cache[i].id == id ) {
          return $q.when(cache.splice(i,1));
        }
      }
      return $q.fail("Not found");
    }

    function create(body) {
      if( !body.id ) {
        body.id = Math.max.apply(null, cache.map(function(el) { return el.id; } ) ) + 1;
      }

      cache.push(body);

      return $q.when(body);
    }

    return {
      create: create,
      load: list,
      list: list,
      remove: remove,
      get: get,

      defaults: function() { return {
        date: new Date(),
      }; }
    }
  }

})();

