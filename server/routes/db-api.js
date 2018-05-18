var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');
var request = require('request');



//Gets all lists of specific user
router.post('/getAllLists', function(req, res){
  var userId = req.body.userid;
  req.db.collection('lists').find({$or:[{'sharedWith': userId}, {'created_by':userId}]}).sort({created_at : -1}).toArray(function(err, results) {
    if (err) {
      next(err);
    }
    // console.log(results);

    res.json({
      lists: results
    });
  });
});

//Gets a single task item by task ID
router.post('/getTask',function(req, res){
  var userId = req.body.userid;
  var taskId = req.body.taskid;
  console.log(userId);
  console.log(taskId);

  req.db.collection('lists').findOne({'tasks._id':ObjectId(taskId),$or:[{'sharedWith': userId}, {'created_by':userId}]}, {"tasks.$.": 1}, function(err, results) {
    if (err) {
      next(err);
    }
    console.log(results);
    res.json({
      lists: results
    });
  });
});

//Edits task item by task ID
router.post('/editTask',function(req, res){
  var userId = req.body.userid;
  var taskId = req.body.taskid;
  var taskName = req.body.taskname;
  console.log(userId);
  console.log(taskId);

  req.db.collection('lists').updateOne({"tasks._id":ObjectId(taskId)}, {$set: {'tasks.$.name':taskName}}, function(err, results) {
    if (err) {
      next(err);
    }
    res.send("OK");
  });
});

//Deletes a task item by task ID
router.post('/deleteTask',function(req, res){
  var userId = req.body.userid;
  var taskId = req.body.taskid;
  console.log(userId);
  console.log(taskId);

  req.db.collection('lists').updateOne({'tasks._id':ObjectId(taskId),$or:[{'sharedWith': userId}, {'created_by':userId}]}, {$pull: {tasks: {_id: ObjectId( taskId )}}}, function(err, results) {
    if (err) {
      next(err);
    }
    // console.log(results);
    res.json({
      lists: results
    });
  });
});

//Deletes a task item by task ID
router.post('/deleteList',function(req, res){
  var userId = req.body.userid;
  var listid = req.body.listid;
  console.log(userId);
  console.log(listid);

  req.db.collection('lists').deleteOne({'_id':ObjectId(listid),$or:[{'sharedWith': userId}, {'created_by':userId}]}, function(err, results) {
    if (err) {
      next(err);
    }
    // console.log(results);
    res.json({
      lists: results
    });
  });
});

//Gets single list by list ID
router.post('/getList', function(req, res){
  var userId = req.body.userid;
  var listId = req.body.listid;


  console.log(userId+" "+ listId);
  // res.json({userId:userId, listId:listId});
  req.db.collection('lists').findOne({'_id':ObjectId(listId),$or:[{'sharedWith': userId}, {'created_by':userId}]}, function(err, results) {
    if (err) {
      next(err);
    }
    // console.log(results);
    res.json({
      lists: results
    });
  });
});

// Creates new list
router.post('/addNewList', function(req, res){
  var userid = req.body.userid;
  var listname = req.body.listname;
  var category = req.body.category;
  var sharingWith = JSON.parse(req.body.sharedWith);
  console.log(userid);
  console.log(category);

  // console.log(sharingWith);
  var toShare = [];
  for(var i in sharingWith){
    toShare.push(sharingWith[i]._id);
  }
  console.log(toShare);

  req.db.collection('lists').insert({'created_by': userid, 'list_name': listname, created_at: Date.now(), tasks:[], sharedWith: toShare, category: category}, function(err, results) {
    if (err) {
      next(err);
    }
    console.log(results);
    res.json(results);
  });
});

// Creates new list
router.post('/editList', function(req, res){
  var userid = req.body.userid;
  var listname = req.body.listname;
  var sharingWith = JSON.parse(req.body.sharedWith);
  var listid = ObjectId(req.body.listid);
	var by = JSON.parse(req.body.by);
	console.log(req.body.list)
	 var thelist = JSON.parse(req.body.list);
  console.log(userid);
  console.log(listname);
  // console.log(sharingWith);
  var toShare = [];

  for(var i in sharingWith){
    toShare.push(sharingWith[i]._id);
    var e = new Object();
    e.email = sharingWith[i].email;
    e.name = sharingWith[i].name;
    // e.link = "http://localhost:3000/list/"+list;
    e.text = "<div><h3>"+by.name+" has added you to list:"+thelist.list_name+"</h3> <p>You can view the list here: <a href='https://pure-scrubland-34177.herokuapp.com/home/list/"+listid+"'><button>View List</button></a></p></div>";
    // console.log(e.text);
    sendEmail(e);
  }

  req.db.collection('lists').updateOne({'_id':listid, $or:[{'sharedWith': userid}, {'created_by':userid}]},{$set:{'list_name': listname, tasks:[], sharedWith: toShare}}, function(err, results) {
    if (err) {
      next(err);
    }
    console.log(results);
    res.json({results:results, id:listid});
  });
});

