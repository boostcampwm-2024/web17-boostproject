const webPush = require('web-push');

// VAPID 키 쌍 생성
const vapidKeys = webPush.generateVAPIDKeys();

console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
