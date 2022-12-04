const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjwtwko.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {

        const nudgeCollection = client.db('nudge').collection('events')


        app.post('/api/v3/app/events', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await nudgeCollection.insertOne(user);
            res.send(result);
        });
        app.get('/api/v3/app', async (req, res) => {
            const query = {}
            const cursor = nudgeCollection.find()
            const items = await cursor.toArray();
            res.send(items);
        })




        app.delete('/api/v3/app/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await nudgeCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/api/v3/app/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await nudgeCollection.findOne(query);
            res.send(result)
        })

        app.put('/api/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true }

            const updatedUser = {
                $set: {
                    type: user.type,
                    schedule: {
                        date: user.date,
                        fromTime: user.fromTime,
                        toTime: user.toTime
                    },
                    description: user.description,
                    invitation: user.invitation,
                    tagline: user.tagline,
                    title: user.title

                }
            }
            const result = await nudgeCollection.updateOne(filter, updatedUser, option);
            res.send(result);
            console.log(updatedUser)
        })


    }


    finally {

    }
}




run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('simple node server Running')
})
app.listen(port, () => {
    console.log(`simple server running on port ${port}`)
})