let express = require('express') //invite from node modules
let app = express()
let mongodb = require('mongodb') // invite from node modules
let sanitizeHTML = require('sanitize-html')

let db //defined below at mongodb connect
let mongoose = require('mongoose')
let port = process.env.PORT
if (port == null || port == '') {
  port = 3000
}

let public = app.use(express.static('public')) //inviting static files to execute in our environment --will make available the content of this folder for the users
// console.log("public", public)

let connectionString =
  'mongodb+srv://todoappuser:todoappuser@cluster0-to-do.b5gol.mongodb.net/Cluster0-to-do?retryWrites=true&w=majority'

//first param : connection string; second param: mongodb config property, third param: the action in the method
mongodb.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err, client) {
    db = client.db() //this selects our mongodb database
    app.listen(port)
  }
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//security

function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Todo App"')
  console.log(req.headers.authorization)
  //user/password => learn/javascript
  if (req.headers.authorization == 'Basic bGVhcm46amF2YXNjcmlwdA==') {
    next()
  } else {
    res.status(401).send('Authentication required')
  }
}
//protecting every path
app.use(passwordProtected)

// app.get('/db', (req,res)=>console.log(db.collection('items').find().toArray()))
app.get('/', (req, res) => {

  db.collection('items')
    .find()
    .toArray((err, items) => {
      // console.log(items)
      console.table(items)
      //start html
      res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shopping List</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">Bevásárló lista</h1>
        
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        <ul id="item-list" class="list-group pb-5">
        ${items
          .map((azAdat) => {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${azAdat.text}</span>
          <div>
            <button data-id="${azAdat._id}" class="edit-me btn btn-secondary btn-sm mr-1" >Edit</button>
            <button data-id="${azAdat._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>`
          })
          .join('')}
        </ul>
       
           
      </div>
<script>
let items = ${JSON.stringify(items)}
</script>

      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script src="browser.js"></script>
    </body>
    </html>`)
      //end html
    })

  //html start
})
// end html
console.log('html parsed. congrats.')
console.log('database loaded. congrats.')


app.post('/create-item', function (req, res) {
  let dirty = req.body.text
  let clean = sanitizeHTML(dirty, { allowedTags: [], allowedAttributes: {} })
  db.collection('items').insertOne({ text: req.body.item }, function () {
    res.redirect('/')
  })
})

app.post('/update-item', function (req, res) {
  db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: req.body.text } }, function () {
    res.send("Success")
  })
})

app.post('/delete-item', function (req, res) {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function () {
    res.send("Success")
  })
})