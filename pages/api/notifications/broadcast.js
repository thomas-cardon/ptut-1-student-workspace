import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

const PushNotifications = require('@pusher/push-notifications-server');

let beamsClient = new PushNotifications({
  instanceId: process.env.BEAMS_INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY
});

async function handler(req, res, session) {
  beamsClient.publishToInterests(req.query.interests.split(';'), {
    web: {
      notification: {
        title: req.body.title || req.query.title || 'Notification',
        body: req.body.body || req.query.body || '[!] Cette notification est vide.',
        icon: 'https://ptut-1-student-workspace.vercel.app/icon-256x256.png',
        deep_link: 'https://ptut-1-student-workspace.vercel.app'
      }
    }
  }).then((publishResponse) => {
    console.log('Just published:', publishResponse.publishId);
    res.send({ success: true });
  }).catch((error) => {
    console.error('Error:', error);
    res.status(500).send({ success: false, error: error.toString() });
  });
}

export default withSession(handler);
