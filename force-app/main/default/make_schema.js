const fs = require('fs');
const path = require('path');

// Configuration for objects
const objects = {
    'Bogo_Customer__c': {
        label: 'Bogo Customer', plural: 'Bogo Customers', nameField: 'Bogo Cust ID', autoNum: 'ADV-{00000}',
        fields: [
            { name: 'First_Name__c', type: 'Text', length: 80, required: 'true' },
            { name: 'Last_Name__c', type: 'Text', length: 80, required: 'true' },
            { name: 'Email_Address__c', type: 'Email', unique: 'true', externalId: 'true' },
            { name: 'Mobile_Number__c', type: 'Phone' },
            { name: 'City__c', type: 'Text', length: 100 },
            { name: 'Birth_Date__c', type: 'Date' }
        ]
    }
};

// Quick template generator
Object.keys(objects).forEach(objName => {
    const obj = objects[objName];
    const baseDir = path.join('force-app', 'main', 'default', 'objects', objName);
    
    // Create folders
    fs.mkdirSync(path.join(baseDir, 'fields'), { recursive: true });
    
    // Write Object Meta
    const objXml = `<?xml version="1.0" encoding="UTF-8"?>\n<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">\n <deploymentStatus>Deployed</deploymentStatus>\n <label>${obj.label}</label>\n <pluralLabel>${obj.plural}</pluralLabel>\n <sharingModel>ReadWrite</sharingModel>\n <nameField>\n  <label>${obj.nameField}</label>\n  <type>AutoNumber</type>\n  <displayFormat>${obj.autoNum}</displayFormat>\n </nameField>\n</CustomObject>`;
    fs.writeFileSync(path.join(baseDir, `${objName}.object-meta.xml`), objXml);
    
    // Write Fields Meta
    obj.fields.forEach(f => {
        let fieldXml = `<?xml version="1.0" encoding="UTF-8"?>\n<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n <fullName>${f.name}</fullName>\n <label>${f.name.replace('__c','').replace('_',' ')}</label>\n <type>${f.type}</type>\n`;
        if(f.length) fieldXml += ` <length>${f.length}</length>\n`;
        if(f.required) fieldXml += ` <required>${f.required}</required>\n`;
        if(f.unique) fieldXml += ` <unique>${f.unique}</unique>\n`;
        if(f.externalId) fieldXml += ` <externalId>${f.externalId}</externalId>\n`;
        fieldXml += `</CustomField>`;
        
        fs.writeFileSync(path.join(baseDir, 'fields', `${f.name}.field-meta.xml`), fieldXml);
    });
});
print("Done! Metadata generated locally.");