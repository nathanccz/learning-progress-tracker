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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/profile', async (req, res) => {
    const knowledgeFields = await db.collection('users').find().toArray()
    console.log(knowledgeFields)
    res.render('profile.ejs', { fields: knowledgeFields })
})

app.get('/techlist', async (req, res) => {
    const techList = await db.collection('tech_list').find().toArray()
    res.json(techList)
})

app.get('/profile/:tech', async (req, res) => {
    const knowledgeFields = await db.collection('users').find().toArray()
    const techName = req.params.tech
    const techQuery = techName.split(' ').join('+')
    console.log(techQuery)
    const userTech = await db.collection('users').find().toArray()
    const result = userTech.filter(field => field.techName === techName)
    // const techParam = req.params.tech
    // try {
    //     const userTech = await db.collection('users').find().toArray()
    
    //     const result = await db.collection('users').findOne({techName: techParam})
    //     // const result = userTech.filter(field => field.techName === techParam)
        
        
    //  const renderObj = { fields: userTech, tech: techParam, techObj: result }
    
        res.render('tech-overview.ejs', { fields: knowledgeFields, fields: userTech, tech: techName, techObj: result, query: techQuery }) 
    // } catch(err) {
    //     console.log("error: " + err)
    // }
    
    
    
})


// app.post('/addKnowledgeField', async(req, res) => {
//     const findResult = await db.collection('knowledge_fields').findOne({ field_name: { $eq: req.body.fieldFromJS } })
//     if (findResult) {
//         res.json('Field already exists!')
//     } else {
//         try {
//             const inserted = await db.collection('knowledge_fields').insertOne(
//                 { field_name: req.body.fieldFromJS, 
//                   progress: "0%" }
//             )
//             res.json('Item added successfully!')
//         } catch(err) {
//             console.log(err)
//         }
//     }
// })

app.post('/addTech', async(req, res) => {
    const findTech = await db.collection('tech_list').findOne({ techName: { $eq: req.body.techToAdd } })
    if (findTech) {
        let {techName, category, type, faClass} = findTech
        
        try {
            const inserted = await db.collection('users').insertOne(
                { techName: techName,
                  category: category, 
                  type: type,
                  faClass: faClass
                }
            )
            res.json('Item added successfully!')
        } catch(err) {
            console.log(err)
        }
        
    }
})

app.post('/addTopic', async (req, res) => {
    const topic = req.body
    const tech = req.query.tech.split('+').join(' ')
    console.log(tech)
    
    try {
       const result = await db.collection('users').findOneAndUpdate(
            { techName: tech },
            { $push: topic },
       )
       console.log(result)
       res.redirect(`/profile/${tech}`)
    } catch(err) {
        console.log(err)
    }
    
})

app.delete('/deleteField', (req, res) => {
    db.collection('users').deleteOne({ techName: req.body.fieldToDelete })
    .then(result => {
        res.json('Field successfully deleted!')
    })
    .catch(err => console.log(err))
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})