import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';

import './AdminPage.css';
import { EditBeerPanel } from './EditBeerPanel';
import { Beer } from '../ServerModels';
import { getBeers } from '../lib/ApiClient';
import { TapMaintenancePanel } from './TapMaintenancePanel';
import { TapMaintenancePanelHooks } from './TapMaintenancePanelHooks';
import { EditBeerPanelHooks } from './EditBeerPanelHooks';

interface AdminPageState {
  beers: Beer[];
}

export class AdminPage extends React.Component<any, AdminPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      beers: [],
    };
  }

  render() {
    return (
      <Container>
        <h1>Admin Page</h1>
        <EditBeerPanel beers={this.state.beers} onBeerModified={this.handleBeerModified} />
        <TapMaintenancePanel beers={this.state.beers} />
      </Container>
    );
  }

  componentDidMount() {
    this.loadBeers();
  }

  handleBeerModified = () => {
    this.loadBeers();
  };

  async loadBeers() {
    const beers = await getBeers();
    this.setState({ beers });
  }
}

export function AdminPageHook(props: any) {
  const [beers, setBeers] = useState([] as Beer[]);

  async function fetchBeers() {
    const beers = await getBeers();
    setBeers(beers);
  }

  useEffect(() => {
    fetchBeers();
  }, []);

  function handleBeerModified() {
    fetchBeers();
  }

  return (
    <Container>
      <h1>Admin Page</h1>
      <EditBeerPanelHooks beers={beers} onBeerModified={handleBeerModified} />
      <TapMaintenancePanelHooks beers={beers} />
    </Container>
  );
}
