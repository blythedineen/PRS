var player_name = localStorage.getItem("player_name");


document.getElementById("opponentDrop").addEventListener("change",function(){
  hideAll();
  showOrNot(document.getElementById(document.getElementById("opponentDrop").value+"_waiting"), true);
})
  function hideAll(){
    var spots=document.getElementsByClassName("villain_pictures");
    for(var i=0; i<spots.length;i++){
      console.log(spots[i]);
      showOrNot(document.getElementById(spots[i].id),false);
    }
  }
  /*if(document.getElementById("opponentDrop").value==){
    showOrNot(document.getElementById("bones_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="gato"){
    showOrNot(document.getElementById("gato_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="comic_hans"){
    showOrNot(document.getElementById("comic_hans_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="harry"){
    showOrNot(document.getElementById("harry_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="manny"){
    showOrNot(document.getElementById("manny_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="mickey"){
    showOrNot(document.getElementById("mickey_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="mr_modern"){
    showOrNot(document.getElementById("mr_modern_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="pixie"){
    showOrNot(document.getElementById("pixie_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="regal"){
    showOrNot(document.getElementById("regal_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="spock"){
    showOrNot(document.getElementById("spock_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="the_boss"){
    showOrNot(document.getElementById("the_boss_waiting"),true);
  }
  else if(document.getElementById("opponentDrop").value=="the_magician"){
    showOrNot(document.getElementById("the_magician_waiting"),true);
  }
  else {

  }*/



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
