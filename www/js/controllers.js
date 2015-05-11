angular.module('starter.controllers', [])

.controller('AppCtrl', function() {

})

.controller('ConsultaTicketCtrl', function($scope, $state, $cordovaBarcodeScanner, MyService) {

    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(result) {
            
            if (result.cancelled == false){
                $state.go('app.consultafactura');
            }

            if (result.cancelled == true){
                alert("Rultado de la consulta\n" + "\n" +
                      "Cancel" + result.cancelled);
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
        
            if (result.cancelled == false){
                $state.go('app.resultado');
            }

            if (result.cancelled == true){
                alert("Rultado de la consulta\n" + "\n" +
                      "Cancel" + result.cancelled);
            }

            MyService.factura = result;

            console.log("Barcode Format -> " + result.format);
            console.log("Cancelled -> " + result.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('ResuladosCtrl', function($scope, $state, $http, $ionicHistory, MyService, enviar) {
    $scope.factura = MyService.factura;
    $scope.ticket = MyService.ticket;

    $scope.enviar = function() {      
        $scope.enviar = enviar.get(
                        {  i_ticket: MyService.ticket.text, 
                           i_factura: MyService.factura.text
                        });

        alert("Información Enviada: \n" + "\n" +
              "Número Ticket: " + MyService.ticket.text + "\n" + "\n" +
              "Número Factura: " + MyService.factura.text + "\n");

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.consultaticket');
    }
});
