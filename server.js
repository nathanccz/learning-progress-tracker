const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 4000

require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'knowledge_fields'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.get('/nathanccz', async (req, res) => {
    const knowledgeFields = await db.collection('knowledge_fields').find().toArray()
    
    res.render('profile.ejs', { fields: knowledgeFields })
})

app.post('/addKnowledgeField', (req, res) => {
    db.collection('knowledge_fields').insertOne({field: req.body.knowledgeField, progress: "beginning"})
    .then(result => {
        console.log('knowledge field added')
        res.redirect('/nathanccz')
    })
    .catch(err => console.log(err))
})






app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})