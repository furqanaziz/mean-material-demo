var usersCtrls = angular.module('usersCtrls', []);
usersCtrls.value('timers', []);

//*** List All Users Controller ***//
usersCtrls.controller('userListCtrl', ['$scope', '$mdDialog', 'apiHelper', '$data', 'timers', function ($scope, $mdDialog, apiHelper, $data, timers) {
    $scope.users = $data.data;

    //Deletion Timer Triggers
    angular.forEach($scope.users, function (value, key) {
      clearTimeout(timers[value.user_id]);
      created = new Date();
      expired = new Date(value.expire_at);
      timers[value.user_id] = setTimeout(function () {
        apiHelper.deleteElement($scope.users, 'user_id', value.user_id);
        $scope.$apply();
      }, expired - created);
    });

    //Delete Function
    $scope.delete = function (ev, $user_id) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
              .parent(angular.element(document.body))
              .title('Would you like to delete this user?')
              .content('All of details for this user will be gone.')
              .ariaLabel('Delete')
              .ok('Please do it!')
              .cancel('Cancel')
              .targetEvent(ev);
      $mdDialog.show(confirm).then(function () {
        apiHelper.http('DELETE', '/users/' + $user_id, {}, '#/users').then(function (resp) {
          apiHelper.deleteElement($scope.users, 'user_id', $user_id);
        });
      });
    };
  }]);

//*** Add a New User Modal Controller ***//
usersCtrls.controller('userAddCtrl', ['$scope', '$mdDialog', 'apiHelper', function ($scope, $mdDialog, apiHelper) {
    $scope.user = {};
    $scope.save = function () {
      apiHelper.http('PUT', '/users/', $scope.user, '#/users');
    };
  }]);

//*** Edit an existing User Modal Controller ***//
usersCtrls.controller('userEditCtrl', ['$scope', '$mdDialog', 'apiHelper', '$data', function ($scope, $mdDialog, apiHelper, $data) {
    $scope.user = $data.data[0];
    $scope.save = function () {
      apiHelper.http('POST', '/users/', $scope.user, '#/users');
    };
  }]);