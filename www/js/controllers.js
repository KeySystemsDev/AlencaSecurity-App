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
                alert("Consulta Cancelada\n" + "\n" +
                      "Status Cancel: " + result.cancelled);
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
                alert("Consulta Cancelada\n" + "\n" +
                      "Status Cancel: " + result.cancelled);
            }

            MyService.factura = result;

            console.log("Barcode Format -> " + result.format);
            console.log("Cancelled -> " + result.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('ResuladosCtrl', function($scope, $state, $http, $ionicHistory, MyService, Asociar, Ticket, Factura) {
    $scope.factura = MyService.factura;
    $scope.ticket = MyService.ticket;

    $scope.ticket_consulta = Ticket.get({codigo: MyService.ticket.text});

    $scope.factura_consulta = Factura.get({codigo: MyService.factura.text});

    $scope.asociar = function() {      
        $scope.asociar = Asociar.get(
                        {  factura: MyService.factura.text,
                           ticket: MyService.ticket.text
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
