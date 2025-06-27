const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dbClient = require("../config/Ddb.js");

const ddbDocClient = DynamoDBDocumentClient.from(dbClient);
const TABLE_NAME = "Videos";

async function createVideo(video) {
    console.log("haiii cfreate vedio")
  const params = {
    TableName: TABLE_NAME,
    Item: video,
  };
  await ddbDocClient.send(new PutCommand(params));
}

async function getReadyVideos() {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#status = :statusVal",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":statusVal": "ready",
    },
  };
  const data = await ddbDocClient.send(new ScanCommand(params));
  return data.Items;
}

async function getVideoById(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  const data = await ddbDocClient.send(new GetCommand(params));
  return data.Item;
}

module.exports = {
  createVideo,
  getReadyVideos,
  getVideoById,
};
