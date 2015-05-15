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
        $scope.asociar = Asociar.query(
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
})

.controller('ConsultaManualCtrl', function($scope, $state, Ticket , Factura, MyService) {
    
    $scope.siguiente = function(formData) {

        MyService.ticket_consulta_manual = Ticket.get({codigo: formData.number_ticket});
        MyService.factura_consulta_manual = Factura.get({codigo: formData.number_factura});

        $state.go('app.resultadomanual');
    }
})

.controller('ResuladosManualCtrl', function($scope, $state, $ionicHistory, MyService, Asociar) {
    
    $scope.ticket_consulta = MyService.ticket_consulta_manual;

    $scope.factura_consulta = MyService.factura_consulta_manual;

    $scope.asociar = function( consulta_factura , consulta_ticket) {      

        $scope.asociar = Asociar.query({factura: consulta_factura, ticket: consulta_ticket});

        alert("Información Enviada: \n" + "\n" +
              "Número Ticket: " + consulta_ticket + "\n" + "\n" +
              "Número Factura: " + consulta_factura + "\n");

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        angular.element('#id_ticket').val('');
        angular.element('#id_factura').val('');

        $state.go('app.consultaticket');
    }
});
