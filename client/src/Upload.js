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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
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

  const classes = useStyles();

  // const [currentUser, setCurrentUser] = useState(props.user)
  const [activeStep, setActiveStep] = useState(0);
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState('')
  const [stage, setStage] = useState("Seed")
  const [forSale, setForSale] = useState(false)
  const [plant, setPlant] = useState("")
  const [nickname, setNickname] = useState("")
  const [caption, setCaption] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")

  const storageRef = storage.ref();


  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    setImageAsFile(imageAsFile => (image))
  }

  const handleFireBaseUpload = (user = props.user) => {
    // e.preventDefault()
    console.log('start of upload')
    // async magic goes here...

    if(imageAsFile === '' ) {
        console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
        setUploadStatus("error")
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
            setUploadStatus(progress)
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onPostData = async (downloadURL, user) => {

    try {
        const email = user ? user.email : "anonymous"
        const plantName = plant? plant: "Unknown Plant"

        const body = {
            user_id : email,
            plant: plantName,
            for_sale: forSale,
            image: downloadURL,
            nickname: nickname,
            stage: stage,
            caption: caption
        }

        console.log(body)
        const response = await fetch( "http://localhost:5000/plants", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        console.log(response)

    } catch (err){
        console.log(err)
    }
  }

  const handleSubmit = async () => {
    setOpen(true)

    // check if signed in, if not, vreate anonymous session
    if (!props.user) {
      await firebase.auth().signInAnonymously()
      .then((result) => {
        console.log(result.user)

        const tempUser = {
          'uid': result.user.uid,
          'email': "anon-user-"+result.user.uid,
          'isAnonymous': true
        }
        props.setUserFunction(tempUser)

        handleFireBaseUpload(tempUser)
        // setCurrentUser(tempUser)
        // Signed in..
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message)
        // ...
      });
     
    } else {
      handleFireBaseUpload()
    }
    
   
    // props.handleClose();

  };

  const handleStageChange = (e) => {
    setStage(e.target.value)
  };


  const steps = ['Create a Plant Profile', 'Upload your post'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <form>
                  <div>                 
                       <TextField required id="standard-required" label="Plant" defaultValue="" onChange={e => setPlant(e.target.value)} />
                  </div>
                  <div>
                      <TextField id="standard-required" label="Nickname" defaultValue={""} onChange={e => setNickname(e.target.value)}/>
                  </div>
                  <div>
                  <FormControlLabel
                      control={
                      <Checkbox
                          checked={forSale}
                          onChange={e => {
                              setForSale(e.target.checked)
                          }}
                          name="forSale"
                          color="primary"
                      />
                      }
                      label="For Sale"
                  />
                  </div>
              </form>
      case 1:
        return <form>
           
            <input
                type="file"
                onChange={handleImageAsFile}
                // hidden
            />
             <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Stage</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stage}
                onChange={handleStageChange}
                >
                <MenuItem value='Seed'>Seed</MenuItem>
                <MenuItem value='Seedling'>Seedling</MenuItem>
                <MenuItem value='Flowering'>Flowering</MenuItem>
                <MenuItem value='Fruiting'>Fruiting</MenuItem>
                <MenuItem value='Mature'>Mature</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div>
                <TextField id="standard-required" label="Caption" defaultValue={""} onChange={e => setCaption(e.target.value)} />
            </div>


        </form>;
      default:
        return 'Unknown step';
    }
  }
  
  const [open, setOpen] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    // Update the document title using the browser API
    if (uploadStatus == "success") {
      props.handleClose()
      props.reloadFunction();
    }
    
  }, [uploadStatus]);

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
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    className={classes.button}
                    disabled={uploadStatus != ""}
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
       message={uploadStatus + '%'}
       action={
         <React.Fragment>
           <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
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

    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Upload Plant 
        </Button>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            New Plant Profile
          </DialogTitle>
          <DialogContent dividers>
            <VerticalLinearStepper handleClose= {handleClose} user={props.user} setUserFunction={props.setUserFunction} reloadFunction={props.reloadFunction}/>
          </DialogContent>
          {/* <DialogActions>
         
          </DialogActions> */}
        </Dialog>
      </div>
    );
  }
  