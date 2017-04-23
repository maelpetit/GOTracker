package mongo;


import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.bson.Document;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.UpdateResult;

public class Database {
	
	/*
	 *  ps -ef | grep mongo
	 */
	
	private static MongoClient mongo_client = null;
	private static MongoDatabase pokemon_go_database = null;
	private static MongoCollection<Document> pokemons_collection = null;
	private static MongoCollection<Document> quickmoves_collection = null;
	private static MongoCollection<Document> chargemoves_collection = null;
	private static MongoCollection<Document> users_collection = null;
	private static Map<String, MongoCollection<Document>> pokedexes_collections = new HashMap<>();

	public static MongoClient getMongoClient(){
		if(mongo_client == null){
			mongo_client = new MongoClient();
		}
		return mongo_client;
	}
	
	public static MongoDatabase getDatabase(){
		if(pokemon_go_database == null){
			pokemon_go_database = getMongoClient().getDatabase("pokemon_go_data");
		}
		return pokemon_go_database;
	}
	
	public static MongoCollection<Document> getPokemonsCollection(){
		if(pokemons_collection == null){
			pokemons_collection = getDatabase().getCollection("pokemons");
		}
		return pokemons_collection;
	}
	
	public static MongoCollection<Document> getQuickMovesCollection(){
		if(quickmoves_collection == null){
			quickmoves_collection = getDatabase().getCollection("quickmoves");
		}
		return quickmoves_collection;
	}
	
	public static MongoCollection<Document> getChargeMovesCollection(){
		if(chargemoves_collection == null){
			chargemoves_collection = getDatabase().getCollection("chargemoves");
		}
		return chargemoves_collection;
	}
	
	public static MongoCollection<Document> getUsersCollection(){
		if(users_collection == null){
			users_collection = getDatabase().getCollection("users");
		}
		return users_collection;
	}
	
	public static MongoCollection<Document> getPokedexCollection(String login){
		if(pokedexes_collections.get(login) == null){
			pokedexes_collections.put(login, getDatabase().getCollection("pokedex_" + login));
		}
		return pokedexes_collections.get(login);
	}
	
	public static void closeMongoClient(){
		if(mongo_client != null){
			mongo_client.close();
//			mongo_client = null;
//			users_collection = null;
//			quickmoves_collection = null;
//			chargemoves_collection = null;
//			pokedexes_collections.clear();
//			pokemons_collection = null;
//			pokemon_go_database = null;
		}
	}
	
	@SuppressWarnings("unchecked")
	public static void init_pokedex(String login){
		Logger.getGlobal().info("Initializing pokedex for user " + login + " ...");
		getDatabase().createCollection("pokedex_" + login);
		String filename = "data/pokedex/init_pokedex.json";
		String json;
		try {
			json = Utils.readFile(filename);
			Document document = Document.parse(json);
			List<Document> list = (List<Document>) document.get("pokedex");
			if(Database.getPokedexCollection(login).count() == 0){
				Database.getPokedexCollection(login).insertMany(list);
				Logger.getGlobal().info("Pokedex initialized");
			}else{
				Logger.getGlobal().info("Pokedex already initialized, nothing was done");
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			Logger.getGlobal().severe("Pokedex init file not found at " + filename);
		}
		
		
	}
	
	public static void addUser(Document user){
		
		getUsersCollection().insertOne(user);
		String login = user.getString("login");
		init_pokedex(login);
		Logger.getGlobal().info("Added user " + login + " to the database");
		
	}
	
	public static void editUser(Document user){
		BasicDBObject filter = new BasicDBObject();
		String login = user.getString("login");
		filter.put("login", login);
		UpdateResult result = getUsersCollection().replaceOne(filter, user);
		if(result.getModifiedCount() == 1){
			Logger.getGlobal().info("User " + login + " edited");
		}else if(result.getModifiedCount() == 0){
			Logger.getGlobal().warning("User " + login + " not found");
		}else{
			Logger.getGlobal().severe("Multiple users with login " + login);
		}
	}

	public static void main(String[] args) throws FileNotFoundException {
		
		
		Document document;
//		BasicDBObject whereQuery = new BasicDBObject();
//		whereQuery.put("login", "martin");
		MongoCursor<Document> cursor = getUsersCollection().find().iterator();
		String login;
		while(cursor.hasNext()){
			document = cursor.next();
			login = document.getString("login");
			init_pokedex(login);
		}
		
		getMongoClient().close();

	}

}
