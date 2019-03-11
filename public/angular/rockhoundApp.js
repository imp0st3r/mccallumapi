angular.module('rockhoundApp', []);

var homepageCtrl = function ($scope) { 
	$scope.data = {
		logolink: '/',
		options: [{
			title: 'Identify My Rock!',
			action: '/minerals/search'
		},{
			title: 'Register',
			action: '/users/register'
		},{
			title: 'Login',
			action: '/users/login'
		}],
		navlinks: [{
			title: 'Identify My Rock!',
			action: '/minerals/search'
		},{
			title: 'Register',
			action: '/users/register'
		},{
			title: 'Login',
			action: '/users/login'
		}]
	};
};

angular
	.module('rockhoundApp')
	.controller('homepageCtrl', homepageCtrl);