import React from 'react';
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
import ListSubheader from '@material-ui/core/ListSubheader';
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
    const itemData = props.itemData
    const {image, variety, plant, plant_id, user_id, for_sale} = props.plant

    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <GridList cellHeight={300} className={classes.gridList} cols = {1}>
          <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
        <ListSubheader component="div">{variety} by {user_id}</ListSubheader>
          </GridListTile>
          {itemData.map((tile) => (
            <GridListTile key={tile.post_id}>
              <img src={tile.image} alt={tile.caption} />
              <GridListTileBar
                title={tile.stage}
                //{<Typography variant="subtitle1">{tile.stage}</Typography>}
                subtitle = {tile.caption + " - " + tile.date_posted}
                // {
                //     <div>
                //         <Typography variant="caption" >{tile.caption}</Typography>
                //         <Typography fontStyle="italic"> {tile.date_posted}</Typography>
                //     </div>
                // }
                actionIcon={
                  <IconButton aria-label={`info about ${tile.caption}`} className={classes.icon}>
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
  
export default function PostDialog(props) {
    // const card = props.card
    const {image, variety, plant, plant_id, user_id, for_sale} = props.card
    const [open, setOpen] = React.useState(false);
    const [ itemData, setItemData ] = React.useState([]);

    
    const onFetchData = async e => {

        // e.preventDefault();
        try {
        const response = await fetch(`http://localhost:5000/posts/${plant_id}`)
        const jsonData = await response.json()

        console.log(jsonData)
        setItemData(jsonData)
        } catch (err) {
        console.log(err.message)
        }
    }
  
    const handleClickOpen = () => {
        onFetchData()
        console.log(image, variety, plant, plant_id, user_id, for_sale)
        setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button color="primary" onClick={handleClickOpen}>
          View
        </Button>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {plant}
          </DialogTitle>
          <DialogContent dividers>
          <TitlebarGridList itemData={itemData} plant ={props.card}/>
                
          </DialogContent>
          <DialogActions>
            {props.card.for_sale ? <Button> Message Seller</Button> : ""}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  