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
  var data=fs.readFile("data/users.csv","utf8");
  var user_data={
      name: request.query.player_name,
      password: request.query.password
  };

  fs.writeFile("data/users.csv",user,"utf8");
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('game', {user:user_data});
});

app.get('/logout', function(request, response){
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
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results', {user:user_data});
});

var villainStuff = []
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

function strategy(weapon,villain){
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
      return "paper";
  }

  if(villain == "harry"){
      return "scissors";
  }

  if(villain == "manny"){
      return "scissors";
  }

  if(villain == "mickey"){
      return "scissors";
  }

  if(villain == "mr_modern"){
      return "scissors";
  }

  if(villain == "pixie"){
        return "scissors";
  }

  if(villain == "regal"){
      return "scissors";
  }

  if(villain == "spock"){
    return "scissors";
  }

  if(villain == "the_boss"){
      return "scissors";
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
