const { docClient } = require('../config/dynamo');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const USERS_TABLE = process.env.USERS_TABLE || 'Users';

async function getUserByEmail(email) {
  const result = await docClient.send(new ScanCommand({
    TableName: USERS_TABLE,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email },
    Limit: 1
  }));
  return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

async function createUser(user) {
  await docClient.send(new PutCommand({
    TableName: USERS_TABLE,
    Item: user
  }));
}

module.exports = {
  getUserByEmail,
  createUser
};
