const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port  =process.env.PORT || 5000



// middleware

app.use(cors())
app.use(express.json())


// mongo connect

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.osztyuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const touristSpotCollection = client.db('tourDB').collection('tour')
    const countrySpotCollection = client.db('countryDB').collection('country')

    app.get('/addSpots', async(req , res)=>{
        const cursor = touristSpotCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/addSpots/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)};
      const spot = await touristSpotCollection.findOne(query);
      res.send(spot)
    })

    app.post('/addSpots', async(req,res)=>{
        const newSpot =req.body;
       const result =await  touristSpotCollection.insertOne(newSpot);
       res.send(result);
    });

  //  country add
    app.post('/addCountry', async(req,res)=>{
      const country = req.body;
      const result =await countrySpotCollection.insertOne(country)
      res.send(result)
    });
    app.get('/addCountry', async(req, res)=>{
      const cursor =countrySpotCollection.find();
      const result =await cursor.toArray();
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


app.get ('/', (req ,res)=>{
    res.send('server running')
})

app.listen(port ,()=>{
    console.log(`Server running on the port: ${port}`)
})