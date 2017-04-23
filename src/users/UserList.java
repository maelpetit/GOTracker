package users;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.types.Binary;

import com.mongodb.client.MongoCursor;

import mongo.Database;
import pokemons.FavPokemon;
import pokemons.MyPokemon;

public class UserList {

	private static UserList INSTANCE = new UserList();
	private static boolean init_done = false;

	public static final UserList getInstance() {
		if(!init_done){
			init_done = true;
			INSTANCE._initUserList();
		}
		return INSTANCE;
	}
	
	//	static{
//		User user = getInstance().getUser("mael");
//		try {
//			user.setPasswordHashWithPassword("tetedebite");
//		} catch (NoSuchAlgorithmException e) {
//			e.printStackTrace();
//		}
//		
//		Database.editUser(user.getUserDocument());
//	}
	
	@SuppressWarnings("unchecked")
	private void _initUserList() {
		Document document, pokedexEntry;
		List<Document> favs;
		MongoCursor<Document> cursor = Database.getUsersCollection().find().iterator();
		MongoCursor<Document> userPokedexCursor;
		String login, username, pokemonID, quickMove, chargeMove;
		Binary password;
		Role role;
		User user;
		MyPokemon myPokemon;
		FavPokemon favPokemon;
		int nbCandies, PC;
		boolean caught, wonder;
		while(cursor.hasNext()){
			document = cursor.next();
			login = document.getString("login");
			username = document.getString("username");
			password = (Binary) document.get("passwordHash");
			role = Role.getRole(document.getString("role"));
			user = new User(login, username, role);
			user.setPasswordHash(password.getData());
			INSTANCE.addUser(user);
			
			userPokedexCursor = Database.getPokedexCollection(login).find().iterator();
			while(userPokedexCursor.hasNext()){
				pokedexEntry = userPokedexCursor.next();
				pokemonID = pokedexEntry.getString("number");
				caught = pokedexEntry.getBoolean("caught");
				nbCandies = pokedexEntry.getInteger("nbcandies");
				myPokemon = new MyPokemon(pokemonID, caught, nbCandies);
				favs = (List<Document>) pokedexEntry.get("favs");
				for (Document fav : favs) {
					PC = fav.getInteger("pc");
					wonder = fav.getBoolean("wonder");
					quickMove = fav.getString("quickmove");
					chargeMove = fav.getString("chargemove");
					favPokemon = new FavPokemon(PC, wonder, quickMove, chargeMove);
					myPokemon.addFav(favPokemon);
				}
				
				user.addMyPokemon(myPokemon);
			}
		}
		//Database.closeMongoClient();
	}

	
	private Map<String, User> usersMap = new HashMap<>();
	
	public synchronized void addUser(User user){
		usersMap.put(user.getLogin(), user);
	}
	
	public synchronized List<User> getUsers(){
		return new ArrayList<User>(usersMap.values());
	}
	
	public synchronized User getUser(String login){
		return usersMap.get(login);
	}
}
