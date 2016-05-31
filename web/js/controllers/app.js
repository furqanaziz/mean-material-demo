var appCtrls = angular.module('appCtrls', []);

//*** List All Users Controller ***//
appCtrls.controller('AppCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdDialog', function ($scope, $mdBottomSheet, $mdSidenav, $mdDialog) {

    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.menu = [
      {
        link: '#/',
        title: 'Users',
        icon: 'group'
      }
    ];

  }]);