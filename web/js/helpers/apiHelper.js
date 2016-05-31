angular.module('apiHelper', []).factory('apiHelper', ['$mdToast', '$http', '$q', '$timeout', '$window', function ($mdToast, $http, $q, $timeout, $window) {
    var apiHelper = {};

    apiHelper.empty = function () {

    }

    apiHelper.success = function (resp, next) {
      if (resp.hasOwnProperty('error')) {
        apiHelper.showToast('Error: ' + resp.data.error);
      } else {
        apiHelper.showToast(resp.data.success);
        apiHelper.redirect(next);
      }
    }

    apiHelper.error = function (data, textStatus, headers, conf) {
      if (textStatus == 404) {
        apiHelper.redirect('#/four_zero_four'); //Page Not Found
        apiHelper.showToast("404 - Page Not Found! ");
      } else {
        apiHelper.showToast("System Error! Please Try again Later"); // Other system error 
      }
    }

    apiHelper.http = function (method, url, data, next) {
      req = $http({
        method: method,
        url: url,
        data: data,
      });
      req.then(function (resp) {
        apiHelper.success(resp, next)
      }, apiHelper.error);
      return req;
    }

    apiHelper.getData = function ($url) {
      var promise = $http({
        method: 'GET',
        url: '/' + $url
      });
      promise.success(function (data, status, headers, conf) {
        return data;
      });
      promise.error(apiHelper.error);
      return promise;
    }

    apiHelper.showToast = function ($content) {
      $mdToast.show(
              $mdToast.simple()
              .content($content)
              .position("top right")
              .hideDelay(3000)
              );
    }

    apiHelper.redirect = function ($url) {
      $window.location.href = $url;
    }

    apiHelper.deleteElement = function ($arr, $ind, $val) {
      $arr.splice(_.findIndex($arr, function (o) {
        return o[$ind] == $val;
      }), 1);
      return $arr;
    }

    return apiHelper;
  }]);