# NodeApiGateway

This is a experimental implementation of a nodejs based API Gateway server. This project was generated using [Nx](https://nx.dev). This project has to two main apps/components. The API responsible for CRUD operations on the data held in a MongoDb database for the functioning of the Gateway. The second is UI/Frontend app that constitutes the dashboard for managing the various app related data for the Gateway.

## API

The `API` is build typescript and Express server. It runs CRUD operations and connects to the [MongoDb database of your choosing](#mongo-db).

## Gateway Admin

The Gateway Admin is the UI dashboard to add/remove application/service to the gateway. The public & secret keys are auto generated. 


# Installation

To install simply clone/fork this repository and cd into the relavent directory. Before we can run the application we need to generate security keys for the applications security and we also need a MongoDb Database. You can manually install MongoDb from the [MongoDb Installation Page](https://docs.mongodb.com/manual/installation/) using the instructions given there for your device or you could use the cloud based solution such as [Atlas](https://www.mongodb.com/atlas/database). 

## Generate Keys

To run the application we need to generate some public/secret keys required for Authentication on the application. To generate this you can run `npm run authSetup`. This will generate a `.env` file with required information (except the mongoDb connection string). 

## Mongo DB

This application requires that you have a MongoDb database running locally or using the cloud based solutions such as [Atlas](https://www.mongodb.com/atlas/database). Once you have an instance of MongoDb running you can generate the connection string. On [Atlas](https://www.mongodb.com/atlas/database) this can be obtained from the Dasboard via the (Project >> Databases >> Cluster0 >>) "Connect" button. In the subsequent dialog that appears choose "Connect your application". This should reveal a connection string template of type - `mongodb+srv://<username>:<password>@<address.com>/<database_name>?retryWrites=true&w=majority`. You will need to copy this string (and replace the template values with your own values) and paste it in the `.env` file, replacing the generated value for `MONGO_CONNECTION_STRING`.

## Running the application

Once the above steps have been implemented. Ensure that you have NX installed globally by running `npm install -g nx`. You'll need to open 2 terminal windows in the shell of your choosing and cd into the directory where the code was cloned. Once in the root of this directory, in one shell you can run `nx serve api`, this will spin up the API and connect it to the MongoDB, and in the other run `nx serve api-gateway-admin`, which will spin up the gateway admin client(dashboard). Now you can will see the App running on http://localhost:4200.
**Note:** Only the first user and an authenticated Admin can register a new user. The very first user to register on the database is automatically considered an admin. 


## Author
#### Shalom Sam
+ Checkout my <a href="https://shalomsam.com" title="Full Stack Web Developer, UI/UX Javascript Specialist" target="_blank">Full Stack Web Developer Website</a>
+ You can checkout this <a href="http://react.shalomsam.com" title="Full Stack Developer, Angular Portfolio" target="_blank">React Portfolio here</a>
+ A scope of my work @ <a title="Web Software Developer Portfolio" target="_blank" href="https://react.shalomsam.com/portfolio">React Portfolio</a>


## License
MIT. Copyright (c) 2018 Shalom Sam.


