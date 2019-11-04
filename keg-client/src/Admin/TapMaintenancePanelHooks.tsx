import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Beer, Tap, TapDescription, Tapped } from '../ServerModels';
import { markTapEmpty, getTaps, tapKeg as tapKegApi } from '../lib/ApiClient';
import { TapMaintenancePanelProps } from './TapMaintenancePanel';

function describeTap(tap: Tapped | null) {
  if (!tap) {
    return 'Nothing';
  }

  if (tap.emptied) {
    return `${tap.beer.name} (Empty)`;
  }

  return tap.beer.name;
}

export function TapMaintenancePanelHooks(props: TapMaintenancePanelProps) {
  const [leftTap, setLeftTap] = useState(null as Tapped | null);
  const [rightTap, setRightTap] = useState(null as Tapped | null);
  const [id, setId] = useState('');

  useEffect(() => {
    loadTaps();
  }, []);

  const loadTaps = async () => {
    const taps = await getTaps();
    setLeftTap(taps[0]);
    setRightTap(taps[1]);
  };

  const tapKeg = async (tap: Tap, beerId: string) => {
    await tapKegApi(tap, beerId);
    await loadTaps();
  };

  const markEmpty = async (tap: Tap) => {
    await markTapEmpty(tap);
    await loadTaps();
  };

  return (
    <div>
      <h2>Maintain Taps</h2>
      <div>
        <p>Left: {describeTap(leftTap)}</p>
        <p>Right: {describeTap(rightTap)}</p>
      </div>
      <div>
        <Button variant="contained" color="primary" className="admin-action-button" onClick={() => markEmpty('left')}>
          Mark Left Empty
        </Button>
        <Button variant="contained" color="primary" className="admin-action-button" onClick={() => markEmpty('right')}>
          Mark Right Empty
        </Button>
      </div>

      <div>
        <FormControl className="admin-select admin-control">
          <InputLabel htmlFor="age-simple">Tap a Keg</InputLabel>
          <Select value={id} onChange={e => setId(e.target.value as string)}>
            {props.beers!.map(b => (
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
          disabled={!id}
          onClick={() => tapKeg('left', id)}
        >
          Tap Left Keg
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="admin-action-button"
          disabled={!id}
          onClick={() => tapKeg('right', id!)}
        >
          Tap Right Keg
        </Button>
      </div>
    </div>
  );
}
