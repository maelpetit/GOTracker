var userData = null;
var blankRemoved = false;

$(function() {

	//TODO use a GET request to load myPokemon infos in new section, then modify with form and POST

	var host = window.location.host;

	var rootURL = "http://" + host + "/GOTracker";
	var login = localStorage.getItem("login")

	$.ajax({
		type : 'GET',
		url : rootURL + "/tracker/users/" + login,
		dataType : "json",
		success : function(data) {
			if (null != data) {
				userData = data;
				$('#username').append(data.username);
				$.each(data.mypokemons.mypokemon, function(key, mypoke){
					addPokemonIDtoSelect(mypoke);
				});
			}

		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('getUser error: ' + textStatus);
		}
	});

	function addPokemonIDtoSelect(mypoke){
		var select = document.getElementById("mypokemons");
		var option = document.createElement("option");
		option.value = mypoke.pokemonID;
		option.text = mypoke.pokemonID;
		select.add(option);
	}
	
	function editMyPokemon(){
		document.getElementById("mypokemons")
		var pokemonID = document.getElementById("mypokemons").value;
		var caught = document.getElementById("caught").checked;
		var nbCandies = document.getElementById("nbCandies").value;

		while(pokemonID.length < 3){
			pokemonID = "0" + pokemonID;
		}

		console.log(login + " " + pokemonID + " " + caught + " " + nbCandies)
		$.ajax({
			type : 'POST',
			url : rootURL + "/tracker/users/" + login + "/pokedex",
			contentType : 'application/json',
			data : JSON.stringify({
				"pokemonID" : pokemonID,
				"caught" : caught,
				"nbCandies" : nbCandies
			}),
			dataType : "json",
			success : function(data) {
				console.log("edit pokemon " + pokemonID + " for user " + login);
				$.each(userData.mypokemons.mypokemon, function(key, mypoke){
					if(mypoke.pokemonID == document.getElementById("mypokemons").value){
						mypoke.nbCandies = nbCandies;
						mypoke.caught = caught;
					}
				});
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log('editMyPokemon error: ' + textStatus);
			}
		});
		

	}

	$("#submitButton").click(function() {
		editMyPokemon();
	});

	$(window).keydown(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			editMyPokemon();
			return false;
		}
	});

});

function loadMyPokemon(){
	if(!blankRemoved){
		document.getElementById("mypokemons").remove(0);
		blankRemoved = true;
	}
	$.each(userData.mypokemons.mypokemon, function(key, mypoke){
		if(mypoke.pokemonID == document.getElementById("mypokemons").value){
			document.getElementById("caught").checked = mypoke.caught;
			document.getElementById("nbCandies").value = mypoke.nbCandies;
		}
	});
}