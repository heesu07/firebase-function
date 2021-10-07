import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase, { functions } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './auth/Auth';
const moment = require('moment');

function SnapshotFirebaseAdvanced() {
  const { currentUser } = useContext(AuthContext);
  //const currentUserId = currentUser ? currentUser.uid : null;
  const [devices, setdevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [online, setOnline] = useState(false);

  const ref = firebase.firestore().collection('devices');


  //REALTIME GET FUNCTION
  function getDevices() {
    setLoading(true);
    ref
      //.where('owner', '==', currentUserId)
      //.where('title', '==', 'School1') // does not need index
      //.where('score', '<=', 10)    // needs index
      //.orderBy('owner', 'asc')
      //.limit(3)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setdevices(items);
        setLoading(false);
      });
  }

  useEffect(() => {
    getDevices();
    // eslint-disable-next-line
  }, []);

  // ADD FUNCTION
  function addDevice() {
    const owner = currentUser ? currentUser.uid : 'unknown';
    const ownerEmail = currentUser ? currentUser.email : 'unknown';
    const newDevice = {
      title,
      desc,
      online: online,
      id: uuidv4(),
      owner,
      ownerEmail,
      createdAt: moment.utc().format(moment.HTML5_FMT.DATETIME_LOCAL_MS),
      lastUpdate: moment.utc().format(moment.HTML5_FMT.DATETIME_LOCAL_MS),
    };

    ref
      .doc(newDevice.id)
      .set(newDevice)
      .catch((err) => {
        console.error(err);
      });
  }

  //DELETE FUNCTION
  function deleteDevice(device) {
    ref
      .doc(device.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }
  
  // http callable function
  const sayHello = functions.httpsCallable('sayHello');
  const readState = functions.httpsCallable('getOnlineState');
  const writeState = functions.httpsCallable('setOnlineState');

  const getOnlineState = async (device) => {
    const response = await readState(device)
      console.log(response);
  };
  
  const setOnlineState = (device) => {
    //var context = { auth: currentUser };
    writeState(device)
      .then(result => {
        console.log('success');
      });
  }

  const hello = () => {
    // sayHello()
    //   .then(result => {
    //     if (result.data)
    //       console.log(result.data);
    //   });

    // test for rollbackOnlineState
    // const ref = firebase.firestore().collection('devices');
    // ref
    //   .where('online', '==', true)
    //   .onSnapshot(snapshot => {
    //     snapshot.forEach(doc => {
    //       const device = doc.data();
    //       console.log(device);
    //       const diff = moment().utc().diff(moment.utc(device.lastUpdate), 'minutes');
    //       if (diff >= 1) {
    //         ref.doc(device.id).update({
    //           online: false,
    //           lastUpdate: moment.utc().format(moment.HTML5_FMT.DATETIME_LOCAL_MS)
    //         });
    //         console.log("update success");
    //       }
    //     })
    //   });

    const test = JSON.stringify({
      "result": "success",
      "online": false,
      "date": new Date()
    });
    console.log(test);
  }

  // useEffect(() => {
  //   if (ref === undefined) return;
  //   if (devices.length > 1) return;

  //   ref
  //     .onSnapshot(snapshot => {
  //       snapshot.docChanges().forEach((change) => {
  //         console.log(change);
  //         //if (change.type === 'modified' || change.type === 'added') {
  //         //const device = change.doc.data();
  //         // if (device.online === true) {
  //         //   const userName = device.alias;
  //         //   const loginState = device.online ? "online" : "offline";
  //         //   alert(`${userName} is ${loginState}`);
  //         // }
  //         //}
  //       })
  //     });
  //   return (devices.forEach(d => d.online = false))
  // }, [devices, ref]);

  return (
    <Fragment>
      <h1>Http Callable Function</h1>
      <div>
        <button onClick={() => hello()}>say Hello</button>

      </div>
      <div className="inputBox">
        <h3>Add New Device</h3>
        <h6>Title</h6>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h6>Online </h6>
        <input
          type="checkbox"
          value={online}
          onChange={(e) => { setOnline(e.target.value); console.log(e.target.value); }}
        />
        <h6>Description</h6>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={() => addDevice()}>Submit</button>
      </div>
      <hr />
      {loading ? <h1>Loading...</h1> : null}
      {devices.map((device) => (
        <div className="device" key={device.id}>
          <h2>{device.title}</h2>
          <p>{device.desc}</p>
          <p>{device.online === true ? "on" : "off"}</p>
          <p>{device.ownerEmail}</p>
          <div>
            <button onClick={() => deleteDevice(device)}>delete</button>
            <button onClick={() => getOnlineState(device)}>get online</button>
            <button onClick={() =>
              setOnlineState(device)}>toggle online</button>
          </div>
        </div>
      ))}
    </Fragment>
  );
}

export default SnapshotFirebaseAdvanced;
