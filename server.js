require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT;
const db = require('./Connection/connection');



app.listen(PORT, async()=>{
    console.log(`app is running on http://localhost:${PORT}`);
    try{
        const success = await db.query('SELECT * from users'); //test connect only
        console.log(`DB Connected!`);
    }catch(error){
        console.log(`DB Failed to connect, error here: ${error}`)
    }
    
});