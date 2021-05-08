const makeApp = require('./app.js');
const db = require('./db')


const app = makeApp(db)

app.listen(5000, ()=> {
    console.log("listening on 5000")
});