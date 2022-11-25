const express = require('express');
const cors = require('cors');
const app =express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var jwt = require('jsonwebtoken');

const port = process.env.PORT || 4000;


// mid 
app.use(cors())
app.use(express.json())

function jwtVerify(req,res,next){
    const authHeader= req.headers.authorization
    if(!authHeader){
        return res.status(401).send({message:"unauthorization access"})
    }
    const token =authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_JWT_TOKEN,function(err,decoded){
        if(err){
            return res.status(403).send({message:"Forbidden Access"})
        }
        req.decoded = decoded
        next()
    })
}

const uri = process.env.ACCESS_MONGO_URI;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
     const categoryCollection =client.db('assignment12Project').collection('category')
     const productsCollection =client.db('assignment12Project').collection('categoryProducts')
     const bookedItemCollection =client.db('assignment12Project').collection('bookedItem')
     const usersCollection =client.db('assignment12Project').collection('users')
      

    //  jtw token 
    app.get('/jwt', async(req,res)=>{
        const email =req.query.email
        const query ={email: email}
        const user =await usersCollection.findOne(query)
        console.log(user);
        if(user){
            const token =jwt.sign({email},process.env.ACCESS_JWT_TOKEN,{expiresIn:'1d'})
            return res.send({accessToken: token})
        }
        res.status(403).send({message: "Forbidden Access"})
    })
    //  category data
     app.get('/category',async (req,res)=>{
        const query ={}
        const result =await categoryCollection.find(query).toArray()
        res.send(result)
     })
     app.get('/category/:id',async (req,res)=>{
        const id =req.params.id
        const filter ={category_id: id}
        const result =await productsCollection.find(filter).toArray()
        res.send(result)
     })

    //  Add a Product category
    app.post("/addProduct_Category",async(req,res)=>{
        const user =req.body
        console.log(user);
    })

    //  My Orders Data
   app.get('/bookedItem',jwtVerify,async (req,res)=>{
    const email=req?.query?.email
    // console.log(email);
    const decodedEmail=req?.decoded
    // console.log(decodedEmail);
    if( decodedEmail.email !== email){
    return res.status(403).send({message: "Forbidden Access"})
    }
    const query ={email: email}
    const result=await bookedItemCollection.find(query).toArray()
    res.send(result)
   })

    app.post('/bookedItem',async (req,res)=>{
        const user =req.body
        // console.log(user);
        const result =await bookedItemCollection.insertOne(user)
        res.send(result)
    })



    // UserData
    app.get('/users',async(req,res)=>{
        const query ={}
        const result= await usersCollection.find(query).toArray()
        res.send(result)
    })
    app.post('/users',async(req,res)=>{
      const user =req.body;
      const result =await usersCollection.insertOne(user)
      res.send(result)
    })
   

    // User seller
    app.get('/users/seller/:email',async (req,res)=>{
        const email =req.params.email
        const query ={email: email}
        const user =await usersCollection.findOne(query)
        res.send({isSeller : user?.select === "Seller"})
    })

    //user buyer 
    app.get('/users/buyer/:email',async (req,res)=>{
        const email =req.params.email
        const query ={email: email}
        const user =await usersCollection.findOne(query)
        res.send({isBuyer : user?.select === "Buyer"})
    })
    // User admin
    app.get('/users/admin/:email',async(req,res)=>{
      const email = req.params.email
      const query = {email : email}
      const user = await usersCollection.findOne(query);
      res.send({isAdmin: user?.role === 'Admin'})
    })

    app.put('/users/admin/:id',jwtVerify,async(req,res)=>{
      const decodedEmail =req.decoded.email
    //   console.log(decodedEmail);
      const query ={email : decodedEmail}
      const user =await usersCollection.findOne(query)
      if(user?.role !== "Admin"){
        return res.status(403).send({message: "Forbidden access"})
        }

        const id =req.params.id
        const filter={_id : ObjectId(id)}
        const options ={ upsert: true }
        const updateDoc={
            $set:{
                role: "Admin"
            }
        }
        const result =await usersCollection.updateOne(filter,updateDoc,options)
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