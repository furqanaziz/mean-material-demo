angular.module('dateHelper', []).filter('fromNow', function () {
  return function (value) {
    if (value == null)
      return 'Long Time Ago';
    else {
      value = moment.utc(value).format('YYYY-MM-DD HH:mm:ss');
      value = moment.utc(value).toDate();
      value = moment(value).fromNow();
      return value;
    }
  }
}); //From now date filter