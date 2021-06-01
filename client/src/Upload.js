import React, {useState, useEffect}from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';

import {SERVER} from  "./config"
// import MuiAlert from '@material-ui/lab/Alert';

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }


import {storage, firebase} from './App'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));



export function VerticalLinearStepper(props) {

  const {handleClose, user, setUserFunction, reloadFunction, center} = props
  const classes = useStyles();

  // const [currentUser, setCurrentUser] = useState(props.user)
  const [activeStep, setActiveStep] = useState(0);
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState('')

  const [note, setNote] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")
  const [identification, setIdentification] = useState({})



  const storageRef = storage.ref();


  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    setImageAsFile(imageAsFile => (image))
  }


  const imageFileType = (name) => {
    if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")) return true

    return false
  }

  const handleFireBaseUpload = (user = props.user) => {
    // e.preventDefault()
    console.log('start of upload')
    // async magic goes here...

    if(imageAsFile === '' || !imageFileType(imageAsFile.name) ) {
        let errorMsg = `file must be a jpeg/png image`
        setUploadStatus("error: " +errorMsg)
    } else{
        var current = new Date().valueOf();
        const url = `/images/${current}${imageAsFile.name}`
        const imageRef = storageRef.child(url)

        var uploadTask = imageRef.put(imageAsFile)

        uploadTask.on('state_changed', 
            (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadStatus(progress + '%')
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
            }, 
            (error) => {
            // Handle unsuccessful uploads
                console.log("error")
                setUploadStatus("error")

            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log('File available at', downloadURL);
                  setImageAsUrl(downloadURL)
                  onPostData(downloadURL, user)
                  setUploadStatus("success")
                });
              }
        ); 
  
    }
  
  }

  const handleUpload = () => {
    // upload to backend
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onUploadData()
    
  };

 
  const onPostData = (downloadURL, user) => {

    try {

        const body = {
            'imageUrl': downloadURL,
            'latitude': 0,
            'longitude': 0,
        }

        console.log(body)

        const response =  fetch(`https://${SERVER}/plants/identify`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(function(response) {
          // The response is a Response instance.
          // You parse the data into a useable format using `.json()`
          return response.json();
        }).then(function(data) {
          // `data` is the parsed version of the JSON returned from the above endpoint.
          console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }

          const {plant_name, plant_details} = data
          const {common_names} = plant_details

          const result = {
            plant_name,
            "common_name": common_names[0],
            "wiki_images": plant_details.wiki_images
          }


          setIdentification(result)
          setActiveStep(1);

        });

        
      } catch (err){
        console.log(err)
    }
    
  }


// Retrieve its body as ReadableStream

  const onUploadData = async (user) => {

    try {
        console.log(user, props.user)
        const body = {
            'plant_name' : identification.plant_name,
            'common_name': identification.common_name,
            'plant_details': note,
            'user': props.user.email,
            'image': imageAsUrl,
            'latitude': center[1],
            'longitude':center[0]
        }

        console.log(body)
        const response = await fetch(`https://${SERVER}/pins/upload`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        console.log(response)

        handleClose()
        reloadFunction()

    } catch (err){
        console.log(err)
    }
  }

  const handleSubmit = async () => {
    setOpen(true)

    // check if signed in, if not, vreate anonymous session
    handleFireBaseUpload()
   
    // props.handleClose();

  };



  const steps = ['Identify Plant', 'Upload plant to your location'];

  const getStepContent = (step) => {
    switch (step) {
      
      case 0:
        return <form>
           
            <input
                type="file"
                onChange={handleImageAsFile}
                // hidden
            />
          
            <div>
                <TextField id="standard-required" label="Caption" defaultValue={""} onChange={e => setNote(e.target.value)} />
            </div>


        </form>;
      case 1:
        return <div>
               
                  <div className={classes.root}>
                  <GridList cellHeight={300} className={classes.gridList} cols = {1}>
                    <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                    <ListSubheader component="div">{identification.common_name} ({identification.plant_name})</ListSubheader>
                    <ListSubheader component="div">Similar Images</ListSubheader>

                    </GridListTile>
                    {identification.wiki_images ? identification.wiki_images.map((tile, i) => (
                      <GridListTile key={i}>
                        <img src={tile.value} alt={tile.citation} />
                        <GridListTileBar
                          subtitle = {tile.citation}
                          // actionIcon={
                            
                          // }
                        />
                      </GridListTile>
                    )): ""}
                  </GridList>
                </div>

            </div>
      default:
        return 'Unknown step';
    }
  }
  
  const [open, setOpen] = useState(false)

  const handleCloseHere = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    // Update the document title using the browser API
    if (uploadStatus == "success") {
      // props.handleClose()
      // props.reloadFunction();
    }
    
  }, [uploadStatus]);

  useEffect(() => {
    // Update the document title using the browser API
    
    
  }, [identification]);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                 
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={activeStep === steps.length - 1 ? handleUpload : handleSubmit}
                    className={classes.button}
                    // disabled={uploadStatus != ""}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Snackbar open={open} 
       message={uploadStatus}
       action={
         <React.Fragment>
           <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseHere}>
             <CloseIcon fontSize="small" />
           </IconButton>
         </React.Fragment>
       }>
       
      </Snackbar>
    
    </div>
  );
}

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);
  
export default function CustomizedDialogs(props) {
    const {user, center} = props 
  
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" color="primary" disabled={!props.user} onClick={handleClickOpen}>
          Upload Plant 
        </Button>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            New Plant Profile
          </DialogTitle>
          <DialogContent dividers>
            <VerticalLinearStepper handleClose= {handleClose} user={user} setUserFunction={props.setUserFunction} reloadFunction={props.reloadFunction} center={center}/>
          </DialogContent>
          {/* <DialogActions>
         
          </DialogActions> */}
        </Dialog>
      </div>
    );
  }
  