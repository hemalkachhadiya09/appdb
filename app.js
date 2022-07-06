let express=require('express');
let app=express();
// let router=express.Router();

//for considering PORT from the .env file
let dotenv=require('dotenv').config();
// dotenv.config()
let port=process.env.PORT || 9870;
let mongoUrl=process.env.MongoLiveUrl;




let mongo=require('mongodb');
let bodyParser=require('body-parser');
let cors = require('cors');
const { query } = require('express');
// mongoUrl="mongodb://localhost:27017";
// mongoLiveUrl="mongodb+srv://admin:admin1234@cluster0.rursfne.mongodb.net/?retryWrites=true&w=majority"


let MongoClient=mongo.MongoClient;
let db;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

app.get('/',(req,res)=>{
  res.send('Express running')
})

///if we want to pass all things in single url , then use this 
// app.get('/items/:collections',(req,res)=>{
//   db.collection(req.param.collections).find().toArray((err,result)=>{
//     res.send(result)
//   })
// })

app.get('/mealType',(req,res)=>{

 db.collection('mealtype').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })



})
app.get('/orders',(req,res)=>{

  db.collection('orders').find().toArray((err,result)=>{
     if(err) throw err;
     res.send(result)
   })
 
 
 
 })
 app.get('/details/:restId',(req,res)=>{
  let restId=Number(req.params.restId)
  query={}
  if(restId)
  {
    query={restaurant_id:restId}
  }


  db.collection('restaurant').find(query).toArray((err,result)=>{
     if(err) throw err;
     res.send(result)
   })
 
 
 
 })

app.get('/location',(req,res)=>{


db.collection('location').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})
app.get('/restaurants',(req,res)=>{
  let stateId=Number(req.query.stateId) ;
  let mealId=Number(req.query.mealId) ;
  let query={}
  if(stateId && mealId)
  {
    query={state_id:stateId,'mealTypes.mealtype_id':mealId}
  }
  else if(stateId)
  {
    query={state_id:stateId}
  }
  else if(mealId)
  {
    query={'mealTypes.mealtype_id':mealId}
  }


db.collection('restaurant').find(query).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})
// app.get('/filter/:mealId',(req,res)=>{
//   let mealId=Number(req.params.mealId) ;
//   let cuisineId=Number(req.query.cuisineId);
//   let query={}

//   if(cuisineId)
//   {
//     query={'mealTypes.mealtype_id':mealId,'cuisines.cuisine_id':cuisineId}
//   }
//   else
//   {
//     query={'mealTypes.mealtype_id':mealId}
//   }

//   db.collection('restaurant').find(query).toArray((err,result)=>{
//     if(err) throw err;
//     res.send(result)
//   })
// })
app.get(`/filter/:mealId`,(req,res) => {
  let sort = {cost:1}
  let mealId = Number(req.params.mealId)
  let cuisineId = Number(req.query.cuisineId)
  let lcost = Number(req.query.lcost)
  let hcost = Number(req.query.hcost)
  let query = {}
  if(req.query.sort){
    sort={cost:req.query.sort}
  }

  if(lcost && hcost && cuisineId){
    query={
      "mealTypes.mealtype_id":mealId,
      $and:[{cost:{$gt:lcost,$lt:hcost}}],
      "cuisines.cuisine_id":cuisineId
    }
  }
  else if(lcost && hcost){
    query={
      "mealTypes.mealtype_id":mealId,
      $and:[{cost:{$gt:lcost,$lt:hcost}}]
    }
  }
  else if(cuisineId){
    query={
      "mealTypes.mealtype_id":mealId,
      "cuisines.cuisine_id":cuisineId
    }
  }else{
    query={
      "mealTypes.mealtype_id":mealId
    }
  }
  db.collection('restaurant').find(query).sort(sort).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})
app.get('/menu/:id',(req,res) => {
  let id = Number(req.params.id)
  db.collection('menu').find({restaurant_id:id}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})
// app.post('/placeOrder',(req,res) => {
//   console.log(req.body)
//   db.collection('orders').insert(req.body,(err,result) => {
//     if(err) throw err;
//     res.send(result)
//   })
// })
// app.post('/menuItem',(req,res)=>{
//   if(Array.isArray(req.body))
//   {
//     db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
//       if(err) throw err;
//       res.send(result)
//     })
//   }
//   else{
//     res.send('Invalid Input')
//   }
// })
// app.put('/updateOrder/:id',(req,res) => {
//   let oid = Number(req.params.id);
//   db.collection('orders').updateOne(
//     {orderId:oid},
//     {
//       $set:{
//         "status":req.body.status,
//         "bank_name":req.body.bank_name,
//         "date":req.body.date
//       }
//     },(err,result) => {
//       if(err) throw err;
//       res.send('Order Updated')
//     }
//   )
// })
// app.delete('/deleteOrder/:id',(req,res) => {
//   let oid =  mongo.ObjectId(req.params.id)
//   db.collection('orders').remove({_id:oid},(err,result) => {
//     if(err) throw err;
//     res.send('Order Deleted')
//   })
// })  
// app.listen(port,()=>{
    
//     console.log(`express is running on ${port}`)
// })

///connection with db
MongoClient.connect(mongoUrl,(err,client) => {
  if(err)  {console.log(`Error While Connecting`)};
  
  db = client.db('zomatodb');
  

  app.listen(port,(err) => {
    if(err) throw err;
    console.log(`Express Server listening on port ${port}`)
  })
})









