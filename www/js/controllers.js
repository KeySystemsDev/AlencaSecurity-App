angular.module('starter.controllers', [])

.controller('AppCtrl', function() {

})

.controller('ConfiguracionCtrl', function($scope, $state, $ionicHistory, $ionicPopup) {
    $scope.formData = {};

    $scope.url = localStorage.getItem('url');

    $scope.aceptar = function(formData){
        $ionicPopup.confirm({
            title: 'Mensaje de Confirmación',
            template: '¿ Está seguro que desea cambiar la url ?'
        }).then(function(res) {
            if(res) {
                localStorage.setItem('url', formData.url);
                $state.go('app.consultaticket');
                $ionicHistory.nextViewOptions({
                        disableBack: true
                });
                document.location.reload();
            } else {
                console.log('Cancelado');
                $scope.formData = {};
            }
        });   
    }
})

.controller('ConsultaTicketCtrl', function($scope, $state, $cordovaBarcodeScanner,$ionicPopup, Ticket, MyService) {

    if (localStorage.getItem('url') != null) {
        localStorage.getItem('url');
    }else{
        
        $scope.showConfirm = function() {
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.url">',
                title: 'Configuración URL',
                subTitle: 'Ingrese la URL correspondiente.',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                        {
                            text: '<b>Guardar</b>',
                            type: 'button-positive',
                        
                            onTap: function() {
                                if (!$scope.data.url) {
                                console.log('cancel');
                                console.log($scope.data.url);
                            } else {
                                console.log('guardar')
                                console.log($scope.data.url);
                                localStorage.setItem('url', $scope.data.url);
                                document.location.reload();
                                return $scope.data.url;
                                }
                            }
                        }
                    ]
          });
 
         };

        $scope.showConfirm();
        
 }
    

    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(result) {
            
            if (result.cancelled == false){
                
                Ticket.get({codigo: result.text}).$promise.then(function(data) {
            
                    $state.go('app.consultafactura');

                }, function(error) {
                    // error hand
                    console.log(error);
                    $ionicPopup.alert({ title:    'Mensaje de Error',
                                        template: 'Existe un Error en el Ticket porfavor verifique el Número.'});
                });
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

.controller('ConsultaFacturaCtrl', function($scope, $state, $cordovaBarcodeScanner, $ionicPopup, $ionicModal, Ticket, Factura, MyService) {
    
    $scope.ticket = Ticket.get({codigo: MyService.ticket.text});

    $ionicModal.fromTemplateUrl('templates/modal-img.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modalDragStart = { active: true, value: 0 }
    })

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        return $scope.modal.hide();
    };

    $scope.scanBarcode = function() {
        
        $cordovaBarcodeScanner.scan().then(function(result) {
        
            if (result.cancelled == false){
                
                Factura.get({codigo: result.text}).$promise.then(function(data) {

                    $state.go('app.resultado');
                    
                }, function(error) {
                    // error hand
                    console.log(error);
                    $ionicPopup.alert({ title:    'Mensaje de Error',
                                        template: 'Existe un Error en la Factura porfavor verifique el Número.'});
                });
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

.controller('ResuladosCtrl', function($scope, $state, $ionicHistory, $ionicModal, $ionicPopup, MyService, Asociar, Ticket, Factura) {

    $scope.factura_scanner = MyService.factura;
    $scope.ticket_scanner = MyService.ticket;

    $scope.ticket = Ticket.get({codigo: MyService.ticket.text});

    $scope.factura = Factura.get({codigo: MyService.factura.text});

    $ionicModal.fromTemplateUrl('templates/modal-img.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modalDragStart = { active: true, value: 0 }
    })

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        return $scope.modal.hide();
    };

    $scope.asociar = function() {      
        Asociar.query({factura: MyService.factura.text, ticket: MyService.ticket.text}).$promise.then(function(data) {
            
            $ionicPopup.alert({ title:    'Mensaje de Exito',
                                template: 'Factura: ' + MyService.ticket.text + ' y Ticket: ' + MyService.factura.text + ' asociados correctamente.'});
            
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            
            $state.go('app.consultaticket');
            
        }, function(error) {
            // error hand
            console.log(error);
            $ionicPopup.alert({ title:    'Mensaje de Error',
                                template: 'Ocurrio un error al sociar porfavor vuelva a intentarlo.'});
        });        
    }
})

.controller('ConsultaManualTicketCtrl', function($scope, $state, $ionicPopup, Ticket, MyService) {
    
    $scope.formData = {};

    $scope.siguiente = function(formData) {

        MyService.ticket_consulta_manual = Ticket.get({codigo: formData.number_ticket});

        Ticket.get({codigo: formData.number_ticket}).$promise.then(function(data) {
            
            $state.go('app.consultamanualfactura');

            $scope.formData = {};
    
        }, function(error) {
            // error hand
            console.log(error);
            $ionicPopup.alert({ title:    'Mensaje de Error',
                                template: 'Existe un Error en el Ticket porfavor verifique el Número.'});
        });

    }
})

.controller('ConsultaManualFacturaCtrl', function($scope, $state, $ionicPopup, $ionicModal, Factura, MyService) {
    
    $scope.formData = {};

    $scope.ticket_consulta_manual = MyService.ticket_consulta_manual;

    $ionicModal.fromTemplateUrl('templates/modal-img-manual.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modalDragStart = { active: true, value: 0 }
    })

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        return $scope.modal.hide();
    };

    $scope.siguiente = function(formData) {

        MyService.factura_consulta_manual = Factura.get({codigo: formData.number_factura});        

        Factura.get({codigo: formData.number_factura}).$promise.then(function(data) {
            
            $state.go('app.resultadomanual');

            $scope.formData = {};
            
        }, function(error) {
            // error hand
            console.log(error);
            $ionicPopup.alert({ title:    'Mensaje de Error',
                                template: 'Existe un Error en la Factura porfavor verifique el Número.'});
        });

    }
})

.controller('ResuladosManualCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $ionicModal, MyService, Asociar) {
    
    $scope.ticket_consulta_manual = MyService.ticket_consulta_manual;

    $scope.factura_consulta_manual = MyService.factura_consulta_manual;

    $ionicModal.fromTemplateUrl('templates/modal-img-manual.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modalDragStart = { active: true, value: 0 }
    })

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        return $scope.modal.hide();
    };

    $scope.asociar = function( consulta_factura , consulta_ticket) {      

        Asociar.query({factura: consulta_factura, ticket: consulta_ticket}).$promise.then(function(data) {
            
            $ionicPopup.alert({ title:    'Mensaje',
                                template: 'La Asociación se realizo correctamente.'});

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go('app.consultaticket');
            
        }, function(error) {
            // error hand
            console.log(error);
            $ionicPopup.alert({ title:    'Mensaje de Error',
                                template: 'Ocurrio un Error al Asociar porfavor vuelva a intentarlo.'});
        });        
    }

});