//Finds users based on user name and email
router.post('/findusers', function(req, res){
  // console.log(req.body.text);
  var text = req.body.text;
  // $or:[{'email': { $regex: /text/ }}, {'name': { $regex: /text/ }}]
  if(!!text){
    req.db.collection('users').find({$or:[{'email': new RegExp(text,"i")},{'name': new RegExp(text,"i")}]}).toArray(function(err, results) {
      if (err) {
        next(err);
      }

      res.json({
        users: results
      });
    });
  }else{
    res.json({users:[]});
  }

});

// doesnt do much
router.get('/AllLists', checkJwt, function(req, res, next) {

  // the auth0 user identifier for connecting users with data
  console.log('auth0 user id:', req.user);
  res.send({name:'popo', done:false});

});

// Adds new task to list by list ID
router.post('/addNewTask', function(req, res, next) {
  var itemName = req.body.data;
  var listId = req.body.listid;
  var userId = req.body.userid;
  var time = Date.now();

  var task = new Object();
  task._id = ObjectId();
  task.name = itemName;
  task.created_at = time;
  task.checked = false;
  console.log(userId);
  //console.log(task);
  var wal=[];
  var tag;



  req.db.collection('lists').findOne({'_id':ObjectId(listId),$or:[{'sharedWith': userId}, {'created_by':userId}]}, function(err, results) {
    if (err) {
      next(err);
    }
    if(results.category!="To-Do List"){
      console.log("start scraping here");
      if(results.category=="Grocery"){
        var link = "https://www.walmart.com/search/?query="+itemName+"&cat_id=976759";
      }else if (results.category=="Household Essentials"){
        var link = "https://www.walmart.com/search/?query="+itemName+"&cat_id=1115193";
      }else if(results.category=="Party"){
        var link = "https://www.walmart.com/search/?query="+itemName+"&cat_id=2637";
      }

      request(link, function(error, response, body){

        //			console.log();

        var a = JSON.parse(body.split('document.head.appendChild(el);</script><script id="cdnHint"')[1].split('items":')[3].split(',"secondaryItems')[0]);

        for(var i=0; i<5 && i<a.length; i++){
          var temp = new Object();
          console.log(a[i]);

          if(a[i].title.indexOf('<mark>')!=-1){
            temp.title=a[i].title.split('<mark>')[0]+a[i].title.split('<mark>')[1].split('</mark>')[0]+a[i].title.split('</mark>')[1]
          }else{
            temp.title=a[i].title;
          }

          temp.productPageUrl=a[i].productPageUrl;
          temp.imageUrl=a[i].imageUrl;
          if(!!a[i].primaryOffer.offerPrice){
            temp.price = "Price: $"+a[i].primaryOffer.offerPrice;
          }else{
            temp.price = "In stores only";
          }

          wal.push(temp);
        }
        console.log(wal);
        task.wal = wal;

        req.db.collection('lists').update({'_id': ObjectId(listId)}, {$push:{tasks: task}}, function(err, results) {
          if (err) {
            next(err);
          }
          res.json(task);
        });



      });
    }else{
      req.db.collection('lists').update({'_id': ObjectId(listId)}, {$push:{tasks: task}}, function(err, results) {
        if (err) {
          next(err);
        }
        res.json(task);
      });
  }
  });
});

// Adds new task to list by list ID
router.post('/changeCompleted', function(req, res, next) {
  var itemId = req.body.itemid;
  var listId = req.body.listid;
  var checked = req.body.checked;
  console.log(itemId+" "+listId+" "+checked);
  req.db.collection('lists').update({"tasks._id":ObjectId(itemId)}, {$set: {'tasks.$.checked':checked}}, function(err, results) {
    if (err) {
      next(err);
    }
    res.send("OK");
  });

  // the auth0 user identifier for connecting users with data
  // console.log('auth0 user id:', req.body);
  // res.json({name:req.body.data, done:false});

});

router.post('/changeStar', function(req, res, next) {
  var itemId = req.body.itemid;
  var listId = req.body.listid;
  var isStar = req.body.isStar;
  console.log(itemId+"!!!! "+listId);
  req.db.collection('lists').update({"tasks._id":ObjectId(itemId)}, {$set: {'tasks.$.isStar':isStar}}, function(err, results) {
    if (err) {
      next(err);
    }
    res.send("OK");
  });

  // the auth0 user identifier for connecting users with data
  // console.log('auth0 user id:', req.body);
  // res.json({name:req.body.data, done:false});

});

