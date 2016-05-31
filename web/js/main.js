var app = angular.module('webApp', [
  'apiHelper', 'dateHelper', //Helper Modules
  'ngRoute', 'appRoutes', //Routing Modules
  'ngMaterial', 'ngMessages', 'ngMdIcons', 'appTheme', //Theme Related Modules
  'usersCtrls','appCtrls' //Controllers
]);