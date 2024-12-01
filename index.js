// Importing required modules and libraries
const express = require("express"); // Express framework for building APIs.
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS).
require("dotenv").config(); // Loads environment variables from a `.env` file.

const app = express(); // Creates an Express application.
const port = process.env.PORT || 5000; // Sets the port from environment variables or defaults to 5000.

app.use(cors()); // Enables CORS for all routes to allow cross-origin requests.
app.use(express.json()); // Middleware to parse incoming JSON data in request bodies.

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import MongoDB client and utilities for database interaction.

// MongoDB connection URI with credentials from environment variables.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6qv7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri); // Logs the URI for debugging (remove this in production).

// Create a MongoClient instance with Stable API settings.
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1, // Specifies MongoDB API version.
    strict: true, // Enables strict mode for API.
    deprecationErrors: true, // Throws errors for deprecated methods.
  },
});

// Define an asynchronous function to handle database operations.
async function run() {
  try {
    // Connect the client to the MongoDB server.
    await client.connect();

    // Define database and collection references.
    const coffeeCollection = client.db("coffeeDB").collection("coffee"); // For storing coffee-related data.
    const userCollection = client.db("coffeeDB").collection("user"); // For storing user data.

    // Route to fetch all coffee data.
    app.get("/addCoffee", async (req, res) => {
      const cursor = coffeeCollection.find(); // Retrieves all documents from the collection.
      const result = await cursor.toArray(); // Converts the cursor to an array of documents.
      res.send(result); // Sends the data back to the client.
    });

    // Route to fetch a single coffee entry by ID.
    app.get("/addCoffee/:id", async (req, res) => {
      const id = req.params.id; // Extracts the ID from the URL parameter.
      const query = { _id: new ObjectId(id) }; // Converts the string ID to a MongoDB ObjectId.
      const result = await coffeeCollection.findOne(query); // Finds a single document matching the query.
      res.send(result); // Sends the document to the client.
    });

    // Route to add a new coffee entry.
    app.post("/addCoffee", async (req, res) => {
      const addCoffee = req.body; // Extracts the JSON data from the request body.
      console.log(addCoffee); // Logs the data for debugging.
      const result = await coffeeCollection.insertOne(addCoffee); // Inserts the data into the collection.
      res.send(result); // Sends the operation result to the client.
    });

    // Route to delete a coffee entry by ID.
    app.delete("/addCoffee/:id", async (req, res) => {
      const id = req.params.id; // Extracts the ID from the URL parameter.
      const query = { _id: new ObjectId(id) }; // Creates a query to match the document by ID.
      const result = await coffeeCollection.deleteOne(query); // Deletes the matched document.
      res.send(result); // Sends the operation result to the client.
    });

    // Route to update an existing coffee entry.
    app.put("/addCoffee/:id", async (req, res) => {
      const id = req.params.id; // Extracts the ID from the URL parameter.
      const filter = { _id: new ObjectId(id) }; // Creates a filter to match the document by ID.
      const options = { upsert: true }; // If no document matches, inserts a new document.
      const updateCoffee = req.body; // Extracts the JSON data from the request body.
      const coffee = {
        $set: {
          name: updateCoffee.name, // Updates the "name" field.
          supplier: updateCoffee.supplier, // Updates the "supplier" field.
          taste: updateCoffee.taste, // Updates the "taste" field.
          category: updateCoffee.category, // Updates the "category" field.
          details: updateCoffee.details, // Updates the "details" field.
          photo: updateCoffee.photo, // Updates the "photo" field.
        },
      };

      const result = await coffeeCollection.updateOne(filter, coffee, options); // Performs the update operation.
      res.send(result); // Sends the operation result to the client.
    });

    // Route to save a new user in the database.
    app.post("/users", async (req, res) => {
      const addUser = req.body;
      console.log(addUser);
      const result = await userCollection.insertOne(addUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Sends a ping command to MongoDB to verify the connection.
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures the client will close after operations (optional, depending on context).
    // await client.close();
  }
}

// Runs the database connection function and catches errors.
run().catch(console.dir);

// Default route to check if the server is running.
app.get("/", (req, res) => {
  res.send("coffee server is running"); // Sends a simple response message.
});

// Starts the server and listens on the defined port.
app.listen(port, () => {
  console.log(`coffee server port is: ${port}`); // Logs the port for debugging.
});

{
  /**
                 How it works:

Server Setup:

Sets up an Express server with middleware for CORS and JSON parsing.
Loads environment variables for sensitive data like database credentials.
MongoDB Integration:

Uses MongoClient to connect to a MongoDB Atlas cluster.
Defines collections (coffeeCollection and userCollection) for storing data.
API Routes:

GET /addCoffee: Fetches all coffee entries.
GET /addCoffee/:id: Fetches a specific coffee entry by ID.
POST /addCoffee: Inserts a new coffee entry.
DELETE /addCoffee/:id: Deletes a coffee entry by ID.
PUT /addCoffee/:id: Updates an existing coffee entry.
POST /user: Saves user data to the database.
Database Operations:

CRUD operations (find, insertOne, deleteOne, updateOne) are performed on MongoDB collections.
Error Handling and Logging:

Errors are caught and logged via run().catch(console.dir).
Logs key actions for debugging purposes.






  */
}
