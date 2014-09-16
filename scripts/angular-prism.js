angular.module('blog')
.directive('prism', function(){
  return {
    restrict: 'C',
    link: function($scope, element){
      Prism.highlightElement(element[0]);
    }
  }
})