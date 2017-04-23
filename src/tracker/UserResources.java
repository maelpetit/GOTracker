package tracker;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBElement;

import mongo.Database;
import mongo.DatabaseUpdater;
import pokemons.FavPokemon;
import pokemons.FavPokemonWrapper;
import pokemons.MyPokemon;
import users.Authentication;
import users.User;
import users.UserList;

@Path("/users")
public class UserResources {
	
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public List<User> getUsers(){
		List<User> userList = UserList.getInstance().getUsers();
		//Database.closeMongoClient();
		return userList;
	}
	
	@Path("/{login}")
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public Response getUser(@PathParam("login") String login){
		User user = UserList.getInstance().getUser(login);
		Response response = Response.status(Response.Status.OK).entity(user).build();
		//Database.closeMongoClient();
		return response;
	}
	
	@Path("/{login}/pokedex")
	@POST
	//@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public void editMyPokemon(@PathParam("login") String login, JAXBElement<MyPokemon> pokemonJAXB){
		User user = UserList.getInstance().getUser(login);
		MyPokemon myPokemonJAXB = pokemonJAXB.getValue();
		MyPokemon myPokemon = user.getMyPokemon(myPokemonJAXB.getPokemonID());
		myPokemon.importValues(myPokemonJAXB);
		FavPokemonWrapper myfavs = myPokemonJAXB.getFavs();
		if(myfavs != null){
			if(myfavs.getFavsList().size() == 0){
				myPokemon.setFavs(null);
			}else{
				myPokemon.setFavs(myPokemonJAXB.getFavs());
			}
		}
		DatabaseUpdater.editPokedex(login, myPokemon);
		//Database.closeMongoClient();
	}
	
	@Path("/{login}/pokedex/{number}")
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public MyPokemon getMyPokemon(@PathParam("login") String login, @PathParam("number") String pokemonID){
		User user = UserList.getInstance().getUser(login);
		MyPokemon myPokemon = user.getMyPokemon(pokemonID);
		//Database.closeMongoClient();
		return myPokemon;
	}
	
	@Path("/login")
	@POST
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public Response authentication(JAXBElement<Authentication> authJAXB){
		Authentication auth = authJAXB.getValue();
		User user = UserList.getInstance().getUser(auth.getLogin());
		Response response;
		if(user == null){
			System.out.println("NOT_FOUND");
			response = Response.status(Response.Status.NOT_FOUND).build();
			return response;
		}
		if(user.samePassword(auth.getPassword())){
			System.out.println("ACCEPTED");
			response = Response.status(Response.Status.ACCEPTED).build();
		}else{
			System.out.println("UNAUTHORIZED");
			response = Response.status(Response.Status.UNAUTHORIZED).build();
		}
		//Database.closeMongoClient();
		return response;
		
	}

}
