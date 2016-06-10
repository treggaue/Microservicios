var myApp = angular.module("CocheApp",[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");

	var refresh = function (){
		$http.get('/coches/:coches.html').success(function (coches){
			console.log('Data received successfully');
			$scope.cochelist = coches;
			document.getElementById("1").value="";
			document.getElementById("2").value="";
			document.getElementById("3").value="";
		});
	}

	refresh();

	$scope.addCoche = function(){
		console.log("Inserting coche ...");
		$http.post('/coches/:coches.html',$scope.coches);
		refresh();
	}

	$scope.deleteCoche = function(modelo){
		console.log("Deleting coche with "+modelo);
		$http.delete('/coches/:coches.html/'+modelo);
		refresh();
	}

}]);
