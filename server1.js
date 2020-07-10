let express = require("express")

//enabling the feature in express, to be able to request the users document.body element
let ourApp = express()
ourApp.use(express.urlencoded({ extended: false }))

ourApp.get('/', function(req, res) {
        res.send(`
    <form action="/answer" method="POST"> 
    <p> what color is the sky </p>
    <input name='skyColor' autocomplete="off">
    <button>Submit</button>
    </form>
    `)
    })
    //form submission -- at actions
ourApp.post('/answer', function(req, res) {
    if (req.body.skyColor.toUpperCase() == "BLUE") {
        res.send(`
        <p>Congrats, correct. </p>
        <a href="/">Back to homepage</a>
        `)
    } else {
        res.send(`
        <p>sorry, that's not correct. </p>
        <a href="/">Back to homepage</a>
        `)

    }
})

//clicking on the post or navigation link or content on th site
ourApp.get('/answer', function(req, res) {
    res.send('are you lost? there is nothing to see here')
})

ourApp.listen(3000)