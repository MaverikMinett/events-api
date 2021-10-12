var bench = require('api-benchmark');
var fs = require('fs')

const service = {
    dev: 'http://localhost:43200/api/', 
    prod: 'https://polar-caverns-93735.herokuapp.com/api/'
}

const routes = {
    eventsList: 'events',
    eventsDetail: 'events/2',
    eventsRegistration: {
        method: 'post',
        route: 'events/2/register',
        data: payload()
    }
}

bench.measure( service, routes, ( error, results ) => {

    bench.getHtml(results, function(error, html){
        fs.writeFileSync( './benchmark/output/benchmark.html', html )

        let url = service.dev.substring(0, service.dev.length - 1)
        url = url.substring(0, url.lastIndexOf('/'))
        url = `${url}/benchmark.html`
        
        console.log(`See output at ${url}`)
    });

})



function payload() {
    return {
        "id": 1,
        "name": "Tribal Symposium",
        "description": "<p>Inter-tribal workshops</p>",
        "time_start": "2021-10-15 08:00:00",
        "time_end": "2021-10-15 20:00:00",
        "location_name": "Some Remote Place",
        "location_address": "The Carribean, Central America",
        "contact_email": "tribalsymposium@geemail.com",
        "contact_phone": "(555) 555 5555",
        "status": "open",
        "tickets": [
          {
            "id": 1,
            "label": "Free",
            "description": "General admission",
            "price": 0,
            "status": "open"
          }
        ],
        "sessions": [
          {
            "id": 1,
            "label": "Chocolate Cultivation",
            "description": "Learn to farm, harvest, and process chocolate using organic practices and traditional tools",
            "price": 0,
            "status": "open"
          },
          {
            "id": 2,
            "label": "Hammock Weaving",
            "description": "Learn to weave hammocks using a traditional loom and hand rolled cotton fiber",
            "price": 0,
            "status": "open"
          },
          {
            "id": 3,
            "label": "Mascaras Diablos (carving)",
            "description": "Learn to carve traditional Boruca masks from balsa wood",
            "price": 0,
            "status": "open"
          },
          {
            "id": 4,
            "label": "Mascaras Diablos (painting)",
            "description": "Learn to paint traditional Boruca masks",
            "price": 0,
            "status": "sold out"
          }
        ]
      }
}