README.md for Node.js, Express, TypeScript, and MongoDB API
Project Title
Hotel Booking API

Description
This API is built using Node.js, Express, TypeScript, and MongoDB. It provides endpoints for fetching available hotels based on location, managing bookings, and other hotel-related operations. It also includes validation and error handling mechanisms.

Table of Contents:
Getting Started
Installation
Running the application
Endpoints
Contributing
Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Installation:

Clone the repository
git clone https://github.com/your-username/your-project-name.git

cd your-project-name
Install the dependencies
npm install

Copy the .env.example file and create a .env file in the root of your project, and fill it with your MongoDB Atlas connection string
and other environment variables:

cp .env.example .env

MONGO_DB=your_database_name
MONGO_USER=your_mongodb_username
MONGO_PW=your_mongodb_password
PORT=your_preferred_port
API_KEY=your_api_key

Running the application
You can start the application using the following command:

npm run start
This will start the API server on the port specified in your .env file.

Endpoints
The API has several endpoints for managing hotels and bookings:

GET /hotels: Fetch all nearby hotels based on latitude and longitude provided as query parameters.
GET /all-hotels: Fetch all hotels from the database.
GET /hotels/:\_id/bookings: Fetch all bookings for a specific hotel.
GET /hotels/:hotelId: Fetch a specific hotel from the database.
GET /bookings/booking: Fetch bookings based on query parameters (personFirstName, personLastName, personId, startDate, endDate).
GET /bookings: Fetch all bookings from the database.
POST /bookings: Create a new booking.
PUT /bookings/:bookingId: Update a specific booking by its ID.
DELETE /bookings/:bookingId: Delete a specific booking by its ID.
Contributing
If you want to contribute to this project and make it better, your help is very welcome. Create a branch on this repository, and once you're done with your changes, open a Pull Request.

License
This project is licensed under the ISC License.

Contact
If you want to contact me, you can reach me at endritlleshi1337@gmail.com.

Acknowledgements
This project was inspired by the need to provide a simple but powerful booking system for hotels.
