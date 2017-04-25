var pokemonsData = null;
var userData = null;
var host = window.location.host;
var rootURL = "http://" + host + "/GOTracker";
var login = localStorage.getItem("login");
var currentPokemon = null;
var loaded 

$.ajax({
	type : 'GET',
	url : rootURL + '/tracker/pokemons',
	dataType : "json",
	success : function(data) {
		if (null != data) {
			pokemonsData = data;
			console.log(pokemonsData)
			$.each(data, function(key, poke){
				if(poke.evolutions.evolution.length !=  0){
					addPokemonToList(poke);
				}
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

console.log(login);

function getPokemon(pokemonID){
	var pokemon = null;
	$.each(pokemonsData, function(key, poke){
		if(parseInt(poke.pokemonID) == pokemonID){
			pokemon = poke;
		}
	});
	return pokemon;
}

function addPokemonToList(poke){
	var div = document.createElement('div');
	var bgc = poke.pokemonID <= 151 ? 'lightblue' : 'pink'
		div.style = 'float:left;margin:1px;border-radius:2px;background-color:' + bgc + ';min-width=80px;min-height:80px; max-width=80px; max-height:80px;';
	div.addEventListener("click", function(){
		pokemonClicked(poke.pokemonID)
	});
	var img = document.createElement('img');
	img.id = 'image'+poke.pokemonID;
	img.src = poke.image_url;
	img.setAttribute('style','min-width=80px; min-height:80px; max-width=80px; max-height:80px;');
	var starDiv = document.createElement('div');
	starDiv.style.height = '0px';
	starDiv.style.width = '0px';
	starDiv.style.float = 'left';
	$.each(poke.evolutions.evolution, function(key, evol){
		var src = '';
		if(evol.item == 'KINGS_ROCK'){
			src = 'img/kings_rock.gif';
		}else if(evol.item == 'UPGRADE'){
			src = 'img/up-grade.gif';
		}else if(evol.item == 'SUN_STONE'){
			src = 'img/sun_stone.gif';
		}else if(evol.item == 'DRAGON_SCALE'){
			src = 'img/dragon_scale.gif';
		}else if(evol.item == 'METAL_COAT'){
			src = 'img/metal_coat.gif';
		}
		if(evol.item != 'NONE'){
			var starImg = document.createElement('img');
			var size = 16
			//starImg.id = 'star'+poke.pokemonID;
			starImg.src = src;
			starImg.setAttribute('style','float:left;width:'+size+'px;max-heigth:'+size+'px;')
			starDiv.appendChild(starImg);
		}

	});
	
	div.appendChild(starDiv);
	div.appendChild(img);
	document.getElementById("pokemonList").appendChild(div);
}

function getMyPokemon(pokemonID){
	var mypokemon = null
	$.each(userData.mypokemons.mypokemon, function(key, mypoke){
		if(parseInt(mypoke.pokemonID) == parseInt(pokemonID)){
			mypokemon = mypoke
		}
	});
	return mypokemon;
}

function loadPokemon(pokemonID){
	currentPokemon = getPokemon(pokemonID);
	var bgc = currentPokemon.pokemonID <= 151 ? 'lightblue' : 'pink';
	var gif = document.getElementById('pokemon_gif');
	gif.src = currentPokemon.gif_url;
	gif.setAttribute('style','background-color:' + bgc);
}

function pokemonClicked(pokemonID){
	document.getElementById('pokemonListContainer').hidden = true;
	document.getElementById('singlePokemonContainer').hidden = false;
	loadPokemon(pokemonID)
	
}

function back(){
	document.getElementById('pokemonListContainer').hidden = false
	document.getElementById('singlePokemonContainer').hidden = true
	document.getElementById('pokemon_gif').src = '';
}

function prevPokemon(){
	loadPokemon(parseInt(currentPokemon.pokemonID) - 1)
}

function nextPokemon(){
	pokemonClicked(parseInt(currentPokemon.pokemonID) + 1)
}
 

//onmouseover="javascript:replaceImage('+ poke.pokemonID +');"
//onmouseout="javascript:replaceGif('+ poke.pokemonID +');"

//function replaceGif(pokeID){
//var pokemonID = '' + pokeID
//while(pokemonID.length < 3){
//pokemonID = '0' + pokemonID
//}
//document.getElementById("image" + pokemonID).src = getPokemon(pokemonID).image_url;
//}

//function replaceImage(pokeID){
//var pokemonID = '' + pokeID
//while(pokemonID.length < 3){
//pokemonID = '0' + pokemonID
//}
//document.getElementById("image" + pokemonID).src = getPokemon(pokemonID).gif_url;
//}