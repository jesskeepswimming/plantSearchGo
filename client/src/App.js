import './App.css';
import Album from './Album';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1X0CSX45NvxMU9rioPPzAcoTzhG6wLL4",
  authDomain: "plants-2a2d0.firebaseapp.com",
  projectId: "plants-2a2d0",
  storageBucket: "plants-2a2d0.appspot.com",
  messagingSenderId: "783547806285",
  appId: "1:783547806285:web:3fac043c9d10183c046204"
};

firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();
var storage = firebase.storage();

export {storage, firebase}

function App() {
  return (
    <div className="App">
      <header>

      </header>
      <Album provider={provider}/>
    </div>
  );
}

export default App;
