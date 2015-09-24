angular.module('myApp', ['ui.bootstrap'])
  .controller('ExampleController', ['$scope', function($scope) {

    $scope.produce_url = function(canvas_url, tag){
      if(canvas_url && tag){
        var canvas_uuid = canvas_url.slice(canvas_url.lastIndexOf('/')+1, canvas_url.indexOf('.ics'))
        var processed_tag = tag.replace(/ /g, '').replace('[', '').replace(']', '')
        return "https://wustl-caldemux.herokuapp.com/"+processed_tag+'/'+canvas_uuid
      }
  }

    // $scope.canvas_uuid = url.slice(url.lastIndexOf('/'),url.indexOf('.ics'))

  }]);
