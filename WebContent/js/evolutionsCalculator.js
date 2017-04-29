var pokemonsData = null;
var userData = null;
var host = window.location.host;
var rootURL = "http://" + host + "/GOTracker";
var login = localStorage.getItem("login");
var currentPokemon = null;
var loaded = 0;
var myEvols = [];
var newPokemons;

window.addEventListener('keyup',this.check,false);

function check(event) {
	if((event.keyCode <= 57 && event.keyCode >= 48) || (event.keyCode <= 105 && event.keyCode >= 96) || (event.keyCode == 8) || (event.keyCode == 46)){
		canEvolve();
		return false;
	}
	if (event.keyCode == 39) {
		saveNumbers();
		nextPokemon();
		return false;
	}
	if (event.keyCode == 37) {
		saveNumbers();
		prevPokemon();
		return false;
	}
//	if (event.keyCode == 13) {
//		computeEvolutions();
//		return false;
//	}
}

function computeEvolutions(){

	newPokemons = 0;

	$.each(myEvols, function(key, myEvol){
		computeEvol1Evol2(myEvol);
		while(myEvol.nbPokemons > myEvol.nbEvol1){
			computeEvol1Evol2(myEvol);
			myEvol.nbPokemons--;
			myEvol.nbCandies++;
		}
		if(myEvol.nbEvol1 > 0 && myEvol.caughtNext == false){
			newPokemons++;
			myEvol.newPoke = true;
			myEvol.caughtNext = true;
		}
	});
	console.log('EvolutionsComputed : newPokemons = ' + newPokemons)
}

function computeEvol1Evol2(myEvol){
	myEvol.nbEvol1 = parseInt(myEvol.nbCandies/myEvol.nbCandiesToEvolve);
	myEvol.nbEvol2 = parseInt((myEvol.nbEvol1+myEvol.nbEvol2)*1.5/myEvol.nbCandiesToEvolve);
}

function saveNumbers(){
	var nbPokemons = document.getElementById("nbPokemons").value;
	var nbCandies = document.getElementById("nbCandies").value;
	if(nbPokemons != '' && nbCandies != ''){
		$.each(myEvols, function(key, evol){
			if(evol.number == currentPokemon.pokemonID){
				evol.nbPokemons = nbPokemons;
				evol.nbCandies = nbCandies;
			}
		});
	}
}

$.ajax({
	type: 'GET',
	url: rootURL + '/tracker/pokemons',
	dataType: "json",
	success: function (data) {
		if (null != data) {
			pokemonsData = data;
			loaded++;
			setupPokemonList();
		}

	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('getUser error: ' + textStatus);
	}
});

$.ajax({
	type: 'GET',
	url: rootURL + "/tracker/users/" + login,
	dataType: "json",
	success: function (data) {
		if (null != data) {
			userData = data;
			$('#username').append(data.username);
			loaded++;
			setupPokemonList();
		}

	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.log('getUser error: ' + textStatus);
	}
});

console.log(login);

function getPokemon(pokemonID) {
	var pokemon = null;
	$.each(pokemonsData, function (key, poke) {
		if (poke.pokemonID == pokemonID) {
			pokemon = poke;
		}
	});
	return pokemon;
}

function getMyEvol(number) {
	var myEvol = null;
	$.each(myEvols, function (key, myevol) {
		if (myevol.number == number) {
			myEvol = myevol;
		}
	});
	return myEvol;
}

function setupPokemonList(){
	if(loaded >= 2){
		$.each(pokemonsData, function (key, poke) {
			if (poke.evolutions.evolution.length != 0) {
				addPokemonToList(poke);
			}
		});
		//console.log(myEvols);
	}
}

