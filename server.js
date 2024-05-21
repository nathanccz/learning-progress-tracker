const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 4000

require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'learning_tracker'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.get('/profile', async (req, res) => {
    const knowledgeFields = await db.collection('knowledge_fields').find().toArray()
    // console.log(knowledgeFields)
    
    res.render('profile.ejs', { fields: knowledgeFields })
})


app.post('/addKnowledgeField', async(req, res) => {
    const findResult = await db.collection('knowledge_fields').findOne({field_name: {$eq: req.body.fieldFromJS}})
    if (findResult) {
        res.json('Field already exists!')
    } else {
        try {
            const inserted = await db.collection('knowledge_fields').insertOne({field_name: req.body.fieldFromJS, progress: "0%"})
            res.json('Item added successfully!')
        } catch(err) {
            console.log(err)
        }
    }
})

app.delete('/deleteField', (req, res) => {
    console.log(req.body.fieldToDelete)
    db.collection('knowledge_fields').deleteOne({field_name: req.body.fieldToDelete})
    .then(result => {
        console.log('Field deleted')
        res.json('Field successfully deleted!')
    })
    .catch(err => console.log(err))
})



app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})