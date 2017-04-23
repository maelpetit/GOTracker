package mongo;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import org.bson.Document;

import com.mongodb.BasicDBObject;

import pokemons.FavPokemon;
import pokemons.MyPokemon;

public class DatabaseUpdater {
	
	public static void updateMovesAndPokemons() throws FileNotFoundException{
		updateQuickMoves();
		updateChargeMoves();
		updatePokemons();
		Database.closeMongoClient();
	}

	@SuppressWarnings("unchecked")
	public static void updateQuickMoves() throws FileNotFoundException{
		String filename = "data/quickmoves.json";
		String json = Utils.readFile(filename);
		Document document = Document.parse(json);
		BasicDBObject filter = new BasicDBObject();
		List<Document> quickmoveslist = (List<Document>) document.get("quickmoves");
		for(Document quickmove : quickmoveslist){
			filter.put("move name", quickmove.getString("move name"));
			if(Database.getQuickMovesCollection().find(filter).first() == null){
				Database.getQuickMovesCollection().insertOne(quickmove);
				Logger.getGlobal().info("The quick move "+ quickmove.getString("move name") + " has been added to the database");
			}else{
				Database.getQuickMovesCollection().replaceOne(filter, quickmove);
				Logger.getGlobal().info("The quick move "+ quickmove.getString("move name") + " has been updated");
			}

		}

	}

	@SuppressWarnings("unchecked")
	public static void updateChargeMoves() throws FileNotFoundException{
		String filename = "data/chargemoves.json";
		String json = Utils.readFile(filename);
		Document document = Document.parse(json);
		BasicDBObject filter = new BasicDBObject();
		List<Document> chargemoveslist = (List<Document>) document.get("chargemoves");
		for(Document chargemove : chargemoveslist){
			filter.put("move name", chargemove.getString("move name"));
			if(Database.getChargeMovesCollection().find(filter).first() == null){
				Database.getChargeMovesCollection().insertOne(chargemove);
				Logger.getGlobal().info("The charge move "+ chargemove.getString("move name") + " has been added to the database");
			}else{
				Database.getChargeMovesCollection().replaceOne(filter, chargemove);
				Logger.getGlobal().info("The charge move "+ chargemove.getString("move name") + " has been updated");
			}

		}

	}

	@SuppressWarnings("unchecked")
	public static void updatePokemons() throws FileNotFoundException{
		String filename = "data/pokemons251.json";
		String json = Utils.readFile(filename);
		Document document = Document.parse(json);
		BasicDBObject filter = new BasicDBObject();
		String number;
		List<Document> pokemonlist = (List<Document>) document.get("pokemons");
		for(Document pokemon : pokemonlist){
			number = pokemon.getString("number");
			filter.put("number", number);
			if(Database.getPokemonsCollection().find(filter).first() == null){
				Database.getPokemonsCollection().insertOne(pokemon);
				Logger.getGlobal().info("The pokemon "+ number + " has been added to the database");
			}else{
				Database.getPokemonsCollection().replaceOne(filter, pokemon);
				Logger.getGlobal().info("The pokemon "+ number + " has been updated");
			}

		}
	}

	public static void editPokedex(String login, MyPokemon mypokemon) {
		Document mypokemonDoc = new Document(), favDoc;
		List<Document> favsDoc = new ArrayList<>();

		mypokemonDoc.put("number", mypokemon.getPokemonID());
		mypokemonDoc.put("caught", mypokemon.isCaught());
		mypokemonDoc.put("nbcandies", mypokemon.getNbCandies());

		if(mypokemon.getFavs() != null){

			for(FavPokemon fav : mypokemon.getFavs().getFavsList()){
				favDoc = new Document();
				favDoc.put("pc", fav.getPC());
				favDoc.put("wonder", fav.isWonder());
				favDoc.put("quickmove", fav.getQuickmove());
				favDoc.put("chargemove", fav.getChargemove());

				favsDoc.add(favDoc);
			}
		}

		mypokemonDoc.put("favs", favsDoc);
		Document filter = new Document();
		filter.put("number", mypokemon.getPokemonID());
		Database.getPokedexCollection(login).replaceOne(filter, mypokemonDoc);
		Logger.getGlobal().info("Pokedex entry number " +  mypokemon.getPokemonID() + " edited (" + login +")");
	}


	public static void main(String[] args) throws FileNotFoundException {
		//updateQuickMoves();
		//updateChargeMoves();
		//updatePokemons();
		//Database.closeMongoClient();
		updateMovesAndPokemons();
	}


}
