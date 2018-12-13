import log from '../utils/log'
import magic from '../chrome/custom-page'
const util = require('util')

export default async function handler (event, context, callback) {
  const message = 'custom magic !!!';
  let data;
  console.log(`event: ${JSON.stringify(event)}`);
  try {
    data = await magic(event);
  } catch (error) {
    console.error('Error casting magic:', event, error)
    return callback(error)
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(data),
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
}
