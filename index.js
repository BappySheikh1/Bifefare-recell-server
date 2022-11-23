const express = require('express');
const cors = require('cors');
const app =express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// mid 
app.use(cors())
app.use(express.json())



const uri = process.env.ACCESS_MONGO_URI;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
     const userCollection =client.db('assintment12Project').collection('project')

    //  app.get('/service',async (req,res)=>{
    //     const query ={}
    //     const result =await userCollection.find(query).toArray()
    //     res.send(result)
    //  })

    }
    finally{

    }
}
run().catch(err =>console.log(err))

app.get('/', (req,res)=>{
    res.send('assignment12 server is running')
})
app.listen(port,()=>{
    console.log(`assignment12 server is running ${port}`);
})