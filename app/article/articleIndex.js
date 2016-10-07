'use strict';

angular.module('wzArticle.article', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/articleList', {
    templateUrl: 'article/articleList.html',
    controller: 'articleListController'
  });
}])

.controller('articleListController', ["$scope","$http","$rootScope","$location",function($scope, $http, $rootScope, $location) {
  // console.log($rootScope.curSiteType);
  // console.log($location.search().siteType);
  function showKeyword(index){
    for(var key in $scope.keywords){
        var keyword = $scope.keywords[key];
        // console.log(site + key);
        if(key == index){
          $('#keyword' + key).addClass('active');
          $scope.curKeyword = keyword.keyword;
        }else{
          $('#keyword' + key).removeClass('active');
        }

    }
    getArticles(1);
  }

  function getArticles(toPage){
    if(toPage <= 0) return;
    if($scope.pageModel != null && toPage > $scope.pageModel.totalPage) return;
    $scope.curPage = toPage;
    $http({
      method:"GET",
      url:"http://localhost:8080/article/articleBySiteAndKeyword?siteType=" + $rootScope.curSiteType + "&keyword=" + $scope.curKeyword + "&page=" + $scope.curPage
    }).then(
      function successHandler(response){
        // console.log(response);
        var data = response.data;
        if(data.errorCode == 0){
          $scope.articleModel = data.result;
          //获取了文章，需要初始化分页控件
          refreshPagination();
        }
      },
      function failHandler(response){
        console.log(response);
      }
    );
  }
  $scope.showKeyword = showKeyword;
  $scope.getArticles = getArticles;

  function showArticle(article){
    //打开新的窗口
    window.open(article.articleUrl);
  }

  function showAuthor(article){
    //打开作者
    window.open(article.articleAuthorUrl);
  }

  function refreshPagination(){
    var total = $scope.articleModel.totalCount;
    var page = $scope.articleModel.page;
    var pageSize = $scope.articleModel.pageSize;
    var totalPage = Math.ceil(Number(total) / Number(pageSize));

    var pageModel = {
      leftEnable:true,
      rightEnable:true,
      curPage:page,
      totalPage:totalPage,
      pages:[]
    };
    if(page == 1) pageModel.leftEnable = false;
    if(page == totalPage) pageModel.rightEnable = false;
    console.log(pageModel);
    if(totalPage < 11){
      for(var i = 1;i <= totalPage;i++){
        pageModel.pages[i - 1] = i;
      }
    }else{
      var leftNumber = 4;
      var rightNumber = 4;
      //计算左边的个数
      var left = page - leftNumber;
      if(left <= 0){
        leftNumber += left - 1;
        rightNumber -= left - 1;
      }
      //计算右边的个数
      var right = page + rightNumber;
      if(right > totalPage){
        rightNumber = totalPage - page;
      }
      var gap = rightNumber + 1 + leftNumber;
      var start = page - leftNumber;
      for(var i = 0;i < gap;i++){
        pageModel.pages.push(start + i);
      }
    }

    // console.log(pageModel);
    $scope.pageModel = pageModel;
  }

  $http({
    method:"GET",
    url:"http://localhost:8080/article/siteKeyword?siteType=" + $location.search().siteType
  }).then(
    function successHandler(response){
      // console.log(response);
      var data = response.data;
      if(data.errorCode == 0){
        $scope.keywords = data.result;
        $scope.showArticle = showArticle;
        $scope.showAuthor = showAuthor;
      }
    },
    function failHandler(response){
      console.log(response);
    }
  );
}]);
