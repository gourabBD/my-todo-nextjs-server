const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m8joqcm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
  try{
     const tasksCollection= client.db('my-todo').collection('tasks');
     
      
   
     app.get('/tasks',async(req,res)=>{
      const query={}
      const cursor=tasksCollection.find(query).sort({_id:-1})
      const services=await cursor.toArray();
      
      res.send(services)
     })
    
     app.post('/tasks' , async(req,res)=>{
        const order=req.body;
        const result=await tasksCollection.insertOne(order)
        res.send(result)
       })
       app.get(`/tasks/:id`,async(req,res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)}
        const result = await tasksCollection.findOne(query);
        res.send(result)
       })

      app.patch('/tasks/:id',async(req,res)=>{
  const id= req.params.id;
  const taskDetails = req.body.taskDetails
  const done = req.body.done
  
  
  const query={_id : ObjectId(id)}
  const updateDoc={
    $set:{
      taskDetails: taskDetails,
      done: done
   }
  
  }
  const result =await tasksCollection.updateOne(query,updateDoc)
  res.send(result)
 })
   
       app.delete('/tasks/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)}
        const result=await tasksCollection.deleteOne(query)
        res.send(result)
       })
    
  }
  finally{

  }

}
run().catch(err=>console.error(err))




app.get('/', (req, res) => {
  res.send('my-todo server running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})