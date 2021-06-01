import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {firebase} from "./App";
import CustomizedDialogs from "./Upload"
import EcoIcon from '@material-ui/icons/Eco';
import {SERVER} from  "./config"
import ThreeDMap from './MyMap';
import PinPlants from './PinPlants'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));


export default function Album(props) {
  const classes = useStyles();
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(firebase.auth().currentUser)
  const [reload, setReload] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [pinId, setPinId] = useState(undefined)
  const [pinPlants, setPinPlants] = useState([]);
  const [center, setCenter] = useState([-80.544861, 43.472286])
  const [openCollection, setOpenCollection] = useState(false)
  const [collectionPlants, setCollectionPlants] = useState([])

  useEffect(() => {
    // Update the document title using the browser API

    
  }, [reload]);


  const triggerFetch = () => {
    setReload(reload+1)
  }
  
  const onPinClick = (pin_id) => {
    console.log(pin_id)
    getPlants(pin_id)
    setPinId(pin_id)  
    setIsOpen(true)
      
  }

  const handleClose = () => {
    console.log("close")
    setPinId(undefined)
    setIsOpen(false)
  }

  const handleCloseCollection = () => {
    console.log("close")
    setOpenCollection(false)
  }



  async function onDeleteData(plant_id) {
    console.log("deleting", plant_id)
    // e.preventDefault();
    try {
      const response = await fetch(`https://${SERVER}/users/${plant_id}`,{
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      })

      const jsonData = await response.json()
      console.log(jsonData)
      setReload(reload+1)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleCenterChange = (c) => {
    setCenter(c)
  }

  
  const getPlants = async (pin_id) => {

    try {
      const response = await fetch(`https://${SERVER}/pins/${pin_id}/plants`)
      const jsonData = await response.json()
      console.log(jsonData)
      setPinPlants(jsonData)
    
    } catch (err) {
      console.log(err.message)
    }
  
  }

  const getUserPlants = async () => {

    try {
      const response = await fetch(`https://${SERVER}/users/${user.email}/plants`)
      const jsonData = await response.json()
      console.log(jsonData)
      setCollectionPlants(jsonData)
    
    } catch (err) {
      console.log(err.message)
    }
  
  }

  const createAccount = async (email, username) => {

    try {
        const body = {
            email:email,  
            username: username
        }

        const response = await fetch( `https://${SERVER}/users/new`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        console.log(response)

    } catch (err){
        console.log(err)
    }
  }

  const handleOpenCollection = () => {
    getUserPlants()
    setOpenCollection(true)
  }  


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <EcoIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
          PlantSearchGo!
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            {/* <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              PlantSearchGo!
            </Typography> */}
            <Typography variant="h6" align="center" color="textSecondary" paragraph>
              Document and collect nearby plants!
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  {user && !user.isAnonymous ?
                     <Button variant="contained" color="primary" onClick={()=>{
                      firebase.auth().signOut().then(() => {
                          // Sign-out successful.

                          console.log("sign out successful")
                          setUser(null)
                          setReload(reload+1)
                        }).catch((error) => {
                          // An error happened.
                          console.log("error with sign out")
                         
                        });
                     }}> 
                     Sign Out
                     </Button>
                    :
                    <Button variant="contained" color="primary" onClick={()=>{
                     firebase.auth()
                     .signInWithPopup(props.provider)
                     .then((result) => {
                       /** @type {firebase.auth.OAuthCredential} */
                       var credential = result.credential;
                      
                       // This gives you a Google Access Token. You can use it to access the Google API.
                       var token = credential.accessToken;
                       // The signed-in user info.
                       var user = result.user;
                       setUser(user)
                       console.log(user)
                       createAccount(user.email, user.displayName)
                       // ...
                     }).catch((error) => {
                       // Handle Errors here.
                       var errorCode = error.code;
                       var errorMessage = error.message;
                       // The email of the user's account used.
                       var email = error.email;
                       // The firebase.auth.AuthCredential type that was used.
                       var credential = error.credential;
                       // ...
                     });
                  }}>
                    Sign In
                  </Button>
                  
                }
                
                </Grid>
               
                <Grid item>
          
                  <CustomizedDialogs user={user} reloadFunction={triggerFetch} setUserFunction={setUser} center={center}/>
                  
                </Grid>
                <Grid item> 
                <Button variant="outlined" color="primary" disabled={!user} onClick={handleOpenCollection}>
                  My Collection
                </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        <ThreeDMap onPinClick={onPinClick} center={center} handleCenterChange={handleCenterChange} reload={reload}/>
        <PinPlants isOpen={isOpen} pin_id={pinId} handleClose={handleClose} pinPlants={pinPlants}/>

        <PinPlants isOpen={openCollection} pin_id={user? user.displayName: ""} handleClose={handleCloseCollection} pinPlants={collectionPlants}/>

        <Container className={classes.cardGrid} maxWidth="md">
       
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}