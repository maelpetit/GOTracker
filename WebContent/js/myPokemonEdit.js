var userData = null;
var pokemonsData = null;
var blankRemoved = false;
var favIDs = [];
var quickmovesData = null;
var chargemovesData = null;
$(function() {

	var host = window.location.host;

	var rootURL = "http://" + host + "/GOTracker";
	var login = localStorage.getItem("login");

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
		url : rootURL + '/tracker/moves/quick',
		dataType : "xml",
		success : function(data) {
			quickmovesData = data.documentElement;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('getQuickMoves error: ' + textStatus);
		}
	});
	
	$.ajax({
		type : 'GET',
		url : rootURL + '/tracker/moves/charge',
		dataType : "xml",
		success : function(data) {
			chargemovesData = data.documentElement;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('getChargeMoves error: ' + textStatus);
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

//	function addPokemontoDropDown(poke){
//	var select = document.getElementById("mypokemons");
//	var option = document.createElement("option");
//	option.value = poke.pokemonID;
//	option.text = '#' + poke.pokemonID + ' ' + capitalizeFirstLetter(poke.name);
//	select.add(option);
//	}

	function editMyPokemon(){
		var caught = document.getElementById("caught").checked;
		var nbCandies = document.getElementById("nbCandies").value;
		var myfavs = [];

		$.each(favIDs, function(key, favID){
			var fav = {};
			fav['PC'] = document.getElementById('PC' + favID).value;
			fav['wonder'] = document.getElementById('wonder' + favID).checked;
			fav['quickmove'] = document.getElementById('quickmove' + favID).value;
			fav['chargemove'] = document.getElementById('chargemove' + favID).value;
			myfavs.push(fav);
		});

		var pokemonID = '' + currentPokemonID;
		while(pokemonID.length < 3){
			pokemonID = '0' + pokemonID
		}
		console.log("edit pokemon " + pokemonID + " for user " + login);
		$.ajax({
			type : 'POST',
			url : rootURL + "/tracker/users/" + login + "/pokedex",
			contentType : 'application/json',
			data : JSON.stringify({
				"pokemonID" : pokemonID,
				"caught" : caught,
				"nbCandies" : nbCandies,
				"myfavs" : {"myfav" : myfavs}
			}),
			dataType : "json",
			success : function(data) {

				$.each(userData.mypokemons.mypokemon, function(key, mypoke){
					document.getElementById('submitButton').style.color = 'green';
					unsavedchanges = false;
					if(mypoke.pokemonID == currentPokemonID){
						mypoke.nbCandies = nbCandies;
						mypoke.caught = caught;
						mypoke.myfavs = {"myfav": myfavs}
					}
				});
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log('editMyPokemon error: ' + errorThrown);
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

var favCount = 0;
var addFavButtonLoaded = false;
var unsavedchanges = false;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPokemon(pokemonID){
	var pokemon = null;
	$.each(pokemonsData, function(jey, poke){
		if(parseInt(poke.pokemonID) == parseInt(pokemonID)){
			pokemon = poke;
		}
	});
	return pokemon;
}
/// min-width=80px;min-height:80px; max-width=80px; max-height:80px;
function addPokemonToList(poke){
	var div = document.createElement('div');
	var size = 72
	var bgc = poke.pokemonID <= 151 ? 'lightblue' : 'pink'
		div.style = 'float:left;margin:1px;border-radius:2px;background-color:' + bgc + ';min-width='+size+'px;min-height:'+size+'px; max-width='+size+'px; max-height:'+size+'px;';
	div.addEventListener("click", function(){
		pokemonClicked(poke.pokemonID)
	})

	var mypokemon = getMyPokemon(poke.pokemonID);
	var starDiv = document.createElement('div');
	starDiv.style.height = '0px';
	starDiv.style.width = '0px';
	starDiv.style.float = 'left';

	if(mypokemon.caught){
		var src = 'img/pokeball1.gif';
		if(mypokemon.myfavs != null){
			$.each(mypokemon.myfavs.myfav, function(key, myfav){
				if(myfav.wonder){//if one fav is wonder
					src = 'img/star.gif';
				}
			});
		}
		var starImg = document.createElement('img');
		//starImg.id = 'star'+poke.pokemonID;
		starImg.src = src;
		starImg.setAttribute('style','float:left;')
		starDiv.appendChild(starImg);
	}
	div.appendChild(starDiv);
	var img = document.createElement('img');
	img.id = 'image'+poke.pokemonID
	img.src = poke.image_url
	img.setAttribute('style','min-width='+size+'px; min-height:'+size+'px; max-width='+size+'px; max-height:'+size+'px;')
	div.appendChild(img)
	document.getElementById("pokemonList").appendChild(div)
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

var currentPokemonID;
function loadMyPokemon(pokemonID){
	if(!addFavButtonLoaded){
		$("#favDiv").append('<button type="button" id="addFavoriteButton" onclick="javascript:changeOccured();javascript:addFavorite();" >Add A Favorite Pokemon</button>');
		addFavButtonLoaded = true;
	}
	if(unsavedchanges){
		if (confirm("Discard Unsaved Changes ?") == true) {
			unsavedchanges = false;
			document.getElementById('submitButton').style.color = 'black';
		}else{return}
	}
	currentPokemonID = pokemonID;
	var pokemon = getPokemon(pokemonID)
	var image = document.getElementById("image");
	image.src = pokemon.gif_url;
	document.getElementById("pokemonName").innerHTML = '#' + pokemon.pokemonID + ' ' + capitalizeFirstLetter(pokemon.name)
	favIDs = [];
	favCount = 0;
	document.getElementById("favorites").innerHTML = "";
	$.each(userData.mypokemons.mypokemon, function(key, mypoke){
		if(mypoke.pokemonID == pokemonID){
			document.getElementById("caught").checked = mypoke.caught;
			document.getElementById("nbCandies").value = mypoke.nbCandies;
			if(mypoke.myfavs != undefined){
				$.each(mypoke.myfavs.myfav, function(key, myfav){
					appendFavorite(myfav, pokemonID);
				});
				console.log(mypoke.myfavs)
			}
		}
	});

}

function addFavorite(){
	var div = document.createElement('div');
	div.id = "fav"+favCount;
	div.innerHTML = '<label>PC </label><input type="number" id="PC'+favCount+'" value=0 onchange="javascript:changeOccured();">\
	<label>Wonder </label><input type="checkbox" id="wonder'+favCount+'" onchange="javascript:changeOccured();">\
	<label>Quick Move </label><select id="quickmove'+favCount+'" onchange="javascript:changeOccured();javascript:hideBlank(quickmove'+favCount+');"><option value="blank"></option></select>\
	<label>Charge Move </label><select id="chargemove'+favCount+'" onchange="javascript:changeOccured();javascript:hideBlank(chargemove'+favCount+');"><option value="blank"></option></select>\
	<button type="button" id="remove'+favCount+'" onclick="javascript:changeOccured();javascript:removeFavorite('+favCount+');">X</button>';
	document.getElementById('favorites').appendChild(div);
	addQuickMovestoDropDown(favCount, currentPokemonID);
	addChargeMovestoDropDown(favCount, currentPokemonID);
	favIDs.push(favCount);
	favCount++;
}

function removeFavorite(idFav){
	var fav = document.getElementById("fav" + idFav);
	fav.innerHTML = "";
	fav.parentNode.removeChild(fav);
	favIDs.splice(idFav, 1);
}

function appendFavorite(myfav, pokemonID){
	var div = document.createElement('div');
	div.id = "fav"+favCount;
	
	var label = document.createElement('label');
	label.innerHTML = 'PC ';
	div.appendChild(label);
	var input = document.createElement('input');
	input.setAttribute('type', 'number');
	input.setAttribute('id', 'PC'+favCount);
	input.setAttribute('value', myfav.PC);
	input.addEventListener('onchange', function(){
		changeOccured();
	});
	div.appendChild(input)
	
	label = document.createElement('label');
	label.innerHTML = 'Wonder ';
	div.appendChild(label);
	input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('id', 'wonder'+favCount);
	input.checked = myfav.wonder;
	input.addEventListener('onchange', function(){
		changeOccured();
	});
	div.appendChild(input)
	
	label = document.createElement('label');
	label.innerHTML = 'Quick Move ';
	div.appendChild(label);
	input = document.createElement('select');
	input.setAttribute('id', 'quickmove'+favCount);
	input.addEventListener('onchange', function(){
		changeOccured();
	});
	div.appendChild(input)
	
	label = document.createElement('label');
	label.innerHTML = 'Charge Move ';
	div.appendChild(label);
	input = document.createElement('select');
	input.setAttribute('id', 'chargemove'+favCount);
	input.addEventListener('onchange', function(){
		changeOccured();
	});
	div.appendChild(input)
	
	var suppr = document.createElement('button');
	suppr.id = 'remove' + favCount;
	suppr.innerHTML = 'X';
	suppr.setAttribute('onclick','changeOccured();removeFavorite('+favCount+');');
	div.appendChild(suppr)
	
	document.getElementById('favorites').appendChild(div);
	addQuickMovestoDropDown(favCount, pokemonID);
	addChargeMovestoDropDown(favCount, pokemonID);
	document.getElementById('quickmove'+favCount).value = myfav.quickmove;
	document.getElementById('chargemove'+favCount).value = myfav.chargemove;
	favIDs.push(favCount);
	favCount++;
}

function hideBlank(selectName){
	if(selectName[0].value == 'blank'){
		selectName.remove(0);
	}
}

function getQuickMove(name){
	var qm = null
	$.each(quickmovesData.childNodes, function(key, quickmove){
		if(quickmove.getElementsByTagName('name')[0].textContent == name){
			qm = quickmove
		}
	});
	return qm;
}

function getChargeMove(name){
	var cm = null
	$.each(chargemovesData.childNodes, function(key, chargemove){
		if(chargemove.getElementsByTagName('name')[0].textContent == name){
			cm = chargemove
		}
	});
	return cm;
}

function addQuickMovestoDropDown(favC, pokemonID){
	var select = document.getElementById("quickmove" + favC);
	$.each(getPokemon(pokemonID).quickmoves.quickmove, function(key, quickmove){
		var option = document.createElement("option");
		option.value = quickmove.name;
		var quickmoveXML = getQuickMove(quickmove.name);
		var dps = quickmoveXML.getElementsByTagName('damagePerSec')[0].textContent
		option.text = capitalizeFirstLetter(quickmove.name) + ' (' + dps + ' dps)';
		select.add(option);
	});
}

function addChargeMovestoDropDown(favC, pokemonID){
	var select = document.getElementById("chargemove" + favC);
	$.each(getPokemon(pokemonID).chargemoves.chargemove, function(key, chargemove){
		var option = document.createElement("option");
		option.value = chargemove.name;
		var chargemoveXML = getChargeMove(chargemove.name);
		var dps = chargemoveXML.getElementsByTagName('damagePerSec')[0].textContent
		option.text = capitalizeFirstLetter(chargemove.name) + ' (' + dps + ' dps)';
		select.add(option);
	});
}

function changeOccured(){
	document.getElementById("submitButton").style.color="red";
	unsavedchanges = true;

}


function back(){
	document.getElementById("pokemonList").hidden=false
	//document.getElementById("pokemonList").style.height = '100%'
	document.getElementById("leftspacer").innerHTML = '&nbsp;';
	document.getElementById("mypokemon").hidden=true
}

function prevPokemon(){
	document.getElementById('submitButton').style.color = 'black';
	loadMyPokemon(parseInt(currentPokemonID) - 1)
}

function nextPokemon(){
	document.getElementById('submitButton').style.color = 'black';
	loadMyPokemon(parseInt(currentPokemonID) + 1)
}


function pokemonClicked(pokemonID){
	loadMyPokemon(pokemonID)
	document.getElementById("pokemonList").hidden=true
	//document.getElementById("pokemonList").style.height = '0px';
	document.getElementById("leftspacer").innerHTML = '';
	document.getElementById("mypokemon").hidden=false
}