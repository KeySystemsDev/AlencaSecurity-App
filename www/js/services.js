angular.module('starter.services', [])

.factory("MyService", function() {
  return {
    data: {}
  };
})

.factory("enviar", function ($resource) {
    return $resource("http://keypanelservices.com/qr/qr.php", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
});