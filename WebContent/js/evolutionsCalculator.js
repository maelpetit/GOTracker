var pokemonsData = null;
var userData = null;
var host = window.location.host;
var rootURL = "http://" + host + "/GOTracker";
var login = localStorage.getItem("login");

$(function() {
	
	console.log(login);
	
	$.ajax({
		type : 'GET',
		url : rootURL + '/tracker/pokemons',
		dataType : "json",
		success : function(data) {
			if (null != data) {
				pokemonsData = data;
				$.each(data, function(key, poke){
					addPokemonToList(poke);
				});
			}

		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('getUser error: ' + textStatus);
		}
	});

	$.ajax({
		type : 'GET',
		url : rootURL + "/tracker/users/" + login,
		dataType : "json",
		success : function(data) {
			if (null != data) {
				userData = data;
				$('#username').append(data.username);
			}

		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('getUser error: ' + textStatus);
		}
	});
	
});

function getPokemon(pokemonID){
	var pokemon = null;
	$.each(pokemonsData, function(jey, poke){
		if(parseInt(poke.pokemonID) == pokemonID){
			pokemon = poke;
		}
	});
	return pokemon;
}

function addPokemonToList(poke){
	var div = document.createElement('div');
	div.innerHTML = '<div style="float:left;min-width=80px; min-height:80px; max-width=80px; max-height:80px;margin:1px;border-radius:2px;background-color:lightblue;">\
		<img id="image'+poke.pokemonID+'" src="'+poke.image_url+'" onclick="javascript:pokemonClicked('+poke.pokemonID+');" style="min-width=80px; min-height:80px; max-width=80px; max-height:80px;"></a></div>';
	document.getElementById("pokemonList").appendChild(div)
}

function pokemonClicked(pokemonID){
	var pokemon = getPokemon(pokemonID)
	document.getElementById('pokemonListContainer').hidden = true;
	document.getElementById('singlePokemonContainer').hidden = false;
	document.getElementById('pokemon_gif').src = pokemon.gif_url;
}

function back(){
	document.getElementById('pokemonListContainer').hidden = false
	document.getElementById('singlePokemonContainer').hidden = true
	document.getElementById('pokemon_gif').src = '';
}

//onmouseover="javascript:replaceImage('+ poke.pokemonID +');"
//onmouseout="javascript:replaceGif('+ poke.pokemonID +');"

//function replaceGif(pokeID){
//	var pokemonID = '' + pokeID
//	while(pokemonID.length < 3){
//		pokemonID = '0' + pokemonID
//	}
//	document.getElementById("image" + pokemonID).src = getPokemon(pokemonID).image_url;
//}
//
//function replaceImage(pokeID){
//	var pokemonID = '' + pokeID
//	while(pokemonID.length < 3){
//		pokemonID = '0' + pokemonID
//	}
//	document.getElementById("image" + pokemonID).src = getPokemon(pokemonID).gif_url;
//}