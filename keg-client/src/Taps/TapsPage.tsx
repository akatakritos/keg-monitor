import React from 'react';
import { BeerBlock } from './BeerBlock';
import Grid from '@material-ui/core/Grid';
import { TapDescription } from '../ServerModels';
import * as client from '../lib/ApiClient';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import './TapsPage.css';

interface AppState {
  taps: TapDescription;
  temperature: number;
  ip: string;
}

class TapsPage extends React.Component<any, AppState> {
  socket?: SocketIOClient.Socket;

  constructor(props: any) {
    super(props);

    this.state = {
      taps: [null, null],
      temperature: 0,
      ip: '',
    };
  }

  async componentDidMount() {
    this.socket = client.openSocket();
    this.loadTaps();

    this.socket.on(client.SocketEvents.temperature, (body: any) => {
      this.setState({ temperature: body.temperature });
    });

    this.socket.on(client.SocketEvents.refreshBeers, () => {
      this.loadTaps();
    });

    const metadata = await client.getMetadata();
    this.setState({ ip: metadata.ip });
  }

  async loadTaps() {
    const taps = await client.getTaps();

    this.setState({
      taps,
    });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.close();
  }

  get temperatureStyle() {
    const max = 48; // this or more is pure red
    const min = 42; // this or less is pure green
    let temp = Math.max(min, this.state.temperature);
    temp = Math.min(temp, max);

    const percent = (temp - min) / (max - min);
    const hue = (1 - percent) * 120;
    return { backgroundColor: `hsl(${hue}, 50%, 50%)` };
  }

  render() {
    const taps = this.state.taps;
    const left = taps[0];
    const right = taps[1];

    return (
      <div className="taps-page">
        <div className="taps-page__taps">
          <Grid container spacing={1} justify="space-evenly">
            <Grid item xs>
              {left ? (
                <BeerBlock
                  name={left.beer.name}
                  brewer={left.beer.brewer}
                  image={left.beer.image}
                  description={left.beer.description}
                  bitterness={left.beer.bitterness}
                  abv={left.beer.abv}
                  beerStyle={left.beer.style}
                  tapped={left.tapped}
                  emptied={left.emptied}
                />
              ) : (
                <p>No beer</p>
              )}
            </Grid>
            <Grid item xs>
              {right ? (
                <BeerBlock
                  name={right.beer.name}
                  brewer={right.beer.brewer}
                  image={right.beer.image}
                  description={right.beer.description}
                  bitterness={right.beer.bitterness}
                  abv={right.beer.abv}
                  beerStyle={right.beer.style}
                  tapped={right.tapped}
                  emptied={right.emptied}
                />
              ) : (
                <p>No beer</p>
              )}
            </Grid>
          </Grid>
        </div>
        <div className="taps-page__footer">
          <Chip icon={<Icon>wifi</Icon>} label={this.state.ip} />
          <Chip
            icon={<Icon>settings_input_hdmi</Icon>}
            label={this.state.temperature.toFixed(1) + ' °F'}
            style={this.temperatureStyle}
          />
        </div>
      </div>
    );
  }
}

export default TapsPage;
