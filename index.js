const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

// for product
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2hugv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("fresh-mart").collection("products");

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productsCollection.insertOne(newProduct)
            .then(result => {
                console.log('product added');
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/manageProduct', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        productsCollection.deleteOne({_id: objectId(req.params.id)})
        .then(result => {
            console.log('deleted Successfully');
        })
    })
});


// for user
client.connect(err => {
    const userCollection = client.db("fresh-mart").collection("user");

    app.post('/order', (req, res) => {
        const newProduct = req.body;
        userCollection.insertOne(newProduct)
            .then(result => {
                console.log('product added');
            })
    })

    app.get('/myOrder', (req, res) => {
        userCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 5000)