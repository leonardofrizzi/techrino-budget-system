const { docClient } = require('../config/dynamo');
const {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const TABLE = process.env.CLIENTS_TABLE || 'Clients';

async function getClients() {
  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE }));
  return Items;
}

async function getClientById(id) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE,
    Key: { id }
  }));
  return Item;
}

async function createClient(client) {
  await docClient.send(new PutCommand({
    TableName: TABLE,
    Item: client
  }));
}

async function updateClient(id, updates) {
  const expr = [];
  const values = {};
  for (const key in updates) {
    expr.push(`#${key} = :${key}`);
    values[`:${key}`] = updates[key];
    values[`#${key}`] = key;
  }

  await docClient.send(new UpdateCommand({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: 'SET ' + expr.join(', '),
    ExpressionAttributeNames: Object.fromEntries(
      Object.keys(updates).map(k => [`#${k}`, k])
    ),
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW'
  }));
}

async function deleteClient(id) {
  await docClient.send(new DeleteCommand({
    TableName: TABLE,
    Key: { id }
  }));
}

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
