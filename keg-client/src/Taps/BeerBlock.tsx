import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import HopIcon from '../hop_icon.png';
import { Beer } from '../ServerModels';
import './BeerBlock.css';
import { VoteButtons } from './VoteButtons';

const useStyles = makeStyles(theme => ({
  card: {},
  centered: {
    textAlign: 'center',
  },
  beerName: {
    flexGrow: 1,
  },
  chip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  hop: {
    width: '25px',
  },
}));

export interface BeerBlockProps {
  beer: Beer;
  tapped: string;
  emptied?: string;
  voteHandler: (id: string, isUpVote: boolean) => Promise<void>;
}

export function BeerBlock(props: BeerBlockProps) {
  const classes = useStyles();
  const today = new Date();
  const tapped = parseISO(props.tapped);
  const age = differenceInDays(today, tapped);
  const beer = props.beer;
  const upVotes = beer.upvotes || 0;
  const downVotes = beer.downvotes || 0;
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
        <Box display="flex" flexWrap="nowrap">
          <Typography variant="h5" component="h2" className={classes.beerName}>
            {beer.name}
          </Typography>
          <VoteButtons onClick={onVoteButtonClick} upVotes={upVotes} downVotes={downVotes} />
        </Box>
        <Typography gutterBottom variant="body2" component="p">
          {beer.brewer}
        </Typography>
        <Box>
          {beer.style ? <Chip icon={<Icon>local_drink</Icon>} label={beer.style} className={classes.chip} /> : null}
          {beer.abv ? (
            <Chip
              icon={<Icon>sentiment_very_satisfied</Icon>}
              label={beer.abv.toFixed(1) + '% ABV'}
              className={classes.chip}
            />
          ) : null}
          {beer.bitterness ? (
            <Chip
              icon={<img className={classes.hop} src={HopIcon} />}
              label={beer.bitterness.toFixed(1) + ' IBU'}
              className={classes.chip}
            />
          ) : null}
          <Chip icon={<Icon>today</Icon>} label={age + ' days ago'} />
        </Box>
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
