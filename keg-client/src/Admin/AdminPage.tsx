import React, { useState, useEffect, useCallback } from 'react';
import Container from '@material-ui/core/Container';

import './AdminPage.css';
import { Beer } from '../ServerModels';
import { getBeers } from '../lib/ApiClient';
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
        <EditBeerPanelHooks beers={this.state.beers} onBeerModified={this.handleBeerModified} />
        <TapMaintenancePanelHooks beers={this.state.beers} />
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

  const fetchBeers = useCallback(async () => {
    const beers = await getBeers();
    setBeers(beers);
  }, [setBeers]);

  useEffect(() => {
    fetchBeers();
  }, []);

  const handleBeerModified = useCallback(() => {
    fetchBeers();
  }, [fetchBeers]);

  return (
    <Container>
      <h1>Admin Page</h1>
      <EditBeerPanelHooks beers={beers} onBeerModified={handleBeerModified} />
      <TapMaintenancePanelHooks beers={beers} />
    </Container>
  );
}
