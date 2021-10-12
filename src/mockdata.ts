
import { Connection } from "typeorm"
import { Event, Session, Ticket } from "./entities/events.entities"

// (name, time_start, time_end, description)
// VALUES ("29th Annual Event: Gourmet Gala", "2021-11-14 16:00:00", "2021-11-14 20:00:00", "<p>This promises to be a great event with good food for a good cause! Be sure to save the date and click the link below to register for the event. We hope to see you there!</p> <p>Even if you can’t make it to the event, please consider donating in support of this worthy cause!</p>"),
//        ("Our Common Thread: Fundraiser", "2021-10-09 18:30:00", "2021-10-09 22:30:00", "<p>Join us for an evening of music in support of Meg Dostal (who has a rare brain cancer called Oligodendroglioma), and her organization Our Common Thread, an online community for cancer patients and survivors to share their stories and find inspiration in the stories of others.</p>"),
//        ("Festival of Hope 2021 Charity Golf Tournament", "2021-10-24 09:00:00", "2021-10-24 17:15:00", "<p>As part of the Community Foundation of the Adirondack Foothill's Annual Fundraising Campaign so that we may serve 5,000 meals this upcoming Thanksgiving, we will be hosting the Inaugural \"Festival of Hope\".</p>"),
//        ("Bark Brew & Tattoo Charity Event", "2021-10-24 15:00:00", "2021-10-24 17:00:00", "<p>Bark, Brew & Tattoo Charity Event will have:</p><ul><li>Vendors</li><li>Craft Breweries</li><li>Pet Adoptions</li><li>Tattoo Basket Raffles</li><li>Costume Contest</li></ul>"),
//        ("Brighton Fall Pet Photo Fundraiser", "2021-10-16 10:00:00", "2021-10-16 14:00:00", "<p>Looking for cute Fall pet photos!? We are excited to be hosting a family fun photo event with all proceeds going to Lollypop Farm Humane Society!</p>");





const eventsData = [
    {
        id: 1,
        name: "29th Annual Event: Gourmet Gala",
        time_start: "2021-10-23 17:00:00",
        time_end: "2021-10-23 21:00:00",
        location_name: "Some Fancy Place",
        location_address: "Winners Circle, Town Heights",
        contact_phone: "(555) 555-5555",
        contact_email: "kathy@geemail.com",
        description: `<p>This promises to be a great event with good food for a
         good cause! Be sure to save the date and click the link below to register
          for the event. We hope to see you there!</p> <p>Even if you can’t make it 
          to the event, please consider donating in support of this worthy cause!</p>
          
          <h3>Meal Options</h3>

          <ul>
            <li>Turkey sandwich</li>
            <li>Ham sandwich</li>
            <li>PB&J</li>
          </ul>
          
          `,
        status: "open",
        tickets: [
            { id:1, label: "Single Admission", description: "Entry for one person", price: 45.00, status: "open" },
            { id:2, label: "Table", description: "Table of eight", price: 400.00, status: "open" },
            { id:6, label: "VIP Table", description: "Table of eight with bottle service.", price: 1000.00, status: "sold out" },
            
        ],
        sessions: [ ] as any[],
    },
    {
        id: 2,
        name: "Tribal Symposium",
        time_start: "2021-10-14 08:00:00",
        time_end: "2021-10-17 20:00:00",
        description: `
          <p>Join us on the tropical island of Ustupu, Guna Yala during the annual celebration of the Nele Kantule festival
          . Four tribes from 3 countries will be assembling for an inter-tribal education exchange as part
          of our Tribal Symposium taking place during the festival.</p>

          <p>
            <b>Nele Kantule</b>
            <br/>
            Nele Kantule is the warrior chief that lead the Guna warriors to victory against the Panamanian government in 1925.
            With this victory, the Guna Yala is recognized as an independant and autonomous indigienous nation within the borders
            of the Panamanian territory.
          </p>

          <p>
            <b>Directions</b>
            <ul>
              <li>Boat: You can catch a lancha at the docks in Miramar, total travel time in boat is 10 hours and costs ~$100.</li>
              <li>Plane: Take a bi-plane from panama city to the Island of Gaigirgordub and take a water taxi to Ustupu.</li>
            </ul>
          </p>
        `,
        location_name: "Some Remote Place",
        location_address: "The Carribean, Central America",
        contact_phone: "(555) 555-5555",
        contact_email: "tribalsymposium@geemail.com",
        status: "open",
        tickets: [ 
            { id:3, label: "Visitor", description: "Join us for the Kantule festival and observe the inter-tribal educational exchange sessions.", price: 0.00, status: "open" },
            { id:4, label: "Tribe Member", description: "Register to participate in the educational exchange sessions.", price: 0.00, status: "open" },
            { id:5, label: "Volunteer", description: "Register to participate as a volunteer.", price: 100.00, status: "draft" }
            
        ],
        sessions: [
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
              },
              {
                "id": 5,
                "label": "Meeting with the Elders",
                "description": "Join the island 'town hall' with visiting chiefs from neighboring islands.",
                "price": 0,
                "status": "draft"
              },
              {
                "id": 6,
                "label": "Chicha Ceremony",
                "description": "Chicha is a traditional fermented sugar cane drink served from a communcal totuma.",
                "price": 20.00,
                "status": "open"
              }
        ]
    },
    {
        id: 7,
        name: "Lazy Dog Fundraiser",
        time_start: "2021-11-10 16:00:00",
        time_end: "2021-11-10 20:00:00",
        location_name: "The Lazy Dog",
        location_address: "123 Main St, Anytown",
        contact_phone: "555 555 5555",
        contact_email: "thelazydog@geemail.com",
        description: `<img src="http://i.ibb.co/vjbz1Pc/HSVC-Flier-lazydog.jpg"><br/>Humane Society of Ventura County. This event has no tickets or sessions.`,
        status: "open",
        tickets: [ ] as any,
        sessions: [ 
            {   
                "id": 7,
                "label": "Test Session",
                "description": "",
                "price": 0,
                "status": "closed"
              },
       ]
    },
]




export default async function populateMockData(connection:Connection) {

      console.log("Clearing mock data")
      const response = await connection.dropDatabase();
      console.log("Synching database")
      await connection.synchronize();


    // populate mock data
    console.log("Populating mock data")
    const repo = connection.getRepository(Event)

    for ( let data of eventsData ) {
        if ( ! await repo.findOne(data.id) ) {
            
            /* tickets */
            const ticketData = data['tickets']
            delete data['tickets']

            /* sessions */
            const sessionData = data['sessions']
            delete data['sessions']

            /* create the event */
            const event = new Event()
            Object.assign(event, data)
            await connection.manager.save(Event, event)

            /* create the tickets */
            const tickets = ticketData.map( (data:any) => {
                const ticket = new Ticket()
                Object.assign(ticket, data)
                ticket.event = event
                return ticket
            } )
            await connection.manager.save(Ticket, tickets)

            /* create the sessions */
            const sessions = sessionData.map( data => {
                const session = new Session()
                Object.assign(session, data)
                session.event = event
                return session
            } )
            await connection.manager.save(Session, sessions)
        }
    }

        
}
