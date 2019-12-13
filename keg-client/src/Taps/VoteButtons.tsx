import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles(theme => ({
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
}));

export interface VoteButtonsProps {
  onClick: (isUpVote: boolean) => void;
  upVotes: number;
  downVotes: number;
}

export function VoteButtons(props: VoteButtonsProps) {
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
