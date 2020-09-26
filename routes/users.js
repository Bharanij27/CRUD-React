var express = require("express");
var router = express.Router();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const url = process.env.mongodbURL || "mongodb://localhost:27017/";

/* GET users listing. */
router.get("/",async function (req, res) {
  let client;
  try {
    client = await mongoClient.connect(url);
    let db = client.db('zenClass');
    let users = await db.collection('react_crud_users').find({}).toArray();
    
    res.json({
      status : 200,
      users,
      message : 'Scuccessfully Retrieved'
    })
  } catch (error) {
    res.json({
      status : 404,
      message : 'Something went wrong'
    })
  }
});

router.post("/user",async function (req, res) {
  let client;
  try {
    client = await mongoClient.connect(url);
    let db = client.db('zenClass');

    if(req.body.name === undefined) throw 'Missing Header Fields'

    let userName = req.body.name;
    let users = await db.collection('react_crud_users').insertOne({name : userName});

    res.json({
      status : 200,
      message : 'Updated User Scuccessfully'
    })

  } catch (error) {
    res.json({
      status : 404,
      message : error || 'Something went wrong'
    })
  }
});


router.delete("/delete",async function (req, res) {
  let client;
  try {
    client = await mongoClient.connect(url);
    let db = client.db('zenClass');

    if(req.body.id === undefined) throw 'Missing Header Fields'

    let userid = req.body.id;
    let users = await db.collection('react_crud_users').findOneAndDelete({_id : mongodb.ObjectId(userid)});

    if(users.value){
      let name = users.value.name;
      res.json({
        status : 200,
        message : `Deleted User ${name} Scuccessfully`
      })
    }
    else{
      res.json({
        status : 404,
        message : 'No such user available'
      });
    }
  } catch (error) {
    res.json({
      status : 404,
      message : error || 'Something went wrong'
    })
  }
});

router.put("/update",async function (req, res) {
  let client;
  try {
    client = await mongoClient.connect(url);
    let db = client.db('zenClass');

    console.log(req.body);
    if(req.body.id === undefined) throw 'Missing Header Fields'

    let userid = req.body.id;
    let userName = req.body.name;
    let users = await db.collection('react_crud_users').findOneAndUpdate({_id : mongodb.ObjectId(userid)}, {$set : {name : userName}});

    console.log(users);
    if(users.lastErrorObject.updatedExisting){
      res.json({
        status : 200,
        message : 'Updated Scuccessfully'
      })
    }
    else{
      res.json({
        status : 404,
        message : 'Cannot Update'
      })
    }
  } catch (error) {
    res.json({
      status : 404,
      message : error || 'Something went wrong'
    })
  }
});

module.exports = router;
