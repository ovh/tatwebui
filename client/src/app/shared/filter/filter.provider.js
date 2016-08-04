/**
 * @ngdoc service
 * @name TatUi.TatFilterProvider
 * @module TatUi
 * @description
 *
 * Manage Tat message filters
 *
 */
angular.module('TatUi')
  .provider('TatFilter', function(appConfiguration) {
    'use strict';

    var self = this;

    self.FILTERS = [
      'label',
      'andLabel',
      'notLabel',
      'tag',
      'andTag',
      'notTag',
      'text',
      'idMessage',
      'dateMinCreation',
      'dateMaxCreation',
      'dateMinUpdate',
      'dateMaxUpdate',
      'username'
    ];

    self.options = {};
    self.currentFilters = {};

    return {
      /**
       * @ngdoc function
       * @name addEvent
       * @methodOf TatUi.TatFilterProvider
       */
      $get: function($rootScope, $localStorage, $location, $stateParams) {

          self.eachFilter = function(callback) {
            for (var i = 0; i < self.FILTERS.length; i++) callback(self.FILTERS[i]);
          };

          self.containsDateFilter = function() {
            var k = ["dateMinCreation", "dateMaxCreation", "dateMinCreation", "dateMaxCreation"];
            for (var i = 0; i < k.length; i++) {
              if ($localStorage.filters[$stateParams.topic][k]) {
                return true;
              }
            }
            return false;
          };

          self.sanitize = function(f) {
            // Removes spaces & duplicate (preserve order)
            return (typeof(f) === 'undefined' || f === null) ? null : f.replace(/\s+/g, '')
              .split(',').reduce(function(p, c) {
                if (c !== '' && p.indexOf(c) < 0) p.push(c); return p;
              }, []).join(',');
          };

          self.removeFilter = function(key, value) {
            var items, index, fltr;
            fltr = self.currentFilters[$stateParams.topic][key];
            if (key == 'idMessage' || key == 'text' ||
                       key == 'dateMinCreation' || key == 'dateMaxCreation' || 
                       key == 'dateMinUpdate' || key == 'dateMaxUpdate') {
              self.currentFilters[$stateParams.topic][key] = null;
              $localStorage.filters[$stateParams.topic][key] = null;
              $location.search(key, null);
              self.search();
            } else if (fltr) {
              items = self.currentFilters[$stateParams.topic][key].split(',');
              index = items.indexOf(value);
              if (index > -1) items.splice(index, 1);
              self.currentFilters[$stateParams.topic][key] = items.join(',');
              if (self.currentFilters[$stateParams.topic][key] === '') self.currentFilters[$stateParams.topic][key] = null;
              $localStorage.filters[$stateParams.topic][key] = null;
              $location.search(key, null);
              self.search();
            }
            return self;
          };

          self.applyFilters = function() {
            var containsIdMsg = false;
            if (self.currentFilters[$stateParams.topic].idMessage) {
                containsIdMsg = true;
            }
            self.eachFilter(function(k) {
              if (k !== "idMessage") {
                $localStorage.filters[$stateParams.topic][k] = self.currentFilters[$stateParams.topic][k];
              } else {
                $localStorage.filters[$stateParams.topic][k] = null;
              }
              if (!containsIdMsg) {
                $location.search(k, self.currentFilters[$stateParams.topic][k]);
              }
            });
            return self;
          };

          self.getCurrentFilters = function() {
            if (!self.currentFilters[$stateParams.topic]) {
              self.currentFilters[$stateParams.topic] = {};
            }

            if (!$localStorage.filters) {
              $localStorage.filters = {};
            }
            if (!$localStorage.filters[$stateParams.topic]) {
              $localStorage.filters[$stateParams.topic] = {};
            }

            var search = $location.search();
            var containsIdMsg = false;
            if (search.idMessage) {
              containsIdMsg = true;
            }
            self.eachFilter(function(k) {
              // First check in query string and propagate to localstorage if necessary
              if (search[k] && search[k] !== '') {
                if (k !== "idMessage") {
                  $localStorage.filters[$stateParams.topic][k] = search[k];
                }
              }
              // Then pull filter from localstorage if they exists
              if ($localStorage.filters[$stateParams.topic][k]) {
                 if (k === "idMessage") {
                   self.currentFilters[$stateParams.topic][k] = search[k];
                 } else if (!containsIdMsg){
                   self.currentFilters[$stateParams.topic][k] = $localStorage.filters[$stateParams.topic][k];
                 }
              } else if (k === "idMessage") {
                self.currentFilters[$stateParams.topic][k] = search[k];
              }
            });
            self.applyFilters();
            return self.currentFilters[$stateParams.topic];
          };

          self.setFilter = function(k, v) {
            // Some users might include the pound sign to reference a tag
            if (k == 'tag' && v) {
              v = v.replace('#', '');
            }
            if (k !== 'text' && k !== 'idMessage' &&
            k !== "dateMinCreation" && k !== "dateMaxCreation" &&
            k !== "dateMinUpdate" && k !== "dateMaxUpdate") {
              self.currentFilters[$stateParams.topic][k] = self.sanitize(v);
            } else {
              self.currentFilters[$stateParams.topic][k] = (typeof(v) === 'string') ? v.replace(/(^\s+|\s+$)/g, ''): v;
            }
            $localStorage.filters[$stateParams.topic][k] = self.currentFilters[$stateParams.topic][k];
            $location.search(k, self.currentFilters[$stateParams.topic][k]);
            return self;
          };

          self.setFilters = function(filters) {
            self.eachFilter(function(k) {
              var fltr = filters[k];
              if (!fltr || typeof(fltr) === 'undefined' || fltr === '') {
                fltr = null;
              }
              self.setFilter(k, fltr);
            });
            return self;
          };

          self.search = function() {
            $rootScope.$broadcast('filter-changed', self.getCurrentFilters());
          };

        /**
         * @ngdoc service
         * @module TatUi
         * @name TatUi.TatFilter
         *
         * @description
         *
         * manage message filters
         *
         */
        return {
          FILTERS: self.FILTERS,
          removeFilter: self.removeFilter,
          getCurrent: self.getCurrentFilters,
          containsDateFilter: self.containsDateFilter,
          setFilters: self.setFilters,
          eachFilter: self.eachFilter,
          search: self.search
        };
      }
    };
  });
