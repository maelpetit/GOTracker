import java.io.FileNotFoundException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;

import org.bson.Document;

import com.mongodb.BasicDBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCursor;

import mongo.Database;
import mongo.DatabaseUpdater;
import mongo.Utils;
import pokemons.FavPokemon;
import pokemons.FavPokemonWrapper;
import pokemons.MyPokemon;
import users.Role;
import users.User;
import users.UserList;

public class Tests {

	public static void main(String[] args) throws NoSuchAlgorithmException, FileNotFoundException {
		
		Document doc, doc1, filter = new Document(); filter.put("number", "000");
		MongoCursor<Document> cursor = Database.getPokedexCollection("martin").find().iterator();
		while(cursor.hasNext()){
			doc = cursor.next();
			System.out.println(doc.toJson());
			doc1 = new Document();
			filter.replace("number", doc.get("number"));
			doc1.put("number", doc.getString("number"));
			doc1.put("caught", doc.getBoolean("caught"));
			doc1.put("nbcandies", doc.getInteger("nbcandies"));
			doc1.put("favs", doc.get("favs"));
			doc1.append("nbPokemons", 0);
			System.out.println(doc1.toJson());System.out.println(filter.toJson());
			Database.getPokedexCollection("martin").replaceOne(filter, doc1);
		}
		
		Database.closeMongoClient();
		
//	    String URL = "http://localhost:8080/GOTracker/tracker";
//		Client client = ClientBuilder.newClient();
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
//		favs.getFavsList().add(fav);
//		
//		myPokemon.setFavs(favs);
//		//client.target(URL).path("users/mael/pokedex").request(MediaType.APPLICATION_JSON_TYPE).post(Entity.entity(myPokemon , MediaType.APPLICATION_XML));
//		
//		System.out.println(Entity.entity(myPokemon , MediaType.APPLICATION_XML));
//		
		
	}

}
