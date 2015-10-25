angular.module('myApp', ['ui.bootstrap'])
  .controller('UrlBuilderController', ['$scope', function($scope) {

    $scope.produce_url = function(canvas_url, tag){
      if(canvas_url && (canvas_url.indexOf('canvas.wustl.edu/calendar') != -1) ){
        return "Whoa! Something doesn't look quite right with your url! Make sure you're giving us your Canvas feed URL, and not the Canvas calendar webapp URL."
      } else if(tag && tag.indexOf(',') != -1 ){
          return "Whoa! Something doesn't look quite right with your tag! (Commas aren't allowed... are you trying to put in more than one tag?)"
      }

      if(canvas_url && tag){
        var canvas_uuid = canvas_url.slice(canvas_url.lastIndexOf('/')+1, canvas_url.indexOf('.ics'))
        var processed_tag = tag.replace(/ /g, '').replace('[', '').replace(']', '')
        return "https://wustl-caldemux.herokuapp.com/"+processed_tag+'/'+canvas_uuid
      }
    }
  }]);
