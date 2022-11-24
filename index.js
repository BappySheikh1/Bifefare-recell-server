const express = require('express');
const cors = require('cors');
const app =express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 4000;


// mid 
app.use(cors())
app.use(express.json())



const uri = process.env.ACCESS_MONGO_URI;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
     const categoryCollection =client.db('assignment12Project').collection('category')
     const productsCollection =client.db('assignment12Project').collection('products')
      
     app.get('/category',async (req,res)=>{
        const query ={}
        const result =await categoryCollection.find(query).toArray()
        res.send(result)
     })
     app.get('/category/:id',async (req,res)=>{
        const id =req.params.id
        const filter={category_id: id}
        const result =await productsCollection.find(filter).toArray()
        res.send(result)
     })

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