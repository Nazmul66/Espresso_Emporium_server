const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// console.log(process.env.DB_USER)
// console.log(process.env.PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnkzyeb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("CoffeeDB");
    const userCollection = database.collection("Coffee");

    app.get("/coffees", async(req, res) =>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/coffees/:id", async(req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await userCollection.findOne(query);
         res.send(result);
    })

    app.post("/coffees", async(req, res) =>{
        const coffees = req.body;
        // console.log(coffees)
        const result = await userCollection.insertOne(coffees);
        res.send(result);
    })
    
    app.delete("/coffees/:id", async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })

    app.put("/coffees/:id", async(req, res) =>{
       const id = req.params.id;
       const updateItem = req.body;
       const filter = { _id: new ObjectId(id) };
       const options = { upsert: true };
       const updateCoffee = {
            $set: {
                 name:     updateItem.name,
                 chef:     updateItem.chef,
                 supplier: updateItem.supplier,
                 taste:    updateItem.taste,
                 category: updateItem.category,
                 details:  updateItem.details,
                 photo:    updateItem.photo,
                 price:    updateItem.price,
            }
       };
       const result = await userCollection.updateOne(filter, updateCoffee, options);
       res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
})