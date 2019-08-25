import React from 'react';
import './App.css';
import { BeerBlock } from './BeerBlock';
import Grid from '@material-ui/core/Grid';
import { Tapped } from './server-models';
import io from 'socket.io-client';

type TapDescription = [Tapped | null, Tapped | null];

const socket = io('http://localhost:4000');
socket.on('temp', (payload: any) => {
  console.log('temp', payload);
});

export async function getTaps(): Promise<TapDescription> {
  const response = await fetch('http://localhost:4000/api/taps');
  return await response.json();
}

export async function getTemp(): Promise<number> {
  const response = await fetch('http://localhost:4000/api/temp');
  const body = await response.json();
  return body.temperature;
}

interface AppState {
  taps: TapDescription;
  temperature: number;
}

class App extends React.Component<any, AppState> {
  socket: SocketIOClient.Socket;

  constructor(props: any) {
    super(props);

    this.state = {
      taps: [null, null],
      temperature: 0,
    };

    const socket = io('http://localhost:4000');
    socket.on('temp', (payload: any) => {
      this.setState({ temperature: payload.temperature });
    });

    this.socket = socket;
  }

  async componentDidMount() {
    const taps = await getTaps();
    const temperature = await getTemp();
    this.setState({
      taps,
      temperature,
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    const ipAddress = '192.16.8.0.1';

    const taps = this.state.taps;
    const left = taps[0];
    const right = taps[1];

    return (
      <div>
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
              />
            ) : (
              <p>No beer</p>
            )}
          </Grid>
        </Grid>

        <p>
          IP: {ipAddress}
          Temp: {this.state.temperature.toFixed(1)}&deg;F
        </p>
      </div>
    );
  }
}

export default App;