function addPokemonToList(poke) {
	var div = document.createElement('div');
	var bgc = poke.pokemonID <= 151 ? 'lightblue' : 'pink'
		div.style = 'float:left;margin:1px;border-radius:2px;background-color:' + bgc + ';min-width=80px;min-height:80px; max-width=80px; max-height:80px;';
	div.addEventListener("click", function () {
		pokemonClicked(poke.pokemonID)
	});
	var img = document.createElement('img');
	img.id = 'image' + poke.pokemonID;
	img.src = poke.image_url;
	img.setAttribute('style', 'min-width=80px; min-height:80px; max-width=80px; max-height:80px;');
	var starDiv = document.createElement('div');
	starDiv.style.height = '0px';
	starDiv.style.width = '0px';
	starDiv.style.float = 'left';
	var nbCandiesToEvolve = 0;
	var nextEvolution = '';
	$.each(poke.evolutions.evolution, function (key, evol) {
		var src = '';
		if (evol.item == 'KINGS_ROCK') {
			src = 'img/kings_rock.gif';
		} else if (evol.item == 'UPGRADE') {
			src = 'img/up-grade.gif';
		} else if (evol.item == 'SUN_STONE') {
			src = 'img/sun_stone.gif';
		} else if (evol.item == 'DRAGON_SCALE') {
			src = 'img/dragon_scale.gif';
		} else if (evol.item == 'METAL_COAT') {
			src = 'img/metal_coat.gif';
		}
		if (evol.item != 'NONE') {
			var starImg = document.createElement('img');
			var size = 16
			//starImg.id = 'star'+poke.pokemonID;
			starImg.src = src;
			starImg.setAttribute('style', 'float:left;width:' + size + 'px;max-heigth:' + size + 'px;')
			starDiv.appendChild(starImg);
		}
		if(nbCandiesToEvolve == 0 || evol.nbCandies < nbCandiesToEvolve){
			nbCandiesToEvolve = evol.nbCandies;
			nextEvolution = evol.pokemonID;
		}
	});

	var myNextEvol = getMyPokemon(nextEvolution);

	var myEvol = {
			"number" : poke.pokemonID,
			"nbPokemons" : '',
			"nbCandies" : '',
			"nbCandiesToEvolve" : nbCandiesToEvolve,
			"nbEvol1" : 0,
			"nbEvol2" : 0,
			"caughtNext" : myNextEvol.caught,
			"newPoke" : false
	};
	myEvols.push(myEvol);


	div.appendChild(starDiv);
	div.appendChild(img);
	document.getElementById("pokemonList").appendChild(div);
}

