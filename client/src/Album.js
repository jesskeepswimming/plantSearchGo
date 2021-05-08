import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {firebase} from "./App";
import CustomizedDialogs from "./Upload"
import PostDialog from "./Posts"
import { Badge } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPost from './AddPost';

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

  useEffect(() => {
    // Update the document title using the browser API

    onFetchData()
  }, [reload]);


  const triggerFetch = () => {
    setReload(reload+1)
  }
  const onFetchData = async e => {

    // e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/plants")
      const jsonData = await response.json()

      console.log(jsonData)
      setCards(jsonData)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function onDeleteData(plant_id) {
    console.log("deleting", plant_id)
    // e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/plants/${plant_id}`,{
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

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Album layout
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Album layout
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Something short and leading about the collection below—its contents, the creator, etc.
              Make it short and sweet, but not too short so folks don&apos;t simply skip over it
              entirely.
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
                  {/* <Button variant="outlined" color="primary">
                    Secondary action
                  </Button> */}
                  <CustomizedDialogs user={user} reloadFunction={triggerFetch} setUserFunction={setUser}/>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.plant_id} xs={12} sm={6} md={4}>
                <Badge badgeContent={card.for_sale ? "selling": ""} color="secondary" invisible={card.for_sale ? false:true}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={card.image}
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.nickname}
                      </Typography>
                      <Typography>
                       {card.plant} 
                      </Typography>
                    </CardContent>
                    <CardActions>
                    
                      <PostDialog card={card}  />

                      <Button size="small" color="primary" disabled={!user || card.user_id != user.email}>
                        {!user || card.user_id != user.email ? "" : <AddPost user={user} reloadFunction={triggerFetch} plant_id = {card.plant_id}/>}
                      </Button>

                      <Button size="small" color="primary" disabled={!user || card.user_id != user.email} onClick={() => onDeleteData(card.plant_id)}>
                      {!user || card.user_id != user.email ? "" : <DeleteIcon/>}
                      </Button>

                    </CardActions>
                  </Card>
                  </Badge>
              </Grid>
            ))}
          </Grid>
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