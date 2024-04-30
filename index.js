const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port  =process.env.PORT || 5000



// middleware

app.use(
  cors({
  origin: ['http://localhost:5173', 'https://explore-world-f463f.web.app'],
  credentials: true,
  }),
  )
  
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
    // await client.connect();

    const touristSpotCollection = client.db('tourDB').collection('tour')
    const countrySpotCollection = client.db('countryDB').collection('country')
    // const addCountryDetailsCollection = client.db('detailsDB').collection('Details')

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
  //  sort

  // app.get('/addSpots:cost' , async(req ,res )=>{
  //   const cost = req.params.cost
  //   const sortOptions =
  // })
    
    // app.get ('/CountryDetail/:country',async (res, req)=>{
    //   const spot = await touristSpotCollection.find({country_name: req.params.country}).toArray();
    //   res.send(spot)
    // })
    // app.post('/addCountryDetails', async(req, res )=>{
    //   const details =req.body;
    //   const result = await addCountryDetailsCollection.insertOne(details);
    //   res.send(result)
    // });
    // app.get('/addCountryDetails', async(req,res)=>{
    //   const cursor = addCountryDetailsCollection.find();
    //   const result =await cursor.toArray();
    //   res.send(result)
    // })

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


    // myList
    app.get('/myList/:email', async(req, res)=>{
      // console.log(req.params.email)
      const result = await touristSpotCollection.find({
        user_email: req.params.email}).toArray();
      res.send(result)
    })

    // Update
    app.put('/updateSpots/:id',async (req, res)=>{
      const id =req.params.id;
      const filter= {_id: new ObjectId(id)};
      const options ={upsert: true};
      const updateTouristSpot = req.body
      const update ={
        $set:{spotName:updateTouristSpot.spotName,
          country_name:updateTouristSpot.country_name,
          image:updateTouristSpot.image,
        location:updateTouristSpot.location,
        average_cost:updateTouristSpot.average_cost,
        seasonality:updateTouristSpot.seasonality, 
        travel_time:updateTouristSpot.travel_time,total_visitors_per_year:updateTouristSpot.total_visitors_per_year,user_email:updateTouristSpot.user_email,user_name:updateTouristSpot.user_name,short_description:updateTouristSpot.short_description

        }
      }
      const result =await touristSpotCollection.updateOne(filter,update,options);
      res.send(result)
    })
    // delete
    app.delete('/updateSpots/:id', async(req , res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result =await touristSpotCollection.deleteOne(query);
      res.send(result);

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