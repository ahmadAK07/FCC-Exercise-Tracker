const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const uri = process.env.DB_URI;
const {Users} = require('./models/models.js');
const {Exercises} = require('./models/models.js');
console.log(Users);
mongoose.connect(uri)
.then(()=>{
  console.log('database connected');
})
.catch(err => console.log('not connected'));

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async(req, res)=>{
     const users = await Users.find({});

     if(!users){
      res.status(400).json({error: "there are no users"})
     }

     res.json(users);
})

app.post("/api/users",async (req, res)=>{
    const {username} = req.body;
    console.log(username);
    try {
      const userResponse = await Users.create({username: username});

    
        res.json({id : userResponse._id, username: userResponse.username})
      
    } catch (error) {
      console.log(error);

      res.json({error: error});
    }
})

app.post("/api/users/:_id/exercises", async(req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  console.log(description, _id, duration, date);

  try {
    const user = await Users.findById({ _id:new ObjectId(_id) });
    console.log(user);

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const dateObject = new Date(date);
    const formattedDate = dateObject.toDateString();
    console.log(formattedDate); 

    const exerObj = {
      username: user.username,
      description,
      duration,
      date: formattedDate,
      userId: new ObjectId(_id)
    };

    const newExercise = await Exercises.create(exerObj);
    console.log(newExercise);
    
    res.json(newExercise);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/api/users/:_id/logs', async(req, res)=>{
    const userId = req.params._id;

    try {
      const exercises = await Exercises.find({userId: userId});

      if(!exercises){
        res.status(400).json({error: "this user has no exercises"});
      }

     
        const logs = exercises.map(exercise => ({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString()
      }));
      

      const userLog = {
        username: exercises[0].username, 
        count: logs.length,
        _id: userId,
        log: logs
    };
      res.status(200).json(userLog);
    } catch (error) {
      res.status(500).json({error: error})
    }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
