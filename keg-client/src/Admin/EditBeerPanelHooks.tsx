import React, { useState, useCallback, useReducer, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Beer } from '../ServerModels';
import { saveBeer, patchBeer, deleteBeer } from '../lib/ApiClient';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import { EditBeerPanelProps } from './EditBeerPanel';

const emptyBeer = { name: '', brewer: '', image: '', bitterness: 0, abv: 0, style: '', description: '' };
export function EditBeerPanelHooks(props: EditBeerPanelProps) {
  useReducer
  const [id, setId] = useState('new');
  const [name, setName] = useState('');
  const [brewer, setBrewer] = useState('');
  const [image, setImage] = useState('');
  const [bitterness, setBitterness] = useState('');
  const [abv, setAbv] = useState('');
  const [style, setStyle] = useState('');
  const [description, setDescription] = useState('');

  const handleBeerSelect = (event: any) => {
    const id = event.target.value;

    const beer = id === 'new' ? emptyBeer : props.beers.find(b => b._id === id);
    if (!beer) throw new Error('Could not find beer by id');

    setId(id);
    setName(beer.name);
    setBrewer(beer.brewer);
    setImage(beer.image);
    setBitterness(beer.bitterness.toString());
    setAbv(beer.abv.toString());
    setStyle(beer.style);
    setDescription(beer.description);
  };

  const handleDelete = async () => {
    await deleteBeer(id);
    setId('new');
    props.onBeerModified();
  };

  const handleCreateClicked = async () => {
    const payload: Partial<Beer> = {
      name,
      brewer,
      description,
      image,
      style,
      abv: Number(abv),
      bitterness: Number(bitterness),
    };

    const newBeer = await saveBeer(payload);
    setId(newBeer._id);
    props.onBeerModified();
  };

  const handleUpdateClicked = async () => {
    const payload: Partial<Beer> = {
      name,
      brewer,
      description,
      image,
      style,
      abv: Number(abv),
      bitterness: Number(bitterness),
    };
    await patchBeer(id, payload);
    props.onBeerModified();
  };

  const handleChange = useCallback((value: string, field: string) => {
    dispatch({type: 'field change', payload: {field, value}})
  }, [dispatch])

  const handleFieldChange = useMemo(() => {
    return (key: string) => (event: React.SyntheticEvent) => handleChange(event.target.value, key)
  }, [handleChange])

  return (
    <div>
      <div>
        <FormControl className="admin-select admin-control">
          <InputLabel htmlFor="beer">Manage Beer</InputLabel>
          <Select value={id} onChange={handleBeerSelect} id="beer">
            <MenuItem value="new">Create New Beer</MenuItem>
            {props.beers!.map(b => (
              <MenuItem value={b._id} key={b._id}>
                {b.brewer} - {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={name}
        onChange={handleFieldChange('name')}
      />
      <TextField
        label="Brewer"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={brewer}
        onChange={e => setBrewer(e.target.value)}
      />
      <TextField
        label="Image URL"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={image}
        onChange={e => setImage(e.target.value)}
      />
      <TextField
        label="Bitterness"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={bitterness}
        onChange={e => setBitterness(e.target.value)}
      />
      <TextField
        label="ABV"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={abv}
        onChange={e => setAbv(e.target.value)}
      />
      <TextField
        label="Style"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={style}
        onChange={e => setStyle(e.target.value)}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        className="admin-control"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      {id !== 'new' ? (
        <Button variant="contained" color="primary" className="admin-action-button" onClick={handleUpdateClicked}>
          Update Beer
        </Button>
      ) : (
        <Button variant="contained" color="primary" className="admin-action-button" onClick={handleCreateClicked}>
          Create Beer
        </Button>
      )}

      {id !== 'new' ? (
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          Delete Beer <Icon>delete</Icon>
        </Button>
      ) : null}
    </div>
  );
}
