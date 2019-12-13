import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Beer } from '../ServerModels';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
    margin: theme.spacing(0.25),
  },
  upVoteButton: {
    backgroundColor: '#40BF40',
    '&:hover': {
      background: '#2E892E',
    },
  },
  downVoteButton: {
    backgroundColor: '#BF4040',
    '&:hover': {
      background: '#913131',
    },
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
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
            <Chip icon={<Icon>mood_bad</Icon>} label={beer.bitterness.toFixed(1) + ' IBU'} className={classes.chip} />
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

export interface VoteButtonsProps {
  onClick: (isUpVote: boolean) => void;
  upVotes: number;
  downVotes: number;
}

function VoteButtons(props: VoteButtonsProps) {
  const classes = useStyles();

  const handleUpVote = () => {
    props.onClick(true);
  };

  const handleDownVote = () => {
    props.onClick(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup>
        <Button
          size="small"
          color="primary"
          variant="contained"
          className={clsx(classes.button, classes.upVoteButton)}
          onClick={handleUpVote}
        >
          <Icon className={clsx(classes.leftIcon, classes.iconSmall)}>thumb_up</Icon>
          {props.upVotes}
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          className={clsx(classes.button, classes.downVoteButton)}
          onClick={handleDownVote}
        >
          <Icon className={clsx(classes.leftIcon, classes.iconSmall)}>thumb_down</Icon>
          {props.downVotes}
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
}
