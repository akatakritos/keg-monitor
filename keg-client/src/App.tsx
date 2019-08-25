import React from 'react';
import './App.css';
import { Beer } from './Beer';
import Grid from '@material-ui/core/Grid';

const App: React.FC = () => {
  const ipAddress = '192.16.8.0.1';
  const temp = 45;
  return (
    <div>
      <Grid container spacing={1} justify="space-evenly">
        <Grid item xs>
          <Beer
            name="Boulevard Wheat"
            brewer="Boulevard"
            image="https://www.boulevard.com/wp-content/uploads/2010/07/Unfiltered-Wheat.png"
            description="blah blah"
            bitterness={0}
            abv={4.2}
            beerStyle="wheat"
            tapped="2019-08-23"
          />
        </Grid>
        <Grid item xs>
          <Beer
            name="Boulevard Wheat"
            brewer="Boulevard"
            image=""
            description="blah blah"
            bitterness={0}
            abv={4.2}
            beerStyle="wheat"
            tapped="2019-08-23"
          />
        </Grid>
      </Grid>

      <p>
        IP: {ipAddress}
        Temp: {temp.toFixed(1)}&deg;F
      </p>
    </div>
  );
};

export default App;
