import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Beer } from '../ServerModels';
import { saveBeer, patchBeer, deleteBeer } from '../lib/ApiClient';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';

export interface EditBeerPanelState {
  id?: string;
  name: string;
  brewer: string;
  image: string;
  bitterness: string;
  abv: string;
  style: string;
  description: string;
}

export interface EditBeerPanelProps {
  beers: Beer[];
  onBeerModified: () => void;
}

export class EditBeerPanel extends React.Component<EditBeerPanelProps, Partial<EditBeerPanelState>> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: 'new',
      name: '',
      brewer: '',
      image: '',
      bitterness: '0',
      abv: '0',
      style: '',
      description: '',
    };
  }

  handleTextChange = (key: keyof EditBeerPanelState) => {
    return (event: any) => {
      this.setState({
        [key]: event.target.value as string,
      });
    };
  };

  handleCreateClicked = async () => {
    const payload: Partial<Beer> = {
      name: this.state.name,
      brewer: this.state.brewer,
      description: this.state.description,
      image: this.state.image,
      style: this.state.style,
      abv: Number(this.state.abv || 0) as number,
      bitterness: Number(this.state.bitterness || 0),
    };
    const newBeer = await saveBeer(payload);
    this.setState({ id: newBeer._id });
    this.props.onBeerModified();
  };

  handleUpdateClicked = async () => {
    const payload: Partial<Beer> = {
      name: this.state.name,
      brewer: this.state.brewer,
      description: this.state.description,
      image: this.state.image,
      style: this.state.style,
      abv: Number(this.state.abv || 0) as number,
      bitterness: Number(this.state.bitterness || 0),
    };
    await patchBeer(this.state.id!, payload);
    this.props.onBeerModified();
  };

  handleBeerSelect = (event: any) => {
    const empty = { name: '', brewer: '', image: '', bitterness: '0', abv: '0', style: '', description: '' };
    const id = event.target.value;
    const data: any =
      id === 'new'
        ? empty
        : {
            ...this.props.beers!.find(b => b._id === id),
          };
    this.setState({
      id,
      ...data,
    });
  };

  handleDelete = async () => {
    await deleteBeer(this.state.id!);
    this.setState({ id: 'new' });
    this.props.onBeerModified();
  };

  render() {
    return (
      <div>
        <div>
          <FormControl className="admin-select admin-control">
            <InputLabel htmlFor="age-simple">Manage Beer</InputLabel>
            <Select value={this.state.id} onChange={this.handleBeerSelect}>
              <MenuItem value="new">Create New Beer</MenuItem>
              {this.props.beers!.map(b => (
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
          value={this.state.name}
          onChange={this.handleTextChange('name')}
        />
        <TextField
          label="Brewer"
          variant="outlined"
          fullWidth
          className="admin-control"
          value={this.state.brewer}
          onChange={this.handleTextChange('brewer')}
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          className="admin-control"
          value={this.state.image}
          onChange={this.handleTextChange('image')}
        />
        <TextField
          label="Bitterness"
          variant="outlined"
          fullWidth
          className="admin-control"
          value={this.state.bitterness}
          onChange={this.handleTextChange('bitterness')}
        />
        <TextField
          label="ABV"
          variant="outlined"
          fullWidth
          className="admin-control"
          value={this.state.abv}
          onChange={this.handleTextChange('abv')}
        />
        <TextField
          label="Style"
          variant="outlined"
          fullWidth
          className="admin-control"
          value={this.state.style}
          onChange={this.handleTextChange('style')}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          className="admin-control"
          value={this.state.description}
          onChange={this.handleTextChange('description')}
        />
        {this.state.id !== 'new' ? (
          <Button
            variant="contained"
            color="primary"
            className="admin-action-button"
            onClick={this.handleUpdateClicked}
          >
            Update Beer
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className="admin-action-button"
            onClick={this.handleCreateClicked}
          >
            Create Beer
          </Button>
        )}

        {this.state.id !== 'new' ? (
          <Button variant="contained" color="secondary" onClick={this.handleDelete}>
            Delete Beer <Icon>delete</Icon>
          </Button>
        ) : null}
      </div>
    );
  }
}
