(function(angular, window) {

	var baseUrl = 'https://api.github.com/repos/dak0rn/dak0rn.github.io/contents/articles';

	//+ base64_decode :: String -> String
	var base64_decode = function(s) {
		return window.atob( window.unescape( window.encodeURIComponent( s.replace(/\s/g, '') ) ) );
	};

	//+ formatTitle :: String -> String
	var formatTitle = function(title) {
		return title
			.replace(/^[0-9]+-/,'')
			.replace(/[_-]/g, ' ')
			.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })
			.replace(/\.md$/,'');
	};

	var site = angular.module('65535th', [
		'ngRoute',
		'ngSanitize'
	]);

	site.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

		$routeProvider
			.when('/', {
				templateUrl: 'tpl/index.html',
				controller: 'IndexCtrl'
			})
			.when('/post/:name', {
				templateUrl: 'tpl/post.html',
				controller: 'PostCtrl'
			})
			.otherwise({ redirectTo: '/' });
		
	}]);

	//+ highlighter :: () -> ()
	var highlighter = function() {
		var i;
		var node;
		var nodes = window.document.querySelectorAll('pre');

		for( i = 0; i < nodes.length; i++ ) {
			node = nodes[i];
			window.hljs.highlightBlock(node);
		}
		
	};
	
	window.document.addEventListener('DOMContentLoaded', highlighter);

	site.controller('IndexCtrl',['$scope','$http', 'LoaderService', 'TitleService', function($scope, $http, LoaderService, TitleService) {

		$scope.posts = [];

		TitleService('Index');

		LoaderService.showLoader();

		$http.get(baseUrl)
			.then(function(response) {

				response.data.reverse().forEach(function(post) {
					var o = {
						title: formatTitle(post.name),
						url: post.name.replace(/\.md$/, '')
					};

					$scope.posts.push(o);

					LoaderService.hideLoader();
				});
			});
		
	}]);

	site.controller('PostCtrl',['$scope','$http', 'LoaderService', '$routeParams','$sce', '$timeout','TitleService', function($scope, $http, LoaderService, $routeParams, $sce, $timeout, TitleService) {
		LoaderService.showLoader();
		
		$scope.title = '';
		$scope.article = '';
		$scope.permalink = '';

		TitleService('');

		$scope.deliberatelyTrustDangerousSnippet = function() {
            return $sce.trustAsHtml($scope.article);
        };

		$http.get([baseUrl, $routeParams.name + '.md'].join('/')).then(function(response) {
			LoaderService.hideLoader();

			$scope.title = formatTitle($routeParams.name);
			$scope.article = marked(base64_decode( response.data.content ));
			$scope.permalink = window.location.href;

			TitleService($scope.title);

			$timeout(highlighter, 500);
		});
		
	}]);

	site.factory('LoaderService', function() {
		return {
			hideLoader: function() {
				window.document.querySelector('#global-loader').classList.add('hidden');
			},

			showLoader: function() {
				window.document.querySelector('#global-loader').classList.remove('hidden');
			}
		};
	});

	site.factory('TitleService', function() {
		var suffix = ' - 65535th';
		var prefix = '';

		return function(title) {
			window.document.title = [prefix, title, suffix].join('');
		};
	});
	
})(window.angular, window);
