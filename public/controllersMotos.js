var myApp = angular.module("MotoApp",[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");

	var refresh = function (){
		$http.get('/motos/:motos.html').success(function (motos){
			console.log('Data received successfully');
			$scope.motolist = motos;
			document.getElementById("1").value="";
			document.getElementById("2").value="";
			document.getElementById("3").value="";
		});
	}

	refresh();

	$scope.addMoto = function(){
		console.log("Inserting moto ...");
		$http.post('/motos/:motos.html',$scope.motos);
		refresh();
	}

	$scope.deleteMoto = function(modelo){
		console.log("Deleting moto with "+modelo);
		$http.delete('/motos/:motos.html/'+modelo);
		refresh();
	}

}]);
