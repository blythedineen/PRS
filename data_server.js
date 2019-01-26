var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');


var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

var port = process.env.PORT || 8000;
app.listen(port);


app.get('/', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/login', function(request, response){
  var data=loadCSV("data/users.csv");
  var new_user=true;
  for(var i=0; i<data.length;i++){
    if(request.query.player_name==data[i]["name"]){
      new_user=false;
      if(request.query.password==data[i]["password"]){
        var user_data={};
        user_data.name=data[i].name;
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('game', {user:user_data});
        break;
      }
      else{
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('error');
        break;
      }
    }
  }
      if(new_user){
          var user={};
          user["name"] = request.query.player_name;
          user["password"] = request.query.password;
          user["win"] = 0;
          user["lose"] = 0;
          user["tie"] = 0;
          user["rock"] = 0;
          user["paper"] = 0;
          user["scissors"] = 0;
          data.push(user);


      var user_data={};
      user_data.name=user.name;
      writeCSV(data, "data/users.csv");
      response.status(200);
      response.setHeader('Content-Type', 'text/html');
      response.render('game', {user:user_data});
}
});

app.get('/logout', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/play_again', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/:user/results', function(request, response){
  var stuff = gameResult(request.query.weapon,request.query.villain)
  var user_data={
      name: request.params.user,
      weapon: request.query.weapon,
      villain: request.query.villain,
      result: stuff[1],
      villainWeapon: stuff[0]
  };

  var usersCSV = loadCSV("data/users.csv");

  for(var i = 0; i < usersCSV.length; i++){
    if(usersCSV[i]["name"] == user_data.name){
      if(user_data.weapon == "rock"){
        usersCSV[i]["rock"] += 1;
      }if(user_data.weapon == "paper"){
        usersCSV[i]["paper"] += 1;
      }if(user_data.weapon == "scissors"){
        usersCSV[i]["scissors"] += 1;
      }
      if(stuff[1]=="tie"){
        usersCSV[i]["tie"] += 1;
      } if(stuff[1]=="lose"){
        usersCSV[i]["lose"] += 1;
      } if(stuff[1]=="win"){
        usersCSV[i]["win"]+=1;
      }

        var all = usersCSV[i]["win"]+usersCSV[i]["lose"]+ usersCSV[i]["tie"];
        usersCSV[i]["winLoss"]=parseFloat(usersCSV[i]["win"]/all);


    }
  }

  //for (i=1; i<usersCSV.length/8; i++){
  //  usersCSV[i*8].concat("\n");
  //}
  writeCSV(usersCSV, "data/users.csv");

  var villainsCSV = loadCSV("data/villains.csv");
//console.log("this is the villainsCSV");
//console.log(villainsCSV)
  for(var i = 0; i < villainsCSV.length; i++){
    //console.log("csv: "+ villainsCSV[i]["name"].toLowerCase());
    //console.log("userdata: "+ user_data.villain.toLowerCase());

    if(villainsCSV[i]["name"].toLowerCase() == user_data.villain.toLowerCase()){
      //console.log(user_data.villain);
      //console.log(stuff);
      if(stuff[0] == "rock"){
        villainsCSV[i]["rock"] += 1;
      }if(stuff[0] == "paper"){
        villainsCSV[i]["paper"] += 1;
      }if(stuff[0] == "scissors"){
        villainsCSV[i]["scissors"] += 1;
      }
      if(stuff[1]=="tie"){
        villainsCSV[i]["tie"] += 1;
      } if(stuff[1]=="lose"){
        villainsCSV[i]["win"] += 1;
      } if(stuff[1]=="win"){
        villainsCSV[i]["lose"]+=1;
      }
      var all = villainsCSV[i]["win"]+villainsCSV[i]["lose"]+ villainsCSV[i]["tie"];
      villainsCSV[i]["winLoss"]=parseFloat(villainsCSV[i]["win"]/all);


    }
  }
  //console.log(villainsCSV)
  //for (i=1; i<villainsCSV.length/7; i++){
  //  villainsCSV[i*7].concat("\n");
  //}
  writeCSV(villainsCSV, "data/villains.csv")

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results', {user:user_data});
});

//takes villain, weapon, returns villainWeapon, game result
function gameResult(weapon,villain){
  var villainWeapon = strategy(weapon,villain);
  var villainStuff = []
  if(villainWeapon=="rock" && weapon=="rock" || villainWeapon=="paper" && weapon=="paper" || villainWeapon=="scissors" && weapon=="scissors"){
    villainStuff=[villainWeapon,"tie"];
  }
  if(villainWeapon=="rock" && weapon=="scissors" || villainWeapon=="paper" && weapon=="rock" || villainWeapon=="scissors" && weapon=="paper"){
    villainStuff=[villainWeapon,"lose"];
  }
  if(weapon=="rock" && villainWeapon=="scissors" || weapon=="paper" && villainWeapon=="rock" || weapon=="scissors" && villainWeapon=="paper"){
    villainStuff=[villainWeapon,"win"];
  }
  return villainStuff;
}

function loadCSV(file) {
  var data = fs.readFileSync(file, "utf8"); //load csv
  var rows = data.split('\n'); //parse csv
  var info = [];
  for(var i = 0; i < rows.length; i++) {
    var user_d = rows[i].trim().split(",");
    var user = {};

    if(file == "data/users.csv" && user_d[0]){
      user["name"] = user_d[0];
      user["password"] = user_d[1];
      user["win"] = parseInt(user_d[2]);
      user["lose"] = parseInt(user_d[3]);
      user["tie"] = parseInt(user_d[4]);
      user["rock"] = parseFloat(user_d[5]);
      user["paper"] = parseFloat(user_d[6]);
      user["scissors"] = parseFloat(user_d[7]);
      user["winLoss"] = parseFloat(user_d[8]);
      info.push(user);
    } if(file == "data/villains.csv" && user_d[0]){
      user["name"] = user_d[0];
      user["win"] = parseInt(user_d[1]);
      user["lose"] = parseInt(user_d[2]);
      user["tie"] = parseInt(user_d[3]);
      user["rock"] = parseFloat(user_d[4]);
      user["paper"] = parseFloat(user_d[5]);
      user["scissors"] = parseFloat(user_d[6]);
      user["winLoss"] = parseFloat(user_d[7]);
      info.push(user);
    }
  }
  return info;
}

function writeCSV(csv_data, csv){
  var data = "";

  //sorts the villains
  csv_data.sort(function(v1,v2) {
    var v2winRatio = 0;
    if (v2.win+v2.lose+v2.tie == 0) {
      v2winRatio = 0;
    } else {
      v2winRatio = Math.round((v2.win/v2.win+v2.lose+v2.tie)*100);
    }

    var v1winRatio = 0;
    if (v1.win+v1.lose+v1.tie == 0) {
      v1winRatio = 0;
    } else {
      v1winRatio = Math.round((v1.win/v1.win+v1.lose+v1.tie)*100);
    }
    var diff = v2winRatio-v1winRatio
    return (diff);
  });

  for(var i=0; i<csv_data.length; i++){
    var rows = Object.keys(csv_data[i]);

    for(var j=0; j<rows.length; j++){
        if(csv_data[i][rows[j+1]]=="undefined"){
            break;
        } if(j == rows.length-1){
            data += csv_data[i][rows[j]];
        } else {
          data += csv_data[i][rows[j]]+",";
        }
    }

    if (i!=csv_data.length-1){
        data+="\n";
    }
  }
  fs.writeFile(csv,data,'utf8',function(){});
}

var counter = 0;
function strategy(weapon,villain){
  var random = Math.random();
  if(villain == "bones"){
    return "rock";
  }
  if(villain == "comic_hans"){
    if(weapon=="rock"){
      return "rock"
    }if(weapon=="paper"){
      return "paper"
    }if(weapon=="scissors"){
      return "scissors"
    }
  }
  if(villain == "gato"){
      if(random>0.7){
        return "rock"
      } else{
        return "paper"
      }
  }

  if(villain == "harry"){
      return "scissors";
  }

  if(villain == "manny"){
      return "rock";
  }

  if(villain == "mickey"){
      return "scissors";
  }

  if(villain == "mr_modern"){
      return "paper";
  }

  if(villain == "pixie"){
        return "scissors";
  }

  if(villain == "regal"){
      counter++;
      if(counter%3==0){
        return "rock";
      } if(counter%2==0 && !(counter%3==0)){
        return "paper";
      } else{
        return "scissors";
      }
  }

  if(villain == "spock"){
    return "scissors";
  }

  if(villain == "the_boss"){
      if(random > 0.5){
        return "paper"
      } if (random<0.3){
        return "scissors"
      } else {
        return "rock"
      }
  }

  if(villain == "the_magician"){
      if(weapon=="rock"){
        return "paper"
      }if(weapon=="paper"){
        return "scissors"
      }if(weapon=="scissors"){
        return "rock"
      }
  } else{return "rock";}
}
app.get('/rules', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules');
});
app.get('/stats', function(request, response){
  var userData = loadCSV('data/users.csv');
  var villainData = loadCSV('data/villains.csv');
  console.log(villainData);


//   //load the csv
//   var users_file=fs.readFileSync('data/users.csv','utf8');
//
//   //parse the csv
//   var rows=users_file.split('\n');
//
//   var user_data=[];
//   for(var i=1; i<rows.length; i++){
//     var user_d=rows[i].trim().split(',');
//     var user ={};
//     user["name"]=user_d[0];
//     user["games_played"]=parseInt(user_d[1]);
//     user["games_won"]=parseInt(user_d[2]);
//     user["games_lost"]=parseInt(user_d[3]);
//     user_data.push(user);
// }

  //order the villains
  // var vals = []
  // for(var i = 0; i<villainData.length; i++){
  //   //console.log(villainData[i]["winLoss"])
  //   vals.push(villainData[i]["winLoss"]);
  // }
  // console.log(vals)
  // vals.sort();
  //
  // var order = {}
  // for(var j = 0; j<vals.length; j++){
  //   for(var i = 0; i<villainData.length; i++){
  //     if(villainData[i]["winLoss"] == vals[j] && !()){
  //       order.push(villainData[i]);
  //       break;
  //     }
  //   }
  // }


  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('stats',{user:userData, villain:villainData});
});
app.get('/about', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about');
});
