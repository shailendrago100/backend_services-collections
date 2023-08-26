// var apn                = require("apn");
// var path               = require('path');
// try {
//     var options = {
//         cert: path.join(__dirname, 'cert.pem'),         // Certificate file path
//         key:  path.join(__dirname, 'key.pem'),          // Key file path
//         passphrase: '<PASSWORD>/seraphic',                       // A passphrase for the Key file
//         ca: path.join(__dirname, 'aps_development.cer'), // String or Buffer of CA data to use for the TLS connection
//         production:false,
//         gateway: 'gateway.sandbox.push.apple.com',      // gateway address
//         port: 2195,                                     // gateway port
//         enhanced: true                                  // enable enhanced format
//     };
//     var apnConnection = new apn.Connection(options);
//     var myDevice = new apn.Device("<TOKEN>");
//     var note = new apn.Notification();
//     note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
//     note.badge = 3;
//     // note.sound = "ping.aiff";
//     note.alert = "You have a new message";
//     note.payload = {'msgFrom': 'Alex'};
//     note.device = myDevice;
//     apnConnection.pushNotification(note);



//     process.stdout.write("******* EXECUTED WITHOUT ERRORS************ :");


// } catch (error) {
//     process.stdout.write("ERROR :"+error);
// }