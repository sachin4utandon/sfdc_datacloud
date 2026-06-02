const fs = require('fs');
const path = require('path');

const RECORDS = {
    contacts: 1000,
    bogoCustomers: 1000,
    bikeRentals: 2000,
    tripsPlanned: 2000
};

const firstNames = [
    'Amit','Rahul','Priya','Neha','Vikas',
    'Anjali','Rohit','Sneha','Arjun','Pooja',
    'Karan','Nisha','Vivek','Ritu','Akash',
    'Meera','Varun','Kavya','Sanjay','Simran'
];

const lastNames = [
    'Sharma','Verma','Singh','Gupta','Agarwal',
    'Tandon','Kapoor','Mishra','Yadav','Jain'
];

const cities = [
    'Lucknow',
    'Delhi',
    'Mumbai',
    'Pune',
    'Bengaluru',
    'Hyderabad',
    'Jaipur',
    'Chandigarh'
];

const destinations = [
    'Goa',
    'Manali',
    'Leh',
    'Shimla',
    'Kerala',
    'Ooty',
    'Rishikesh',
    'Jaipur'
];

const loyaltyTiers = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum'
];

const bikeTypes = [
    'Road',
    'Mountain',
    'Electric',
    'Hybrid'
];

const bikeStatuses = [
    'Booked',
    'Active',
    'Completed',
    'Cancelled'
];

const activities = [
    'Trekking',
    'Mountain Biking',
    'Beach Exploration',
    'River Rafting',
    'Camping'
];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
    return new Date(
        start.getTime() +
        Math.random() * (end.getTime() - start.getTime())
    );
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output');
}

/*
====================================================
CONTACTS
====================================================
*/

let contactsCsv =
'ContactExternalId,FirstName,LastName,Email,Phone,MailingCity\n';

const contacts = [];

for (let i = 1; i <= RECORDS.contacts; i++) {

    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    const contactId =
        'C' + String(i).padStart(5, '0');

    const email =
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;

    contacts.push({
        contactId,
        email
    });

    contactsCsv +=
        `${contactId},` +
        `${firstName},` +
        `${lastName},` +
        `${email},` +
        `98${Math.floor(10000000 + Math.random()*90000000)},` +
        `${randomItem(cities)}\n`;
}

fs.writeFileSync(
    './output/Contacts.csv',
    contactsCsv
);

/*
====================================================
BOGO CUSTOMERS
====================================================
*/

let bogoCsv =
'BogoCustomerId,ContactExternalId,Email,LoyaltyTier,RewardPoints\n';

for (let i = 1; i <= RECORDS.bogoCustomers; i++) {

    const contact = contacts[i - 1];

    bogoCsv +=
        `B${String(i).padStart(5,'0')},` +
        `${contact.contactId},` +
        `${contact.email},` +
        `${randomItem(loyaltyTiers)},` +
        `${Math.floor(Math.random()*10000)}\n`;
}

fs.writeFileSync(
    './output/BogoCustomers.csv',
    bogoCsv
);

/*
====================================================
BIKE RENTALS
====================================================
*/

let rentalsCsv =
'RentalId,ContactExternalId,BikeType,RentalDate,RentalHours,RentalAmount,RentalStatus\n';

for (let i = 1; i <= RECORDS.bikeRentals; i++) {

    const contact =
        contacts[
            Math.floor(Math.random() * contacts.length)
        ];

    rentalsCsv +=
        `R${String(i).padStart(5,'0')},` +
        `${contact.contactId},` +
        `${randomItem(bikeTypes)},` +
        `${formatDate(randomDate(new Date(2024,0,1), new Date()))},` +
        `${Math.floor(Math.random()*12)+1},` +
        `${Math.floor(Math.random()*5000)+200},` +
        `${randomItem(bikeStatuses)}\n`;
}

fs.writeFileSync(
    './output/BikeRentals.csv',
    rentalsCsv
);

/*
====================================================
TRIPS PLANNED
====================================================
*/

let tripsCsv =
'TripId,BogoCustomerId,DestinationPlace,TripDate,ActivityType,PricePaid\n';

for (let i = 1; i <= RECORDS.tripsPlanned; i++) {

    const customerId =
        'B' +
        String(
            Math.floor(Math.random()*1000)+1
        ).padStart(5,'0');

    tripsCsv +=
        `T${String(i).padStart(5,'0')},` +
        `${customerId},` +
        `${randomItem(destinations)},` +
        `${formatDate(randomDate(new Date(), new Date(2027,11,31)))},` +
        `${randomItem(activities)},` +
        `${Math.floor(Math.random()*50000)+5000}\n`;
}

fs.writeFileSync(
    './output/TripsPlanned.csv',
    tripsCsv
);

console.log('================================');
console.log('Data Cloud Sample Data Generated');
console.log('================================');
console.log('./output/Contacts.csv');
console.log('./output/BogoCustomers.csv');
console.log('./output/BikeRentals.csv');
console.log('./output/TripsPlanned.csv');