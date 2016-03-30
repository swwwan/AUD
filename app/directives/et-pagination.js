angular.module('app').directive('etPagination', etPagination);

function etPagination() {
  return {
    templateUrl: 'directives/pagination.tpl.html',
    scope: {
      pagecurrent: '=pagecurrent',
      count: '=count',
      filterpage: '&filterpage',
      limit: '@limit'
    }

  }

}
