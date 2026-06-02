const fs = require('fs');
const path = require('path');

const objects = {

    Bogo_Customer__c: {
        label: 'Bogo Customer',
        pluralLabel: 'Bogo Customers',
        autoNumber: 'BOGO-{00000}',
        fields: [
            {
                name: 'Contact__c',
                type: 'Lookup',
                label: 'Contact',
                referenceTo: 'Contact',
                relationshipName: 'Bogo_Customers'
            },
            {
                name: 'Customer_Email__c',
                type: 'Email',
                label: 'Customer Email'
            },
            {
                name: 'Loyalty_Tier__c',
                type: 'Picklist',
                label: 'Loyalty Tier',
                values: ['Bronze','Silver','Gold','Platinum']
            },
            {
                name: 'Reward_Points__c',
                type: 'Number',
                label: 'Reward Points',
                precision: 10,
                scale: 0
            }
        ]
    },

    Bike_Rental__c: {
        label: 'Bike Rental',
        pluralLabel: 'Bike Rentals',
        autoNumber: 'RNT-{00000}',
        fields: [
            {
                name: 'Contact__c',
                type: 'Lookup',
                label: 'Contact',
                referenceTo: 'Contact',
                relationshipName: 'Bike_Rentals'
            },
            {
                name: 'Bike_Type__c',
                type: 'Picklist',
                label: 'Bike Type',
                values: ['Road','Mountain','Electric','Hybrid']
            },
            {
                name: 'Rental_Date__c',
                type: 'Date',
                label: 'Rental Date'
            },
            {
                name: 'Rental_Hours__c',
                type: 'Number',
                label: 'Rental Hours',
                precision: 5,
                scale: 0
            },
            {
                name: 'Rental_Amount__c',
                type: 'Currency',
                label: 'Rental Amount',
                precision: 16,
                scale: 2
            },
            {
                name: 'Rental_Status__c',
                type: 'Picklist',
                label: 'Rental Status',
                values: ['Booked','Active','Completed','Cancelled']
            }
        ]
    },

    Trip_Planned__c: {
        label: 'Trip Planned',
        pluralLabel: 'Trips Planned',
        autoNumber: 'TRP-{00000}',
        fields: [
            {
                name: 'Bogo_Customer__c',
                type: 'Lookup',
                label: 'Bogo Customer',
                referenceTo: 'Bogo_Customer__c',
                relationshipName: 'Trips_Planned'
            },
            {
                name: 'Destination_Place__c',
                type: 'Text',
                label: 'Destination Place',
                length: 100
            },
            {
                name: 'Trip_Date__c',
                type: 'Date',
                label: 'Trip Date'
            },
            {
                name: 'Activity_Type__c',
                type: 'Picklist',
                label: 'Activity Type',
                values: [
                    'Trekking',
                    'Mountain Biking',
                    'Beach Exploration',
                    'River Rafting',
                    'Camping'
                ]
            },
            {
                name: 'Price_Paid__c',
                type: 'Currency',
                label: 'Price Paid',
                precision: 16,
                scale: 2
            }
        ]
    }
};

function createFieldXml(field) {

    let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
<fullName>${field.name}</fullName>
<label>${field.label}</label>
<type>${field.type}</type>
`;

    if(field.type === 'Text'){
        xml += `<length>${field.length}</length>\n`;
    }

    if(field.type === 'Number' || field.type === 'Currency'){
        xml += `<precision>${field.precision}</precision>\n`;
        xml += `<scale>${field.scale}</scale>\n`;
    }

    if(field.type === 'Lookup'){
        xml += `<referenceTo>${field.referenceTo}</referenceTo>\n`;
        xml += `<relationshipName>${field.relationshipName}</relationshipName>\n`;
    }

    if(field.type === 'Picklist'){

        xml += `
<valueSet>
<valueSetDefinition>
<sorted>false</sorted>
`;

        field.values.forEach(v=>{
            xml += `
<value>
<fullName>${v}</fullName>
<default>false</default>
<label>${v}</label>
</value>
`;
        });

        xml += `
</valueSetDefinition>
</valueSet>
`;
    }

    xml += '</CustomField>';

    return xml;
}

Object.keys(objects).forEach(objName => {

    const obj = objects[objName];

    const baseDir =
        path.join(
            'force-app',
            'main',
            'default',
            'objects',
            objName
        );

    fs.mkdirSync(
        path.join(baseDir,'fields'),
        {recursive:true}
    );

    obj.fields.forEach(field => {

        fs.writeFileSync(
            path.join(
                baseDir,
                'fields',
                `${field.name}.field-meta.xml`
            ),
            createFieldXml(field)
        );
    });

    console.log(`Generated ${objName}`);
});