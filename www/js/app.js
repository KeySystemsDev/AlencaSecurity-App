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
});
