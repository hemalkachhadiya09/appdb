let express=require('express');
let app=express();
let router=express.Router();
let port=process.env.PORT || 9870;
//for considering PORT from the .env file
// let dotenv=require('dotenv');
// dotenv.config();



let mongo=require('mongodb');
mongoUrl="mongodb://localhost:27017"


let MongoClient=mongo.MongoClient;
let db;
let authkey="82ddfbe598aa92786a2ba1c70e28aba5"
// const client=new MongoClient();
// mongoUrl=process.env.MongoUrl;
// let db;

function auth(key)
{
  if(authkey===key)
  {
    return True
  }
  else{
    return False
  }
}


app.get('/',(req,res)=>{
    res.send('Express running')
})

app.get('/mealType',(req,res)=>{

  // let key=req.query.key;
  let key=req.header('x-basic-auth')
  if(authkey===key)
  {
    db.collection('mealType').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
    })
  }
  else 
  {
    res.send('Unauthorized calling')
  }
  
  
})
app.get('/location',(req,res)=>{
  
  if(auth(req.header('x-basic-auth')))
  {
    db.collection('location').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
    })
  }
  else{
    res.send('Unauthorized Calling')
  }
  
})
app.get('/restaurants',(req,res)=>{
  
  
  db.collection('restaurants').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
    })
})



// app.listen(port,()=>{
    
//     console.log(`express is running on ${port}`)
// })

///connection with db
MongoClient.connect(mongoUrl,(err,client) => {
    if(err)  {console.log(`Error While Connecting`)};
    
    db = client.db('internfeb');
    

    app.listen(port,(err) => {
      if(err) throw err;
      console.log(`Express Server listening on port ${port}`)
    })
  })