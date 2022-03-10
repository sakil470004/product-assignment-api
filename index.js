const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poyqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        const database = client.db('product-assignment');
        const productCollection = database.collection('product');
        const usersCollection = database.collection('users');

        // GET API
     
        app.get('/product', async (req, res) => {
            const cursor = await productCollection.find({});
            const result = await cursor.toArray()
            res.json(result)


        })

        // POST API 
        // insert one
        app.post('/user', async (req, res) => {
            const loginData = req.body;
            const result = await usersCollection.findOne({ email: loginData.email });
            if (result.password === loginData.password) {
                res.json({ message: 'success' })
            } else {
                res.json({ message: 'failed' })

            }
        })
        app.post('/adduser', async (req, res) => {
            const loginData = req.body;
            let result = await usersCollection.findOne({ email: loginData.email });
            if (result) {
                res.json({ message: 'already have account' })
            } else {

                result = await usersCollection.insertOne(loginData);
                res.json(result)
            }
        })
        // POST API
        app.post('/addProduct', async (req, res) => {
            const productData = req.body;
           const result = await productCollection.insertOne(productData);
            console.log(productData)
            res.json(result)

        })


      

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.listen(port, () => {
    console.log('your frecking is running ', port)

})