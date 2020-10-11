var express = require('express');
var router = express.Router();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const url = process.env.mongodbURL || "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    client = await mongoClient.connect(url);
    let db = client.db("zenClass");

    let userList = await db.collection('usersList').find({}).toArray();
    client.close();

    res.json({
      status: 200,
      userList,
    })
  } catch (error) {
    console.log(error);
  }
});

router.post('/addUser', async function (req, res, next) {
  try {
    client = await mongoClient.connect(url);
    let db = client.db("zenClass");

    let userList = await db.collection('usersList').insertOne({
      ...req.body
    });
    client.close();
    res.json({
      status: 200,
      message : "Data updated",
    })
  } catch (error) {
    res.json({
      status : 500,
      message: "An Error Occured"
    })

  }
});

router.put('/updateUser', async function (req, res, next) {
  try {
    client = await mongoClient.connect(url);
    let db = client.db("zenClass");

    let userList = await db.collection('usersList').findOneAndUpdate({
      _id : mongodb.ObjectId(req.body._id)
    },
    {
      $set : {
        ...req.body,
      _id : mongodb.ObjectId(req.body._id)
      }
    }
    );
    client.close();
    if(userList){
      res.json({
        status: 200,
        message : "Data Updated",
      })
    }
    else{
      res.json({
        status: 404,
        message : "Data Can\'t be Updated",
      })
    }
  } catch (error) {
    console.log(req.body)
    res.json({
      status : 500,
      message: error
    })

  }
});

router.delete('/deleteUser', async function (req, res, next) {
  try {
    client = await mongoClient.connect(url);
    let db = client.db("zenClass");

    let userList = await db.collection('usersList').findOneAndDelete({
      _id : mongodb.ObjectId(req.body._id)
    });
    client.close();
    if(userList){
      res.json({
        status: 200,
        message : "Data Deleted",
      })
    }
    else{
      res.json({
        status: 404,
        message : "Data Not Found",
      })
    }
  } catch (error) {
    res.json({
      status : 500,
      message: error
    })

  }
});

module.exports = router;