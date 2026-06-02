const objects = {
    'Bogo_Customer__c': {
        label: 'Bogo Customer',
        plural: 'Bogo Customers',
        nameField: 'Customer ID',
        autoNum: 'BOGO-{00000}',
        sharingModel: 'ReadWrite',
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
                picklistValues: [
                    'Bronze',
                    'Silver',
                    'Gold',
                    'Platinum'
                ]
            },
            {
                name: 'Reward_Points__c',
                type: 'Number',
                label: 'Reward Points',
                precision: 10,
                scale: 0
            }
        ]
    }
};