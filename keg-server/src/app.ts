import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import io from 'socket.io';

// Controllers (route handlers)
import * as beerController from './controllers/BeerController';
import * as kegController from './controllers/KegController';
import * as temperatureController from './controllers/TemperatureController';
import * as metadataController from './controllers/MetadataController';

// Create Express server
const app = express();

// Connect to MongoDB

app.set('port', process.env.PORT || 4000);
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */

app.get('/api/beers', beerController.beers);
app.post('/api/beers', beerController.createBeer);
app.patch('/api/beers/:id', beerController.patchBeer);
app.post('/api/beers/:id/upvotes', beerController.upvote);
app.post('/api/beers/:id/downvotes', beerController.downvote);
app.delete('/api/beers/:id', beerController.remove);

app.get('/api/taps', kegController.getTaps);
app.delete('/api/taps/:tap', kegController.markEmpty);
app.put('/api/taps/:tap', kegController.tap);
app.get('/api/taps-log', kegController.getLog);

app.get('/api/temp', temperatureController.getTemperature);
app.get('/api/metadata', metadataController.getMetadata);

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

export default app;
