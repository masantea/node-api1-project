//This import is pulling from node_modules now
const express = require("express");
const db = require("./database.js");

const server = express();

//This is installing some middleware to allow Epress
//to parse JSON request bodies.
server.use(express.json());

//POST
server.post("/users", (req, res) => {
  if ((!req.body.name, !req.body.bio)) {
    return res.status(400).json({
      errorMessage: "Please provide name and bio for the user.",
    });
  }

  const newUser = db.createUser({
    name: req.body.name,
    bio: req.body.bio,
    // name: "Jill Doe",
    // bio: "Jack's husband"
  });

  if(newUser){
    res.status(201).json(newUser);
  }else{
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database"
    })
  }
  
});

//GET
server.get("/users", (req, res) => {
  const users = db.getUsers();

  if (users) {
    res.json(users);
  } else {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  }
});

server.get("/users/:id", (req, res) => {
  //The param variable matches up to the name of the URL param above
  try {
    const user = db.getUserById(req.params.id); //id is from the route parameters ==database
    if (user) {
      res.json(user);
    } else {
      res
        .status(404).json({
          errorMessage: "The user with the specified ID does not exist."});
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

//DELETE
server.delete("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    db.deleteUser(req.params.id);

    res.status(204).end();
    
  } else {
    res.status(404).json({
      errorMessage: "The user with the specified ID does not exist.",
    });
  }
});

//PUT
server.put("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    if ((!req.body.name, !req.body.bio)) {
      return res.status(400).json({
         errorMessage: "Please provide name and bio for the user.", 
        });
    }

    const updatedUser = db.updateUser(req.params.id, {
      name: req.body.name,
      bio: req.body.bio,
    });

    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({
      errorMessage: "The user with the specified ID does not exist.",});
  }
});

server.listen(4000, () => { 
  console.log("server started on port 4000");
});