function getMyPokemon(pokemonID) {
	var mypokemon = null
	$.each(userData.mypokemons.mypokemon, function (key, mypoke) {
		if (parseInt(mypoke.pokemonID) == parseInt(pokemonID)) {
			mypokemon = mypoke
		}
	});
	return mypokemon;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayListEvols(){
	var table = document.getElementById('listEvols');
	var total1 = 0, total2 = 0;
	$.each(myEvols, function(key, myEvol){
		if(myEvol.nbEvol1 != 0){
			editMyPokemon(getMyEvol(myEvol.number));
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			var pokemon = getPokemon(myEvol.number);
			var image = document.createElement('img');
			image.src = pokemon.image_url;
			td.appendChild(image);
			if(myEvol.newPoke){
				var newDiv = document.createElement('div');
				newDiv.style.width = '0px';
				newDiv.style.height = '0px';
				newDiv.style.float = 'left';
				var newIcon = document.createElement('img');
				newIcon.src = 'img/new.png';
				newIcon.style.width = '50px';
				newDiv.appendChild(newIcon);
				td.appendChild(newDiv);
			}
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = myEvol.nbEvol1;
			td.style.color = 'blue';
			td.style.fontSize = '2em';
			tr.appendChild(td);
			td = document.createElement('td');
			td.innerHTML = myEvol.nbEvol2;
			td.style.color = 'red';
			td.style.fontSize = '2em';
			tr.appendChild(td);
			table.appendChild(tr);
			total1 += myEvol.nbEvol1;
			total2 += myEvol.nbEvol2;
		}
	});

	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.innerHTML = 'TOTAL';
	td.style.fontSize = '2em';
	tr.appendChild(td);
	td = document.createElement('td');
	td.innerHTML = total1;
	td.style.color = 'blue';
	td.style.fontSize = '2em';
	tr.appendChild(td);
	td = document.createElement('td');
	td.innerHTML = total2;
	td.style.color = 'red';
	td.style.fontSize = '2em';
	tr.appendChild(td);
	table.appendChild(tr);

	tr = document.createElement('tr');
	td = document.createElement('td');
	td.innerHTML = 'XP';
	td.style.fontSize = '2em';
	tr.appendChild(td);
	td = document.createElement('td');
	td.innerHTML = (total1 + total2) * 1000;
	td.style.fontSize = '2em';
	td.colSpan = 2;
	td.style.textAlign = 'center';
	tr.appendChild(td);
	table.appendChild(tr);

	document.getElementById('singlePokemonContainer').hidden = true;
	document.getElementById('evolsDiv').hidden = false;
}

function loadPokemon(pokemon) {
	currentPokemon = pokemon;
	var gif = document.getElementById('pokemon_gif');
	gif.src = currentPokemon.gif_url;
	if(currentPokemon.pokemonID <= 1){
		document.getElementById("prevButton").setAttribute('hidden', true);
	}else if(currentPokemon.pokemonID >= pokemonsData.length){
		document.getElementById("nextButton").hidden = true;
	}
	else{
		document.getElementById("prevButton").hidden = false;
		document.getElementById("nextButton").hidden = false;
	}
	document.getElementById("pokemonNumber").innerHTML = '#' + currentPokemon.pokemonID
	document.getElementById("pokemonName").innerHTML = capitalizeFirstLetter(currentPokemon.name)
	document.getElementById('candyImg').src = 'img/candy/' + currentPokemon.species + '_candy.png';
	document.getElementById('pokemonImg').src = currentPokemon.image_url;
	document.getElementById('nbPokemons').focus();
	var myEvol = getMyEvol(currentPokemon.pokemonID);
	document.getElementById('nbPokemons').value = myEvol.nbPokemons;
	document.getElementById('nbCandies').value =  myEvol.nbCandies;
	canEvolve();
}

function editMyPokemon(myEvol){
	//TODO check if unsaved changes
	var myPokemon = getMyPokemon(myEvol.number);
	myPokemon.nbCandies = myEvol.nbCandies;
	myPokemon.nbPokemons = myEvol.nbPokemons;

	console.log(myEvol);
	if(myEvol.newPoke){
		console.log(parseInt(myEvol.number) + 1);
		editNextEvol(myEvol, getMyPokemon(parseInt(myEvol.number) + 1));
	}

	console.log("edit pokemon " + myEvol.number + " for user " + login);
//	$.ajax({
//	type : 'POST',
//	url : rootURL + "/tracker/users/" + login + "/pokedex",
//	contentType : 'application/json',
//	data : JSON.stringify({
//	"pokemonID" : pokemonID,
//	"caught" : caught,
//	"nbCandies" : nbCandies,
//	"nbPokemons" : nbPokemons,
//	"myfavs" : {"myfav" : myfavs}
//	}),
//	dataType : "json",
//	success : function(data) {
//	;
//	},
//	error : function(jqXHR, textStatus, errorThrown) {
//	console.log('editMyPokemon error: ' + errorThrown);
//	}
//	});
}

function editNextEvol(myEvol, myNextPokemon){
	//TODO
}

function computeEvolutionsAndDisplayListEvols(){
	saveNumbers();
	editMyPokemon(getMyEvol(currentPokemon.pokemonID));
	computeEvolutions();
	displayListEvols();
	
}
function pokemonClicked(pokemonID) {
	document.getElementById('evolsDiv').hidden = true;
	document.getElementById('listEvols').innerHTML = '';
	document.getElementById('singlePokemonContainer').hidden = false;
	saveNumbers();
	if(currentPokemon != null){
		editMyPokemon(getMyEvol(currentPokemon.pokemonID));
	}
	loadPokemon(getPokemon(pokemonID));

}

function back() {
	// document.getElementById('pokemonListContainer').hidden = false
	document.getElementById('singlePokemonContainer').hidden = true
	document.getElementById('pokemon_gif').src = '';
}

function prevPokemon() {
	editMyPokemon(getMyEvol(currentPokemon.pokemonID));
	//TODO bloquer au premier pokemon
	do{
		currentPokemon = getPokemon(parseInt(currentPokemon.pokemonID)-1);
	}while(currentPokemon.evolutions.evolution.length === 0);

	loadPokemon(currentPokemon);

}

function nextPokemon() {
	editMyPokemon(getMyEvol(currentPokemon.pokemonID));
	//TODO bloquer au dernier pokemon
	do{
		currentPokemon = getPokemon(parseInt(currentPokemon.pokemonID)+1);

	}while(currentPokemon.evolutions.evolution.length === 0);

	loadPokemon(currentPokemon);
}

function saveChanges(){

}

function changeOccured(){

}

function canEvolve(){
	var nbCandiesToEvolve;
	$.each(myEvols, function(key, myEvol){
		if(myEvol.number == currentPokemon.pokemonID){
			nbCandiesToEvolve = myEvol.nbCandiesToEvolve;
		}
	});
	var nbCandies = document.getElementById('nbCandies').value;
	if(nbCandiesToEvolve <= nbCandies){
		document.getElementById('candyImg').style.filter = 'grayscale(0%)';
		//radial-gradient(#ffff00, #e65822);
	}else{
		document.getElementById('candyImg').style.filter = 'grayscale(90%)';
	}
}