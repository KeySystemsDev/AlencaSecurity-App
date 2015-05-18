// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','ngCordova','ngResource'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.acerca', {
    url: "/acerca",
    views: {
      'menuContent': {
        templateUrl: "templates/acerca.html"
      }
    }
  })

  .state('app.ayuda', {
    url: "/ayuda",
    views: {
      'menuContent': {
        templateUrl: "templates/ayuda.html"
      }
    }
  })

  .state('app.configuracion', {
    url: "/configuracion",
    views: {
      'menuContent': {
        templateUrl: "templates/configuracion.html",
        controller: 'ConfiguracionCtrl'
      }
    }
  })

  .state('app.consultamanualticket', {
    url: "/consulta-manual-ticket",
    views: {
      'menuContent': {
        templateUrl: "templates/consulta-manual-ticket.html",
        controller: 'ConsultaManualTicketCtrl'
      }
    }
  })

  .state('app.consultamanualfactura', {
    url: "/consulta-manual-factura",
    views: {
      'menuContent': {
        templateUrl: "templates/consulta-manual-factura.html",
        controller: 'ConsultaManualFacturaCtrl'
      }
    }
  })
    
  .state('app.consultaticket', {
    url: "/consultaticket",
    views: {
      'menuContent': {
        templateUrl: "templates/consulta-ticket.html",
        controller: 'ConsultaTicketCtrl'
      }
    }
  })

  .state('app.consultafactura', {
    url: "/consultafactura",
    views: {
      'menuContent': {
        templateUrl: "templates/consulta-factura.html",
        controller: 'ConsultaFacturaCtrl'
      }
    }
  })

  .state('app.resultado', {
    url: "/resultado",
    views: {
      'menuContent': {
        templateUrl: "templates/resultado.html",
        controller: 'ResuladosCtrl'
      }
    }
  })

  .state('app.resultadomanual', {
    url: "/resultado-manual",
    views: {
      'menuContent': {
        templateUrl: "templates/resultado-manual.html",
        controller: 'ResuladosManualCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/consultaticket');
})

.directive('browseTo', function ($ionicGesture) {
 return {
  restrict: 'A',
  link: function ($scope, $element, $attrs) {
   var handleTap = function (e) {
    // todo: capture Google Analytics here
    var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
   };
   var tapGesture = $ionicGesture.on('tap', handleTap, $element);
   $scope.$on('$destroy', function () {
    // Clean up - unbind drag gesture handler
    $ionicGesture.off(tapGesture, 'tap', handleTap);
   });
  }
 }
})

.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
});
