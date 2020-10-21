var express = require('express');
var app = express();
var port = 7800;
var bodParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var mongourl = "mongodb+srv://admin:admin@cluster0.ohqzw.mongodb.net/edurekainternship?retryWrites=true&w=majority";
var cors = require('cors');
var db;

app.use(cors());

app.use(bodParser.urlencoded({extended:true}));
app.use(bodParser.json())

app.get('/health',(req,res) => {
    res.send("Api is working")
});

app.get('/',(req,res) => {
    res.send(`<a href="http://localhost:7800/location" target="_blank">City</a> <br/> <a href="http://localhost:7800/mealtype" target="_blank">MealType</a> <br/> <a href="http://localhost:7800/cuisine" target="_blank">Cuisine</a> <br/> <a href="http://localhost:7800/restaurents" target="_blank">Restaurents</a> <br/> <a href="http://localhost:7800/orders" target="_blank">Orders</a>`)
})

//List of city
app.get('/location',(req,res) => {
    db.collection('city').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//mealtype
app.get('/mealtype',(req,res) => {
    db.collection('mealtypes').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//cusine
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//restaurents
app.get('/restaurents',(req,res) => {
    var condition = {};
    if(req.query.city && req.query.mealtype){
        condition = {city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        condition={city:req.query.city}
    } else if(req.query.mealtype){
        condition={"type.mealtype":req.query.mealtype}
    }
    else{
        condition={}
    }
    db.collection('restaurent').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//RestaurentDetai+
app.get('/restaurantdetails/:id',(req,res) => {
    var query = {_id:req.params.id}
    db.collection('restaurent').find(query).toArray((err,result) => {
        res.send(result)
    })
})

//RestaurentList
app.get('/restaurantList/:mealtype',(req,res) => {
    var condition = {};
    if(req.query.cuisine){
        condition={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.city){
        condition={"type.mealtype":req.params.mealtype,city:req.query.city}
    }else if(req.query.lcost && req.query.hcost){
        condition={"type.mealtype":req.params.mealtype,cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}
    }
    else{
        condition= {"type.mealtype":req.params.mealtype}
    }
    db.collection('restaurent').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//PlaceOrder
app.post('/placeorder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('posted')
    })
})

//order
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

///Not Require in project
//Delete Orders
app.delete('/deleteorders',(req,res) => {
    db.collection('orders').remove({_id:req.body.id},(err,result) => {
        if(err) throw err;
        res.send('data deleted')
    })
})

//Update orders
app.put('/updateorders',(req,res) => {
    db.collection('orders').update({_id:req.body._id},
        {
            $set:{
                name:req.body.name,
                address:req.body.address
            }
        },(err,result) => {
            if(err) throw err;
            res.send('data updated')
        })
})

MongoClient.connect(mongourl,(err,connection) => {
    if(err) throw err;
    db = connection.db('edurekainternship');
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
})
