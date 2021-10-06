const functions = require("firebase-functions");
const admin = require('firebase-admin');
const db = admin.initializeApp().firestore();
const moment = require('moment');
const _ = require('lodash');

// // http request
// exports.randomNumber = functions.https.onRequest((req,res)=>{
//   const number = Math.round(Math.random() * 100);
//   console.log(number);
//   res.send(number.toString());
// });

// exports.gotoDaum = functions.https.onRequest((req,res)=>{
//   res.redirect('https://www.daum.net');
// });

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
  // if (context.app === undefined) {
  //   throw new functions.https.HttpsError(
  //       'failed-precondition',
  //       'The function must be called from an App Check verified app.')
  // }
  return `hello !`;
});

// firebase functions
exports.getOnlineState = functions.https.onCall( async (data, context) => {
  // if (context.app === undefined) {
  //   throw new functions.https.HttpsError(
  //       'failed-precondition',
  //       'The function must be called from an App Check verified app.')
  // }
  if (_.isEmpty(context.auth) || _.isEmpty(data.id) ) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called with Device infomation');
  }

  db
    .collection("devices")
    .doc(data.id)
    .get()
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err);
      return { 
        error : err,
        success: false, 
        message: '' 
      };
    });
});

exports.setOnlineState = functions.https.onCall(async (data, context) => {
  // if (context.app === undefined) {
  //   throw new functions.https.HttpsError(
  //       'failed-precondition',
  //       'The function must be called from an App Check verified app.')
  // };
  if (_.isEmpty(context.auth) || _.isEmpty(data.id) ) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called with Device infomation');
  }

  try{
    await db
    .collection('devices')
    .doc(data.id)
    .set(
      {
        online: true,
        lastUpdate: moment.utc().format(moment.HTML5_FMT.DATETIME_LOCAL_MS)
      }, 
      { merge: true });
      return { 
        success: true, 
        message: '' 
      };   
  }
  catch(error){
    console.log(error);    
  }; 
});

exports.rollbackOnlineState = functions.pubsub.schedule('every 1 minutes').onRun( async (context) => {

  const ref = admin.firestore().collection('devices');
  
  ref
    .where('online', '==', true)
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const device = doc.data();
        const diff = moment().utc().diff(moment.utc(device.lastUpdate), 'minutes');
        console.log(`diff: ${diff}`);
        if (diff >= 1){        
            ref.doc(device.id).update({
              online: false,
              lastUpdate: moment.utc().format(moment.HTML5_FMT.DATETIME_LOCAL_MS)
            });
          console.log("update success");        
          }
      });
    });
  return "";
});