angular.module('starter.controllers', [])

.controller('AppCtrl', function() {

})

.controller('ConfiguracionCtrl', function($scope, $state, $ionicHistory, $ionicPopup) {
    $scope.formData = {};

    $scope.url = localStorage.getItem('url');

    $scope.url_fotos = localStorage.getItem('url_fotos');

    $scope.aceptar = function(formData){
        $ionicPopup.confirm({
            title: 'Mensaje de Confirmación',
            template: '¿ Está seguro que desea cambiar la url ?'
        }).then(function(res) {
            if(res) {
                localStorage.setItem('url', formData.url);
                localStorage.setItem('url_fotos', formData.url_fotos);
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

.controller('ConsultaTicketCtrl', function($scope, $rootScope, $state, $cordovaBarcodeScanner,$ionicPopup, Ticket) {

    if (localStorage.getItem('url') != null) {
        localStorage.getItem('url');
    }else{
        
        $scope.showConfirm = function() {
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<center>URL Archivo</center><input type="text" ng-model="data.url"><br><center>URL Fotos</center><input type="text" ng-model="data.url_fotos">',
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
                                localStorage.setItem('url_fotos', $scope.data.url_fotos);
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

                    $rootScope.ticket = Ticket.get({codigo: result.text});

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

            $rootScope.ticket_scanner = result;

            console.log("Barcode Format -> " + result.format);
            console.log("Cancelled -> " + result.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('ConsultaFacturaCtrl', function($scope, $rootScope, $state, $cordovaBarcodeScanner, $ionicPopup, $ionicModal, Ticket, Factura) {
    
    $scope.url = localStorage.getItem('url');

    $scope.url_fotos = localStorage.getItem('url_fotos');

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

                    $rootScope.factura = Factura.get({codigo: result.text});
                    
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

            $rootScope.factura_scanner = result;

            console.log("Barcode Format -> " + result.format);
            console.log("Cancelled -> " + result.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('ResuladosCtrl', function($scope, $rootScope, $state, $ionicHistory, $ionicModal, $ionicPopup, Asociar, Ticket, Factura) {

    $scope.url = localStorage.getItem('url');

    $scope.url_fotos = localStorage.getItem('url_fotos');

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
        Asociar.query({factura: $rootScope.factura_scanner.text, ticket: $rootScope.ticket_scanner.text}).$promise.then(function(data) {
            
            $ionicPopup.alert({ title:    'Mensaje de Exito',
                                template: 'Factura: ' + $rootScope.ticket_scanner.text + ' y Ticket: ' + $rootScope.factura_scanner.text + ' asociados correctamente.'});
            
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

.controller('ConsultaManualTicketCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicLoading, $timeout, Ticket) {
    
    $scope.formData = {};

   

    $scope.siguiente = function(formData) {

        /*$ionicLoading.show({
            template: '<ion-spinner icon="android"/>',
            content: 'Loading Data',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 500
        });*/

        //$timeout(function () {
            
            $rootScope.ticket_consulta_manual = Ticket.get({codigo: formData.number_ticket});

            Ticket.get({codigo: formData.number_ticket}).$promise.then(function(data) {

                if (data[0].VP == 0) {
                    
                    $scope.formData = {};

                    $ionicPopup.alert({ title:    'Mensaje de Error',
                                        template: 'Error Ticket es valet Parking'});
                }

                else {
                    
                    $state.go('app.consultamanualfactura');

                    $scope.formData = {};
                }
                
                //$ionicLoading.hide();
                
            }, function(error) {
                // error hand
                $ionicLoading.hide();
                console.log(error);
                $ionicPopup.alert({ title:    'Mensaje de Error',
                                    template: 'Existe un Error en el Ticket porfavor verifique el Número.'});
            });

        //},2500);
    }
})

.controller('ConsultaManualFacturaCtrl', function($scope, $rootScope,$state, $ionicPopup, $ionicModal, Factura) {
    
    $scope.url = localStorage.getItem('url');

    $scope.url_fotos = localStorage.getItem('url_fotos');

    $scope.formData = {};

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

        $rootScope.factura_consulta_manual = Factura.get({codigo: formData.number_factura});        

        Factura.get({codigo: formData.number_factura}).$promise.then(function(data) {

            if (data[0].Cod_Bar == 3000){
                
                $scope.formData = {};

                $ionicPopup.alert({ title:    'Mensaje de Error',
                                    template: 'Error La Factura no es Lote'}); 
            }

            else {

                $state.go('app.resultadomanual');

                $scope.formData = {};   
            }

            
        }, function(error) {
            // error hand
            console.log(error);
            $ionicPopup.alert({ title:    'Mensaje de Error',
                                template: 'Existe un Error en la Factura porfavor verifique el Número.'});
        });

    }
})

.controller('ResuladosManualCtrl', function($scope, $rootScope, $state, $ionicPopup, $ionicHistory, $ionicModal, Asociar) {
    
    $scope.url = localStorage.getItem('url');

    $scope.url_fotos = localStorage.getItem('url_fotos');

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
