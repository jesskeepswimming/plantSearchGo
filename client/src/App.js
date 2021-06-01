import './App.css';
import Album from './Album';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import {firebaseConfig} from  "./config"

firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();
var storage = firebase.storage();

export {storage, firebase}

function App() {
  const onStyleLoad = (ev) => {
    console.log(ev)
  }

  return (
    <div className="App">
      <header>

      </header>
      <Album provider={provider}/>
      
    </div>
  );
}

export default App;
