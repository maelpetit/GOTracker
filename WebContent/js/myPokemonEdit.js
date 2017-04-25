var userData = null;
var pokemonsData = null;
var blankRemoved = false;
var favIDs = [];
var quickmovesData = null;
var chargemovesData = null;
var loaded = 0;
$(function() {


	$("#submitButton").click(function() {
		editMyPokemon();
	});

//	$(window).keydown(function(event) {
//	if (event.keyCode == 13) {
//	event.preventDefault();
//	editMyPokemon();
//	return false;
//	}
//	});

});

var host = window.location.host;
var rootURL = "http://" + host + "/GOTracker";
var login = localStorage.getItem("login");

$.ajax({
	type : 'GET',
	url : rootURL + '/tracker/moves/quick',
	dataType : "xml",
	success : function(data) {
		quickmovesData = data.documentElement;
		console.log('quickmoves data loaded')
		loaded++
		setupPokemonList()
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
		console.log('chargemoves data loaded')
		loaded++
		setupPokemonList()
	},
	error : function(jqXHR, textStatus, errorThrown) {
		console.log('getChargeMoves error: ' + textStatus);
	}
});

$.ajax({
	type : 'GET',
	url : rootURL + '/tracker/pokemons',
	dataType : "json",
	success : function(data) {
		pokemonsData = data;
		console.log('pokemons data loaded')
		loaded++
		setupPokemonList()
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
			console.log('user data loaded')
			loaded++
			setupPokemonList()
		}

	},
	error : function(jqXHR, textStatus, errorThrown) {
		console.log('getUser error: ' + textStatus);
	}
});




function setupPokemonList(){
	if(loaded == 4){
		console.log('loading pokemon list')
		$.each(pokemonsData, function(key, poke){
			//console.log('loading ' + poke.pokemonID)
			addPokemonToList(poke);
		});
	}
}
//function addPokemontoDropDown(poke){
//var select = document.getElementById("mypokemons");
//var option = document.createElement("option");
//option.value = poke.pokemonID;
//option.text = '#' + poke.pokemonID + ' ' + capitalizeFirstLetter(poke.name);
//select.add(option);
//}

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
			document.getElementById('submitButton').style.color = 'green';
			$.each(userData.mypokemons.mypokemon, function(key, mypoke){
				unsavedchanges = false;
				if(mypoke.pokemonID == currentPokemonID){
					mypoke.nbCandies = nbCandies;
					mypoke.caught = caught;
					mypoke.myfavs = {"myfav": myfavs}
					if(caught){
						var src = 'img/pokeball1.gif'
							if(myfavs != null){
								$.each(myfavs, function(key, myfav){
									if(myfav.wonder){//if one fav is wonder
										src = 'img/star.gif';
									}
								});
							}
						document.getElementById('icon' + pokemonID).src = src;
					}

				}
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log('editMyPokemon error: ' + errorThrown);
		}
	});
}



var favCount = 0;
var unsavedchanges = false;
var addFavButtonLoaded = false;

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
	var starImg = document.createElement('img');
	starImg.id = 'icon'+poke.pokemonID;
	starImg.setAttribute('style','float:left;')
	if(mypokemon.caught){
		var src = 'img/pokeball1.gif';
		if(mypokemon.myfavs != null){
			$.each(mypokemon.myfavs.myfav, function(key, myfav){
				if(myfav.wonder){//if one fav is wonder
					src = 'img/star.gif';
				}
			});
		}
		starImg.src = src;
	}
	starDiv.appendChild(starImg);
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
	if(unsavedchanges){
		if (confirm("Discard Unsaved Changes ?") == true) {
			unsavedchanges = false;
			//document.getElementById('submitButton').style.color = 'black';
		}else{return}
	}
	currentPokemonID = pokemonID;
	if(currentPokemonID <= 1){
		console.log(currentPokemonID)
		document.getElementById("prevButton").setAttribute('hidden', true);
	}else if(currentPokemonID >= pokemonsData.length){
		document.getElementById("nextButton").setHidden();
	}
	else{
		document.getElementById("prevButton").hidden = false;
		document.getElementById("nextButton").hidden = false;
	}
	var pokemon = getPokemon(pokemonID)
	var image = document.getElementById("image");
	image.src = pokemon.gif_url;
	document.getElementById("pokemonNumber").innerHTML = '#' + pokemon.pokemonID
	document.getElementById("pokemonName").innerHTML = capitalizeFirstLetter(pokemon.name)
	favIDs = [];
	favCount = 0;
	document.getElementById("table-body").innerHTML = "";
	$.each(userData.mypokemons.mypokemon, function(key, mypoke){
		if(mypoke.pokemonID == pokemonID){
			document.getElementById("caught").checked = mypoke.caught;
			document.getElementById("nbCandies").value = mypoke.nbCandies;
			if(mypoke.myfavs != undefined){
				$.each(mypoke.myfavs.myfav, function(key, myfav){
					appendFavorite(myfav, pokemonID);
				});
			}
		}
	});

}

