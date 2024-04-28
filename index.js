const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7qmkns.mongodb.net/?retryWrites=true&w=majority&appName=cluster0`;

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

        const paintingAndDrawing = client.db("paintingAndDrawing").collection("craftItemsDB");

        app.get('/craftItems', async (req, res) => {
            const result = await paintingAndDrawing.find().toArray();
            res.send(result)
        })

        app.get('/craftItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await paintingAndDrawing.findOne(query);
            res.send(result)
        })

        app.get('/myCraftItems/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { user_email: email };
            const result = await paintingAndDrawing.find(query).toArray();
            res.send(result)
        })

        app.post('/craftItems', async (req, res) => {
            const newCraftItems = req.body;
            console.log(newCraftItems);
            const result = await paintingAndDrawing.insertOne(newCraftItems);
            res.send(result)
        })

        app.get('/myCraftItems/:email/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.params.email;
            console.log(email)
            const query = { _id: new ObjectId(id), user_email: email };
            const result = await paintingAndDrawing.findOne(query);
            res.send(result)
        })

        app.put('/myCraftItems/:email/:id', async (req, res) => {
            const craftItem = req.body;
            const id = req.params.id;
            const email = req.params.email;
            const filter = { _id: new ObjectId(id), user_email: email };
            const options = { upsert: true };
            const updateCraftItem = {
                $set: {
                    item_name: craftItem.item_name,
                    subcategory_Name: craftItem.subcategory_Name,
                    short_description: craftItem.short_description,
                    image: craftItem.image,
                    price: craftItem.price,
                    rating: craftItem.rating,
                    customization: craftItem.customization,
                    processing_time: craftItem.processing_time,
                    stockStatus: craftItem.stockStatus,
                }
            };
            const result = await paintingAndDrawing.updateOne(filter, updateCraftItem, options);
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


app.get('/', (req, res) => {
    res.send('Assignment ten server is running.!')
})

app.listen(port, () => {
    console.log(`Assignment ten server is running on port: ${port}`)
})