import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Beer, Tap, TapDescription, Tapped } from '../ServerModels';
import { markTapEmpty, getTaps, tapKeg as tapKeyApi } from '../lib/ApiClient';

export interface TapMaintenancePanelState {
  id?: string;
  taps: TapDescription;
}

export interface TapMaintenancePanelProps {
  beers: Beer[];
}

export class TapMaintenancePanel extends React.Component<TapMaintenancePanelProps, TapMaintenancePanelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: '',
      taps: [null, null],
    };
  }

  componentDidMount() {
    this.loadTaps();
  }

  async loadTaps() {
    const taps = await getTaps();
    this.setState({ taps });
  }

  handleBeerSelect = (event: any) => {
    const id = event.target.value;
    this.setState({
      id,
    });
  };

  async markEmpty(tap: Tap) {
    await markTapEmpty(tap);
    await this.loadTaps();
  }

  async tapKeg(tap: Tap, beerId: string) {
    await tapKeyApi(tap, beerId);
    await this.loadTaps();
  }

  get leftTap() {
    return this.state.taps[0];
  }

  get rightTap() {
    return this.state.taps[1];
  }

  describeTap(tap: Tapped | null) {
    if (!tap) {
      return 'Nothing';
    }

    if (tap.emptied) {
      return `${tap.beer.name} (Empty)`;
    }

    return tap.beer.name;
  }

  render() {
    return (
      <div>
        <h2>Maintain Taps</h2>
        <div>
          <p>Left: {this.describeTap(this.leftTap)}</p>
          <p>Right: {this.describeTap(this.rightTap)}</p>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            className="admin-action-button"
            onClick={() => this.markEmpty('left')}
          >
            Mark Left Empty
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="admin-action-button"
            onClick={() => this.markEmpty('right')}
          >
            Mark Right Empty
          </Button>
        </div>

        <div>
          <FormControl className="admin-select admin-control">
            <InputLabel htmlFor="age-simple">Tap a Keg</InputLabel>
            <Select value={this.state.id} onChange={this.handleBeerSelect}>
              {this.props.beers!.map(b => (
                <MenuItem value={b._id} key={b._id}>
                  {b.brewer} - {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            className="admin-action-button"
            disabled={!this.state.id}
            onClick={() => this.tapKeg('left', this.state.id!)}
          >
            Tap Left Keg
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="admin-action-button"
            disabled={!this.state.id}
            onClick={() => this.tapKeg('right', this.state.id!)}
          >
            Tap Right Keg
          </Button>
        </div>
      </div>
    );
  }
}
