"use strict";

const apn = require('apn');

let options = {
   token: {
     key: "cert_notifications.p8",
     // Replace keyID and teamID with the values you've previously saved.
     keyId: "YOUR_KEY_ID",
     teamId: "P2U22T7Y9U"
   },
   production: false
 };

 let apnProvider = new apn.Provider(options);

 // Replace deviceToken with your particular token:
 let deviceToken = "16938391310CF7F1CF83AB0418B373B5BC52E2C449A6CC8F997ECD5E50574F0E";

 // Prepare the notifications
 let notification = new apn.Notification();
 notification.expiry = Math.floor(Date.now() / 1000) + 24 * 3600; // will expire in 24 hours from now
 notification.badge = 2;
 notification.sound = "ping.aiff";
 notification.alert = "Hello from solarianprogrammer.com";
 notification.payload = {'messageFrom': 'Solarian Programmer'};

 // Replace this with your app bundle ID:
 notification.topic = "com.solarianprogrammer.PushNotificationsTutorial";

 // Send the actual notification
 apnProvider.send(notification, deviceToken).then( result => {
 	// Show the result of the send operation:
 	console.log(result);
 });


 // Close the server
 apnProvider.shutdown();
