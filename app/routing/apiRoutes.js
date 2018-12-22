var mysql = require("mysql");

module.exports = function(app) {
  var connection;
  if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
  } else {
    var connection = mysql.createConnection({
      host: "localhost",
      port: 8889,
      user: "root",
      password: "root",
      database: "practice_db"
    });
  }

  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      //once successfully connected, you may want to query your database for the info you'll need later!
    }
  });

  app.post("/api/friends", function(req, res) {
    var scoresArray = [];
    scoresArray.push(req.body.action1);
    scoresArray.push(req.body.action2);
    scoresArray.push(req.body.action3);
    scoresArray.push(req.body.action4);
    scoresArray.push(req.body.action5);
    scoresArray.push(req.body.action6);
    scoresArray.push(req.body.action7);
    scoresArray.push(req.body.action8);
    scoresArray.push(req.body.action9);
    scoresArray.push(req.body.action10);
    var scores = scoresArray.join(",");

    connection.query(
      "INSERT INTO profiles (name, photo, scores) VALUES (?, ?, ?)",
      [req.body.nameInput, req.body.photoInput, scores],
      function(err, result) {
        if (err) {
          // If an error occurred, send a generic server failure
          return res.status(500).end();
        }
        res.redirect("http://localhost:8080/survey");
      }
    );
  });

  app.get("/api/friends", function(req, res) {
    connection.query("SELECT * FROM profiles", function(err, result) {
      for (var i = 0; i < result.length; i++) {
        //map allows us to apply a function to every value in the array, used to convert the string into numbers
        result[i].scores = result[i].scores.split(",").map(a => parseInt(a));
      }
      console.log(`result: ${JSON.stringify(result)}`);

      res.json(getMostCompatible(result));
    });
  });
};

function getMostCompatible(arrayOfFriends) {
  var firstPerson = arrayOfFriends[0].scores;
  var differenceArray = [];
  console.log(`1st person: ${JSON.stringify(firstPerson)}`);

  for (var i = 1; i < arrayOfFriends.length; i++) {
    var scoresArray = arrayOfFriends[i].scores;
    var differenceValue = 0;
    console.log(`scores arr: ${JSON.stringify(scoresArray)}`);

    for (var x = 1; x < scoresArray.length; x++) {
      differenceValue += Math.abs(scoresArray[x] - firstPerson[x]);
    }
    differenceArray.push(differenceValue);
  }
  var largeValue = differenceArray[0];
  var index = 0;
  for (var y = 0; y < differenceArray.length; y++) {
    if (largeValue > differenceArray[y]) {
      largeValue = differenceArray[y];
      index = y;
    }
  }

  console.log(`this is index: ${index}`);
  console.log(`this is value: ${largeValue}`);
  return arrayOfFriends[index];
}
