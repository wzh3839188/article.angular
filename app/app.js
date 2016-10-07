'use strict';

// Declare app level module which depends on views, and components
angular.module('wzArticle', [
  'ngRoute',
  // 'myApp.view1',
  // 'myApp.view2',
  'wzArticle.version',
  'wzArticle.article'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
  $locationProvider.hashPrefix('!');

  // $routeProvider.otherwise({redirectTo: '/view1'});
}])

.controller('indexController', ["$scope","$http","$rootScope","$location",function($scope, $http, $rootScope, $location) {

  // console.log($location.search().siteType);
  $rootScope.curSiteType = $location.search().siteType;

  function showSiteInfo(index){
    for(var key in $rootScope.sites){
        var site = $rootScope.sites[key];
        // console.log(site + key);
        if(key == index){
          $('#site' + key).addClass('active');
          $rootScope.curSiteType = site.siteType;
        }else{
          $('#site' + key).removeClass('active');
        }

    }
    // window.location.href = "http://localhost:8000/index#!/articleList";
    // console.log(index);
    // $rootScope.curSiteType = siteType;
    // window.location.href = "http://localhost:8000/index#!/articleList";
  }

  $http({
    method:"GET",
    url:"http://localhost:8080/article/sites"
  }).then(
    function successHandler(response){
      console.log(response);
      var data = response.data;
      if(data.errorCode == 0){
        $rootScope.sites = data.result;
        $rootScope.showSiteInfo = showSiteInfo;
        if($rootScope.curSiteType == null){
            $rootScope.curSiteType = "";
        }
        // console.log($scope.sites);
      }
    },
    function failHandler(response){
      console.log(response);
    }
  );
}])
;
