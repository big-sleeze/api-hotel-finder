src/config: This folder typically contains configuration files for your application. The config.ts file likely includes settings for your application, such as database configuration, API keys, or other settings blog.logrocket.com.
src/controllers: Controllers accept input and convert it to commands for the model or view. In the context of an Express.js application, controllers are where you define your app's routes and their behaviors. Although this folder is empty in your case, it might later contain files for handling various routes in your application stackoverflow.com.
src/library: This folder could contain custom classes or functions that can be used across your application. The logger.ts file likely includes functionality for logging, such as writing logs to a file or displaying them in the console stackoverflow.com.
src/middleware: Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. These functions can execute any code, make changes to the request and response objects, end the request-response cycle, or call the next function in the stack. If necessary, they can be used for things like error handling, logging, or user authentication blog.logrocket.com.
src/models: The models directory usually contains data models for your application, which represent the data structures you're working with. The person.ts file probably defines a Person model, which might represent a person in your application stackoverflow.com.
src/routers: This folder might contain routing logic for your application. In an Express.js app, routers determine how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, etc.) blog.logrocket.com.

src/config:
export const config = {
database: {
host: 'localhost',
port: 5432,
user: 'user',
password: 'password',
database: 'hotel_db'
},
port: 3000
};

src/config: This directory could include a config.ts file containing configuration settings for your application. For a hotel API, this might include database connection settings, API keys, or other configuration settings. Here's an example of what config.ts might look like:
export const config = {
database: {
host: 'localhost',
port: 5432,
user: 'user',
password: 'password',
database: 'hotel_db'
},
port: 3000
};

src/controllers: This folder will likely contain files that handle requests and responses for your API. For a hotel API, you might have a hotelController.ts file with methods for creating, reading, updating, and deleting hotels. An example method might look like this:
export function getAllHotels(req, res) {
// Code to fetch all hotels from the database and return them
}

src/controllers: This folder will contain the logic for handling requests to your API. Let's consider a controller for handling CRUD operations on hotels. Here's a more detailed example blog.logrocket.com:
// controllers/hotelController.ts
import { Request, Response } from 'express';
import { Hotel } from '../models/hotel';

export const getHotels = async (req: Request, res: Response) => {
const hotels = await Hotel.find(); // fetch all hotels from the database
res.json(hotels);
};

export const getHotel = async (req: Request, res: Response) => {
const hotel = await Hotel.findById(req.params.id); // fetch a single hotel by its ID
res.json(hotel);
};

export const createHotel = async (req: Request, res: Response) => {
const hotel = new Hotel(req.body); // create a new hotel
await hotel.save();
res.status(201).json(hotel);
};

export const updateHotel = async (req: Request, res: Response) => {
const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // update a hotel by its ID
res.json(hotel);
};

export const deleteHotel = async (req: Request, res: Response) => {
await Hotel.findByIdAndRemove(req.params.id); // delete a hotel by its ID
res.status(204).json();
};
Then, you would use these controller functions in your hotel routes file:

// routers/hotelRouter.ts
import express from 'express';
import \* as hotelController from '../controllers/hotelController';

const router = express.Router();

router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotel);
router.post('/', hotelController.createHotel);
router.put('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

export default router;

src/library: This folder could contain utility files like logger.ts, which might include a class or functions for logging messages to the console or a file. An example logger.ts file might look like this:
export function log(message: string) {
console.log(`[${new Date().toISOString()}] ${message}`);
}

src/middleware: This folder will contain middleware functions for your application. Middleware functions can perform operations on the request and response objects, end the request-response cycle, or call the next function in the stack. For your hotel API, you might have middleware for authenticating users or logging requests. Here's an example of what an authentication middleware might look like:
export function authenticate(req, res, next) {
// Code to authenticate the user
if (req.isAuthenticated()) {
return next();
}
res.redirect('/login');
}

src/middleware: Let's consider a middleware function for error handling in your hotel API. This function might catch any errors that occur during the processing of a request and send an appropriate response to the client. Here is an example turing.com:
// middleware/errorHandler.ts
export function errorHandler(err, req, res, next) {
if (res.headersSent) {
return next(err);
}
console.error(err);
res.status(500);
res.json({ error: 'An error occurred in the server' });
}
Then, you would use this middleware in your main server file (assuming it's named app.ts):

// app.ts
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
const app = express();
app.use(errorHandler);

src/models: This folder will contain data models for your API. For a hotel API, you might have a hotel.ts file that defines a Hotel model. Here's an example of what that might look like:
export interface Hotel {
id: number;
name: string;
address: string;
city: string;
country: string;
stars: number;
hasSpa: boolean;
hasPool: boolean;
priceCategory: number;
}

src/routers: This folder will contain routing logic for your API. You might have a hotelRouter.ts file that defines routes for creating, reading, updating, and deleting hotels. Here's an example of what that might look like:
import express from 'express';
import \* as hotelController from '../controllers/hotelController';

const router = express.Router();

router.get('/hotels', hotelController.getAllHotels);
router.post('/hotels', hotelController.createHotel);
router.get('/hotels/:id', hotelController.getHotel);
router.put('/hotels/:id', hotelController.updateHotel);
router.delete('/hotels/:id', hotelController.deleteHotel);

export default router;
