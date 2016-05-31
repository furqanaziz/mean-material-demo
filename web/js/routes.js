angular.module('appRoutes', ['ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider

            .when('/users', {
              templateUrl: '/views/users/list.html',
              controller: 'userListCtrl',
              resolve: {
                $data: function (apiHelper, $route) {
                  return apiHelper.getData('users');
                }
              }
            })

            .when('/users/add', {
              templateUrl: '/views/users/add.html',
              controller: 'userAddCtrl'
            })

            .when('/users/edit/:user_id', {
              templateUrl: '/views/users/edit.html',
              controller: 'userEditCtrl',
              resolve: {
                $data: function (apiHelper, $route) {
                  return apiHelper.getData('users/' + $route.current.params.user_id);
                }
              }
            })

            .otherwise({
              redirectTo: '/users'
            });

    //$locationProvider.html5Mode(true);

  }]);