import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';

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
  image: string;
  name: string;
  brewer: string;
  description: string;
  bitterness: number;
  abv: number;
  beerStyle: string;
  tapped: string;
}

export function BeerBlock(props: BeerProps) {
  const classes = useStyles();
  const today = new Date();
  const tapped = parseISO(props.tapped);
  const age = differenceInDays(today, tapped);

  return (
    <Card className={classes.card}>
      <div className={classes.centered}>
        <img src={props.image} height="220" />
      </div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.name}
        </Typography>
        <Typography variant="body2" component="p">
          {props.brewer}
        </Typography>
        <div>
          {props.beerStyle ? <Chip icon={<Icon>local_drink</Icon>} label={props.beerStyle} /> : null}
          {props.abv ? <Chip icon={<Icon>sentiment_satisfied</Icon>} label={props.abv.toFixed(1) + '% ABV'} /> : null}
          {props.bitterness ? (
            <Chip icon={<Icon>sentiment_dissatisfied</Icon>} label={props.bitterness.toFixed(1) + ' BTU'} />
          ) : null}
          <Chip icon={<Icon>today</Icon>} label={age + ' days ago'} />
        </div>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}

function VoteButtons() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Button size="small" color="primary" variant="contained" className={classes.button}>
        <Icon className={clsx(classes.leftIcon, classes.iconSmall)}>thumb_up</Icon>
        Great!
      </Button>
      <Button size="small" color="secondary" variant="contained" className={classes.button}>
        <Icon className={clsx(classes.leftIcon, classes.iconSmall)}>thumb_down</Icon>
        Meh.
      </Button>
    </React.Fragment>
  );
}
