angular.module('myApp', ['ui.bootstrap'])
  .controller('UrlBuilderController', ['$scope', function($scope) {

    $scope.produce_url = function(canvas_url, tag){
      if(canvas_url && tag){
        if(tag.indexOf(',') != -1 ){
          return "Whoa! Something doesn't look quite right with your tag! (Commas aren't allowed... are you trying to put in more than one tag?)"
        }

        var canvas_uuid = canvas_url.slice(canvas_url.lastIndexOf('/')+1, canvas_url.indexOf('.ics'))
        var processed_tag = tag.replace(/ /g, '').replace('[', '').replace(']', '')
        return "https://wustl-caldemux.herokuapp.com/"+processed_tag+'/'+canvas_uuid
      }
  }
  }]);
