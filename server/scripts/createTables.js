const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

async function createTable(name, pk) {
  try {
    await client.send(new CreateTableCommand({
      TableName: name,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [{ AttributeName: pk, AttributeType: 'S' }],
      KeySchema: [{ AttributeName: pk, KeyType: 'HASH' }],
    }));
    console.log(`Table ${name} created or already exists.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Table ${name} already exists, skipping.`);
    } else {
      console.error(`Error creating table ${name}:`, err);
    }
  }
}

async function main() {
  await createTable('Users', 'id');
  await createTable('Clients', 'id');
  await createTable('Products', 'id');
  await createTable('Quotes', 'id');
}

main().catch(console.error);
