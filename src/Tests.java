import java.io.FileNotFoundException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.bson.Document;

import com.mongodb.BasicDBObject;

import mongo.Database;
import mongo.DatabaseUpdater;
import mongo.Utils;
import pokemons.FavPokemon;
import pokemons.FavPokemonWrapper;
import pokemons.MyPokemon;
import users.Authentication;
import users.Role;
import users.User;
import users.UserList;

public class Tests {

	public static void main(String[] args) throws NoSuchAlgorithmException, FileNotFoundException {
		
//		User user = UserList.getInstance().getUser("mael");
//		MyPokemon mypokemon = user.getMyPokemon("149");
//		FavPokemon fav = new FavPokemon(2691, true, "steel wing", "hyper beam");
//		mypokemon.addFav(fav);
//		DatabaseUpdater.editPokedex("mael", mypokemon);
//		
//		Database.closeMongoClient();
		
	    String URL = "http://localhost:8080/GOTracker/tracker";
		Client client = ClientBuilder.newClient();
//		MyPokemon myPokemon = new MyPokemon();
//		myPokemon.setPokemonID("004");
//		myPokemon.setCaught(true);
//		myPokemon.setNbCandies(11);
//		FavPokemonWrapper favs = new FavPokemonWrapper();
//		FavPokemon fav = new FavPokemon();
//		fav.setPC(461);
//		fav.setWonder(true);
//		fav.setQuickmove("scratch");
//		fav.setChargemove("flame charge");
//		favs.getFavsList().add(fav);
		

		Authentication auth = new Authentication();
		auth.setLogin("zfzfz");
		auth.setPassword("ozfozf");
		
		Response response = client.target(URL).path("users/login").request(MediaType.APPLICATION_JSON_TYPE).post(Entity.entity(auth , MediaType.APPLICATION_XML));
		System.out.println(response.getStatus());
		Database.closeMongoClient();
		
	}

}
