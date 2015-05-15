angular.module('starter.services', [])

.factory("MyService", function() {
  return {
    data: {}
  };
})

.factory("Ticket", function ($resource) {
    return $resource("http://www.keypanelservices.com/qr/ticket.php", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

.factory("Factura", function ($resource) {
    return $resource("http://www.keypanelservices.com/qr/factura.php", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

.factory("Asociar", function ($resource) {
    return $resource("http://www.keypanelservices.com/qr/asociar.php", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { query: { method: "GET", isArray: false }
    })
});