//adds user to db
router.post('/user', function(req, res){

  var userProfile = JSON.parse(req.body.profile);
  var name = userProfile.name;
  var email = userProfile.email;
  var picture = userProfile.picture;
  var id = userProfile.sub;
  // console.log(userProfile);
  // console.log(name + " " + email + " " + picture + " "+ id);
  req.db.collection('users').update({'_id': id},{'picture':picture, 'name': name, 'email': email }, {upsert:true}, function(err, results){
    res.send("OK");
  });
});

//
router.post('/getuser', function(req, res){
  var userid = JSON.parse(req.body.userid);

  req.db.collection('users').find({'_id':{$in:userid}}).toArray(function(err, results) {
    console.log(results);
    res.json({
      user: results
    });
  });

  // res.send("popo");

});

router.post('/item', function(req, res){
  // 5xt1a
  var itemName = req.body.name;
  var url ="https://www.target.com/s?searchTerm="+itemName+"&category=5xt1a&sortBy=relevance";
  console.log(url);
  res.json({'status':"OK"});
});

// shares list with users
router.post('/share', function(req, res){
  var shareWith = JSON.parse(req.body.shareWith);
  var list = req.body.listid;
  var by = JSON.parse(req.body.by);
  var thelist = JSON.parse(req.body.list);

  var toShare = [];

  for(var i in shareWith){
    toShare.push(shareWith[i]._id);
    var e = new Object();
    e.email = shareWith[i].email;
    e.name = shareWith[i].name;
    // e.link = "http://localhost:3000/list/"+list;
    e.text = "<div><h3>"+by.name+" has added you to list:"+thelist.list_name+"</h3> <p>You can view the list here: <a href='https://pure-scrubland-34177.herokuapp.com/home/list/"+list+"'><button>View List</button></a></p><p>To exit the list click here: <a href='https://pure-scrubland-34177.herokuapp.com/deleteList/"+list+"'><button>View List</button></a></p></div>";
    // console.log(e.text);
    sendEmail(e);
  }

  console.log(toShare);
  // res.send("pop");

  req.db.collection('lists').update({'_id': ObjectId(list)},{$set:{sharedWith: toShare}}, function(err, results) {
    if (err) {
      next(err);
    }
    res.json({'status':"OK"});
  });

  // req.db.collection('lists').update({'_id': ObjectId(list)}, {$addToSet: { sharedWith: { $each: toShare } }}, function(err, results) {
  //   if (err) {
  //     next(err);
  //   }
  //   res.json({'status':"OK"});
  // });
});

router.post('/exitList', function(req, res){
	var userId = req.body.userid;
  var listid = req.body.listid;
  console.log(userId);
  console.log(listid);

  req.db.collection('lists').deleteOne({'_id':ObjectId(listid), 'created_by':userId}, function(err, results) {
    if (err) {
      next(err);
    }
    // console.log(results);
    req.db.collection('lists').updateOne({'_id':ObjectId(listid),'sharedWith': userId}, {$pull: {'sharedWith': {userId}}}, function(err, results) {
    if (err) {
      next(err);
    }
    // console.log(results);
    res.json({
      lists: results
    });
  });
  });
	

	

});

//deletes user from list

// simple API call, no authentication or user info
router.get('/unprotected', function(req, res, next) {

  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      todos: results
    });
  });

});

// checkJwt middleware will enforce valid authorization token
router.get('/protected', checkJwt, function(req, res, next) {

  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.json({
      todos: results
    });
  });

  // the auth0 user identifier for connecting users with data
  console.log('auth0 user id:', req.user.sub);

  // fetch info about the user (this isn't useful here, just for demo)
  const userInfoUrl = req.user.aud[1];
  const bearer = req.headers.authorization;
  fetch(userInfoUrl, {
    headers: { 'authorization': bearer },
  })
  .then(res => res.json())
  .then(userInfoRes => console.log('user info res', userInfoRes))
  .catch(e => console.error('error fetching userinfo from auth0'));

});

router.get('/scrape',function(req,res,next){

  var link = "view-source:https://www.walmart.com/search/?query=eggs&cat_id=976759";

  request(link, function(error, response, body){
    if(!error && response.statusCode == 200){
      var $ = cheerio.load(body);
      console.log('$');
    }
  })

});

function sendEmail(data){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'servertest665@gmail.com',
      pass: 'popo1234'
    }
  });

  const mailOptions = {
    from: 'Note It!<noreply@coolappname.com>', // sender address
    to: data.email, // list of receivers
    subject:"You have been added to a new List", // Subject line
    html: data.text// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
    console.log(err)
    else
    console.log(info);
  });


}

module.exports = router;
