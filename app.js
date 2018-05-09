
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
const express = require('express');
const app = express();
const mongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
app.use(bodyParser.json());
const connection = (closure ) => {
  return mongoClient.connect('mongodb://localhost:27017/Project',(err,client) =>{
    if(err) return console.log(err);
    let db = client.db("Project");
    
    closure(db);
    
  })
}
app.post('/auth/login',(req,res) =>{
    connection( (db) =>{
        db.collection('Users').findOne({"email" : req.body.email }, (err, result)=>{
            if (result)
            {
                if (req.body.pass===result.pass){
                    let token = jwt.sign(result,'my_pass');

                    res.send({result,token : token});
                }
                else{
                    res.json({"message" :'wrong Password'});
                    console.log({"message" :'wrong Password'});
                } 
            }else {
                res.json({"message" :'User Not Found'});
                console.log('User Not Found');
            }
  });
    })
})

app.post('/auth/register',(req,res)=>{
    connection( (db)=>{
        db.collection('Users').insert(req.body,(err,result)=>{
            if (err) console.log(err);
            res.send(result);
        })
    })
})

app.listen(3000, (err)=>{
    if (err) console.log(err)
    console.log("Server started");
})