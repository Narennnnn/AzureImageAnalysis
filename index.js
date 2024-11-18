const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');
const fs = require('fs');

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env['VISION_ENDPOINT'];
const key = process.env['VISION_KEY'];

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = [
  'Caption'
];

async function analyzeImageFromFile(filePath) {
  const imageData = fs.readFileSync(filePath);

  const result = await client.path('/imageanalysis:analyze').post({
    body: imageData,
    queryParameters: {
      features: features
    },
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  });

  const iaResult = result.body;

  if (iaResult.captionResult) {
    console.log(`Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`);
  } else {
    console.log('No caption result found.');
  }
}

analyzeImageFromFile('jeans.jpg');
