angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ConsultaTicketCtrl', function($scope, $state, $cordovaBarcodeScanner, MyService) {

    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(result) {
            
           alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);

            if (result.cancelled == false){
                $state.go('app.consultafactura');
            } 

            MyService.ticket = result;

            console.log("Barcode Format -> " + result.format);
            console.log("Cancelled -> " + result.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('ConsultaFacturaCtrl', function($scope, $state, $cordovaBarcodeScanner, MyService) {
    $scope.ticket = MyService.ticket;

    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(result) {
            
           alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);

            if (result.cancelled == false){
                $state.go('app.resultado');
            } 

            MyService.factura = result;

            console.log("Barcode Format -> " + result.format);
            console.log("Cancelled -> " + result.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('ResuladosCtrl', function($scope, $state, $http, MyService) {
    $scope.factura = MyService.factura;
    $scope.ticket = MyService.ticket;

    $scope.enviar = function(){
        $http.get("http://keypanelservices.com/qr/qr.php", {i_ticket: $scope.ticket , i_factura: $scope.factura});
            enviar.success(function(respuesta){
            console.log(respuesta);
        })
    };
});
