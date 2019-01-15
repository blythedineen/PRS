var player_name = localStorage.getItem("player_name");


document.getElementById("opponentDrop").addEventListener("change",function(){
  if(document.getElementById("opponentDrop").value=="bones"){
    showOrNot("bones_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="gato"){
    showOrNot("gato_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="comic_hans"){
    showOrNot("comic_hans_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="harry"){
    showOrNot("harry_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="manny"){
    showOrNot("manny_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="mickey"){
    showOrNot("mickey_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="mr_modern"){
    showOrNot("mr_modern_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="pixie"){
    showOrNot("pixie_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="regal"){
    showOrNot("regal_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="spock"){
    showOrNot("spock_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="the_boss"){
    showOrNot("the_boss_waiting",true);
  }
  else if(document.getElementById("opponentDrop").value=="the_magician"){
    showOrNot("the_magician_waiting",true);
  }

})

///////////////////Helper function//////////////////
function updateNames(name){
  var name_spots=document.getElementsByClassName("player_name_span");
  for(var i=0; i<name_spots.length;i++){
    console.log(name_spots[i]);
    name_spots[i].innerHTML = name;
  }
}


function showOrNot(div_element, show){
  if(show && div_element.classList.contains("hidden")){
    div_element.classList.remove("hidden");
    div_element.classList.add("visible");
  }else if(!show && div_element.classList.contains("visible")){
    div_element.classList.remove("visible");
    div_element.classList.add("hidden");
    }
}

function toggleVisibility(button_element, div_element){
  button_element.addEventListener("click", function(){
    if(div_element.classList.contains("hidden")){
      div_element.classList.remove("hidden");
      div_element.classList.add("visible");
    }else{
      div_element.classList.remove("visible");
      div_element.classList.add("hidden");
      }
  });
}
