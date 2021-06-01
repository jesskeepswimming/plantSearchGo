import React, { useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));
  
  export function TitlebarGridList(props) {
    const {itemData} = props

    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <GridList cellHeight={300} className={classes.gridList} cols = {1}>
          <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
          </GridListTile>
          {itemData.map((tile) => (
            <GridListTile key={tile.plant_id}>
              <img src={tile.image} alt={tile.plant_details} />
              <GridListTileBar
                title={tile.plant_name + ', ' + tile.plant_scientific_name}
                // <Typography> variant="subtitle1">{tile.scientific_name}</Typography>
                subtitle = {tile.date_posted + "," + tile.user_id}
                // {
                //     <div>
                //         <Typography variant="caption" >{tile.caption}</Typography>
                //         <Typography fontStyle="italic"> {tile.date_posted}</Typography>
                //     </div>
                // }
                actionIcon={
                  <IconButton aria-label={`info about ${tile.plant_id}`} className={classes.icon}>
                    <FavoriteIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
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
  
export default function PinPlants(props) {
    // const card = props.card
    const {isOpen, pin_id, handleClose, pinPlants} = props
    const [open, setOpen] = React.useState(false);
    const [ itemData, setItemData ] = React.useState([]);

    
    // const onFetchData = async (pin_id) => {

    //     // e.preventDefault();
    //     try {
    //     // const response = await fetch(`http://${SERVER}/posts/${plant_id}`)
    //         // const jsonData = await response.json()
    //         const jsonData = []
    //         console.log(jsonData)
    //         setItemData(jsonData)
    //     } catch (err) {
    //         console.log(err.message)
    //     }
    // }

    useEffect(()=> {
        if (isOpen){
            setOpen(true)
        } 
    }, [isOpen])

    // const handleClickOpen = () => {
    //     onFetchData()
    //     console.log(image, variety, plant, plant_id, user_id, for_sale)
    //     setOpen(true);
    // };


    const handleExit = () => {
      setOpen(false);
      setItemData([])
      handleClose()
      
    };
  
    return (
      <div>
        <Dialog onClose={handleExit} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleExit}>
            {pin_id}
          </DialogTitle>
          <DialogContent dividers>
          {pinPlants ? <TitlebarGridList itemData={pinPlants}/> : ''}
                
          </DialogContent>
          <DialogActions>
            <Button
                onClick={()=> console.log('add plant to this pin')} // to do
            > Add photo</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }