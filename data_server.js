var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');


var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

var port = 3000;
app.listen(port, function(){
  console.log('Server started at '+ new Date()+', on port ' + port+'!');
});

app.get('/', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/login', function(request, response){
  var user=request.query.player_name+", "+request.query.password;
  //var data=fs.readFile("data/users.csv","utf8");
  var user_data={
      name: request.query.player_name,
      password: request.query.password
  };

  //fs.writeFile("data/users.csv",user,"utf8");
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('game', {user:user_data});
});

app.get('/logout', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/playAgain', function(request, response){
  //use the saved username and password which resets when you return to login page
  var user_data={};
  user_data["name"] = userName;
  user_data["pswd"] = userPSWD;
  var csv_data = loadCSV("data/users.csv");
  //if the saved username is empty than return to index page
  if (user_data["name"] == "") {
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('index', {page:request.url, user:user_data, title:"Index"});
  }

  if (!findUser(user_data,csv_data,request,response, "playGame")){
    newUser(user_data);
    csv_data.push(user_data);
    upLoadCSV(csv_data, "data/users.csv");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('game', {page:request.url, user:user_data, title:"playGame"});
  }
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
      if(usersCSV[0] == "rock"){
        usersCSV[i]["rock"] += 1;
      }if(usersCSV[0] == "paper"){
        usersCSV[i]["paper"] += 1;
      }if(usersCSV[0] == "scissors"){
        usersCSV[i]["scissors"] += 1;
      }
      if(villainStuff[1]=="tie"){
        usersCSV[i]["ties"] += 1;
      } if(villainStuff[1]=="lose"){
        usersCSV[i]["losses"] += 1;
      } if(villainStuff[1]=="win"){
        usersCSV[i]["wins"]+=1;
      }
    }
  }
  upLoadCSV(usersCSV, "data/users.csv");

  //for (i=1; i<usersCSV.length/8; i++){
  //  usersCSV[i*8].concat("\n");
  //}
  //fs.writeFile("data/users.csv", usersCSV.toString(), "utf8");

  var villainsCSV = loadCSV("data/villains.csv");
  for(var i = 0; i < usersCSV.length; i++){
    if(villainsCSV[i]["name"] == user_data.villain){
      if(villainStuff[0] == "rock"){
        villainsCSV[i]["rock"] += 1;
      }if(villainStuff[0] == "paper"){
        villainsCSV[i]["paper"] += 1;
      }if(villainStuff[0] == "scissors"){
        villainsCSV[i]["scissors"] += 1;
      }
      if(villainStuff[1]=="tie"){
        villainsCSV[i]["ties"] += 1;
      } if(villainStuff[1]=="lose"){
        villainsCSV[i]["wins"] += 1;
      } if(villainStuff[1]=="win"){
        villainsCSV[i]["losses"]
      }
    }
  }
  //for (i=1; i<villainsCSV.length/7; i++){
  //  villainsCSV[i*7].concat("\n");
  //}
  //fs.writeFile("data/villains.csv", villainsCSV.toString(), "utf8");

  upLoadCSV(villainsCSV, "data/villains.csv");


  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results', {user:user_data});
});



var villainStuff = [];
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
  var data = fs.readFileSync(file, "utf8");
  var rows = data.split('\n');
  var type = 0;
  if(file == "data/users.csv"){
    type = 1;
  }
  var info = [];
  for(var i = 0; i < rows.length; i++) {
      var user_d = rows[i].trim().split(",");
      var user = {};
      if (type ==0){
        user["password"] = user_d[1];
      }
        user["name"] = user_d[0];
        user["wins"] = parseInt(user_d[1+type]);
        user["losses"] = parseInt(user_d[2+type]);
        user["ties"] = parseInt(user_d[3+type]);
        user["rock"] = parseFloat(user_d[4+type]);
        user["paper"] = parseFloat(user_d[5+type]);
        user["scissors"] = parseFloat(user_d[6+type]);
        info.push(user);
      }
  return info;
}

function upLoadCSV(user_data, file_name) {
  console.log("please tell me this is working or else I will cry")
  var out="";
  for (var i = 0; i < user_data.length; i++) {
    arr=Object.keys(user_data[i]);
    for (var k=0;k<arr.length;k++){
      if(k == arr.length-1) {
        out+=user_data[i][arr[k]];
      } else {
        out+=user_data[i][arr[k]]+",";
      }
    }
    if (i!=user_data.length-1){
        out+="\n";
    }
  }
  console.log(out);
  fs.writeFileSync(file_name, out, "utf8")
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
  //load the csv
  var users_file=fs.readFileSync('data/users.csv','utf8');
  console.log(users_file);
  //parse the csv
  var rows=users_file.split('\n');
  console.log(rows);
  var user_data=[];
  for(var i=1; i<rows.length; i++){
    var user_d=rows[i].trim().split(',');
    console.log(user_d);
    var user ={};
    user["name"]=user_d[0];
    user["games_played"]=parseInt(user_d[1]);
    user["games_won"]=parseInt(user_d[2]);
    user["games_lost"]=parseInt(user_d[3]);
    user_data.push(user);
}
console.log(user_data);
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('stats',{user:user_data});
});
app.get('/about', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about');
});