function addFavorite(){
	var tr = document.createElement('tr');
	tr.id = "fav"+favCount;
	var td = document.createElement('td');
	var input = document.createElement('input');
	input.setAttribute('type', 'number');
	input.setAttribute('id', 'PC'+favCount);
	input.style.width = '50px'
//	input.setAttribute('onchange', function(){
//		changeOccured();
//		console.log('change')
//	});
	input.addEventListener('change', function(){
		changeOccured();
		console.log('change')
	});
	td.appendChild(input)
	tr.appendChild(td)
	
	td = document.createElement('td');
	input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('id', 'wonder'+favCount);
	input.addEventListener('change', function(){
		changeOccured();
	});
	td.appendChild(input)
	tr.appendChild(td)

	td = document.createElement('td');
	input = document.createElement('select');
	input.setAttribute('id', 'quickmove'+favCount);
	var option = document.createElement('option');
	option.value = 'blank'
	input.appendChild(option)
	input.addEventListener('change', function(){
		changeOccured();
		hideBlank(input)
	});
	td.appendChild(input)
	tr.appendChild(td)

	td = document.createElement('td');
	input = document.createElement('select');
	input.setAttribute('id', 'chargemove'+favCount);
	option = document.createElement('option');
	option.value = 'blank'
	input.appendChild(option)
	input.addEventListener('change', function(){
		changeOccured();
		hideBlank(input)
	});
	td.appendChild(input)
	tr.appendChild(td)

	td = document.createElement('td');
	var suppr = document.createElement('button');
	suppr.id = 'remove' + favCount;
	suppr.innerHTML = 'X';
	suppr.setAttribute('onclick','changeOccured();removeFavorite('+favCount+');');
	td.appendChild(suppr)
	tr.appendChild(td)
	
	document.getElementById('table-body').appendChild(tr);
	
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
	/**
	 * <tr>
	<td><input type="number" id="PC"></td>
	<td><input type="checkbox" id="wonder"></td>
	ici il faut mettre une putain d'image d'étoile(2 en fait)
	<td><select id="quickmove"></select></td>
	<td><select id="chargemove"></select></td>
	</tr>
	 */
	var tr = document.createElement('tr');
	tr.id = "fav"+favCount;
	var td = document.createElement('td');
	var input = document.createElement('input');
	input.setAttribute('type', 'number');
	input.setAttribute('id', 'PC'+favCount);
	input.style.width = '50px'
	input.setAttribute('value', myfav.PC);
//	input.setAttribute('onchange', function(){
//		changeOccured();
//		console.log('change')
//	});
	input.addEventListener('change', function(){
		changeOccured();
		console.log('change')
	});
	td.appendChild(input)
	tr.appendChild(td)
	
	td = document.createElement('td');
	input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('id', 'wonder'+favCount);
	input.checked = myfav.wonder;
	input.addEventListener('change', function(){
		changeOccured();
	});
	td.appendChild(input)
	tr.appendChild(td)

	td = document.createElement('td');
	input = document.createElement('select');
	input.setAttribute('id', 'quickmove'+favCount);
	input.addEventListener('change', function(){
		changeOccured();
	});
	td.appendChild(input)
	tr.appendChild(td)

	td = document.createElement('td');
	input = document.createElement('select');
	input.setAttribute('id', 'chargemove'+favCount);
	input.addEventListener('change', function(){
		changeOccured();
	});
	td.appendChild(input)
	tr.appendChild(td)

	td = document.createElement('td');
	var suppr = document.createElement('button');
	suppr.id = 'remove' + favCount;
	suppr.innerHTML = 'X';
	suppr.setAttribute('onclick','changeOccured();removeFavorite('+favCount+');');
	td.appendChild(suppr)
	tr.appendChild(td)

	document.getElementById('table-body').appendChild(tr);
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
//	document.getElementById("pokemonList").hidden=false
	//document.getElementById("pokemonList").style.height = '100%'
//	document.getElementById("leftspacer").innerHTML = '&nbsp;';
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
//	document.getElementById("pokemonList").hidden=true
	//document.getElementById("pokemonList").style.height = '0px';
//	document.getElementById("leftspacer").innerHTML = '';
	document.getElementById("mypokemon").hidden=false
}