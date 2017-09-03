'use strict'

var app = angular.module("app", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/technologies', {
		templateUrl: '../views/technologies-view.html',
		controller: 'technologyController'
	}).when('/repo/:technology', {
		templateUrl: '/views/repo-view.html'
	}).when('/users/:userid', {
		templateUrl: '/views/user-profile-view.html'
	}).otherwise({
		redirectTo: '/technologies'
	});
}]);

app.controller('rootController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	$scope.technologies = null;
	$http.get('../data/technologies.json').then(function(response) {
		$scope.technologies = response.data;
		$rootScope.technologies = response.data;
		console.log(response.data);
	}, function(error) {
		console.log("Failed to retrieve data");
	});
}]);

app.controller('technologyController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
	$scope.technologies = $rootScope.technologies;
	$scope.go = function(data) {
		$location.path('repo/' + data);
	}
}]);

app.controller('repoController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
	$scope.technology = $routeParams.technology;
	$scope.data = null;
	$http.get('https://api.github.com/search/repositories?q=' + $scope.technology).then(function(response) {
		$scope.data = response.data;
		var items = response.data.items;
		$scope.data.items = items.splice(0, 9);
		console.log(response.data);
	}, function(error) {
		console.log("Failed to retrieve data");
	});
	$scope.go = function(data) {
		$location.path('users/' + data);
	}
}]);

app.controller('userController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
	$scope.userid = $routeParams.userid;
	$scope.data = null;
	$http.get('https://api.github.com/search/users?q=' + $scope.userid).then(function(response) {
		$scope.data = response.data.items[0];
		console.log($scope.data);
	}, function(error) {
		console.log("Failed to retrieve data");
	});
}]);