import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Beer } from '../ServerModels';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';
import './BeerBlock.css';

const useStyles = makeStyles(theme => ({
  card: {},
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
  centered: {
    textAlign: 'center',
  },
}));

export interface BeerProps {
  beer: Beer;
  tapped: string;
  emptied?: string;
  voteHandler: (id: string, isUpVote: boolean) => Promise<void>;
}

export function BeerBlock(props: BeerProps) {
  const classes = useStyles();
  const today = new Date();
  const tapped = parseISO(props.tapped);
  const age = differenceInDays(today, tapped);
  const beer = props.beer;
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const onVoteButtonClick = (isUpVote: boolean) => {
    props.voteHandler(beer._id, isUpVote);
  };

  return (
    <Card className={classes.card} style={{ position: 'relative' }}>
      {props.emptied ? <EmptyOverlay /> : null}
      <div className={classes.centered}>
        <img src={beer.image} alt={beer.name} className="beer-block__image" onClick={handleDialogOpen} />
      </div>
      <DetailDialog beer={beer} isOpen={isDialogOpen} onClose={handleDialogClose} />
      <CardContent>
        <Typography variant="h5" component="h2">
          {beer.name}
        </Typography>
        <Typography gutterBottom variant="body2" component="p">
          {beer.brewer}
        </Typography>
        <div>
          {beer.style ? <Chip icon={<Icon>local_drink</Icon>} label={beer.style} /> : null}
          {beer.abv ? (
            <Chip icon={<Icon>sentiment_very_satisfied</Icon>} label={beer.abv.toFixed(1) + '% ABV'} />
          ) : null}
          {beer.bitterness ? <Chip icon={<Icon>mood_bad</Icon>} label={beer.bitterness.toFixed(1) + ' IBU'} /> : null}
          <Chip icon={<Icon>today</Icon>} label={age + ' days ago'} />
          <Chip
            icon={<Icon>thumb_up</Icon>}
            label={beer.upvotes ? beer.upvotes : 0}
            onClick={() => onVoteButtonClick(true)}
            style={{ backgroundColor: '#40BF40' }}
            color="secondary"
          />
          <Chip
            icon={<Icon>thumb_down</Icon>}
            label={beer.downvotes ? beer.downvotes : 0}
            onClick={() => onVoteButtonClick(false)}
            style={{ backgroundColor: '#BF4040' }}
            color="secondary"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyOverlay() {
  return (
    <div className="empty-overlay">
      <div className="empty-overlay__text">
        All Gone
        <br />
        <Icon className="empty-overlay__icon">sentiment_very_dissatisfied</Icon>
      </div>
    </div>
  );
}

export interface DetailDialogProps {
  beer: Beer;
  isOpen: boolean;
  onClose: () => void;
}

function DetailDialog(props: DetailDialogProps) {
  const { beer, isOpen, onClose } = props;
  return (
    <Dialog onClose={onClose} aria-labelledby="dialog-title" open={isOpen}>
      <DialogTitle id="dialog-title">
        <Typography gutterBottom variant="h5" component="h2" align="center">
          {beer.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="p" gutterBottom>
          {beer.description || 'No Description Provided.'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface VoteButtonsProps {
  onClick: (isUpVote: boolean) => void;
}

// Changed Chips to be clickable due to real-estate restrictions
// function VoteButtons(props: VoteButtonsProps) {
//   const classes = useStyles();

//   const handleUpVote = () => {
//     props.onClick(true);
//   };

//   const handleDownVote = () => {
//     props.onClick(false);
//   };

//   return (
//     <React.Fragment>
//       <Button size="small" color="primary" variant="contained" className={classes.button} onClick={handleUpVote}>
//         <Icon className={clsx(classes.leftIcon, classes.iconSmall)}>thumb_up</Icon>
//         Great
//       </Button>
//       <Button size="small" color="secondary" variant="contained" className={classes.button} onClick={handleDownVote}>
//         <Icon className={clsx(classes.leftIcon, classes.iconSmall)}>thumb_down</Icon>
//         Meh
//       </Button>
//     </React.Fragment>
//   );
// }
