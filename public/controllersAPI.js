var myApp = angular.module("ListasVehiculosAPI",[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");

	var refreshCoches = function (){
		$http.get('/coches/:coches.html').success(function (coches){
			console.log('Data received successfully');
			$scope.cochelist = coches;
			document.getElementById("1").value="";
			document.getElementById("2").value="";
			document.getElementById("3").value="";
		});
	}

	refreshCoches();

	$scope.addCoche = function(){
		console.log("Inserting coche ...");
		$http.post('/coches/:coches.html',$scope.coches);
		refreshCoches();
	}

	$scope.deleteCoche = function(modelo){
		console.log("Deleting coche with "+modelo);
		$http.delete('/coches/:coches.html/'+modelo);
		refreshCoches();
	}


	var refreshMoto = function (){
		$http.get('/motos/:motos.html').success(function (motos){
			console.log('Data received successfully');
			$scope.motolist = motos;
			document.getElementById("4").value="";
			document.getElementById("5").value="";
			document.getElementById("6").value="";
		});
	}

	refreshMoto();

	$scope.addMoto = function(){
		console.log("Inserting moto ...");
		$http.post('/motos/:motos.html',$scope.motos);
		refreshMoto();
	}

	$scope.deleteMoto = function(modelo){
		console.log("Deleting moto with "+modelo);
		$http.delete('/motos/:motos.html/'+modelo);
		refreshMoto();
	}

}]);

