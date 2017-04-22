$(function() {

	var host = window.location.host;

	var rootURL = "http://" + host + "/GOTracker";
	

	function login(){

		var login = document.getElementById("login").value;
		var password = document.getElementById("password").value;

		$.ajax({
			type : 'POST',
			url : rootURL + "/tracker/users/login",
			contentType : 'application/json',
			data : JSON.stringify({
				"login" : login,
				"password" : password
			}),
			dataType : "json",
			statusCode: {
				202: function() {
					localStorage.setItem("login", login);
					document.location.href = rootURL + "/myPokemonEdit.html";
				},
				401: function(){
					$('#message').append("<p>").append("Wrong password")
					.append("</p>");
				},
				404: function(){
					$('#message').append("<p>").append("Login not found")
					.append("</p>");
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log('login error: ' + textStatus);
			}
		});



	}

	$("#loginButton").click(function() {
		login();
	});

	$(window).keydown(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			login();
			return false;
		}
	});

});