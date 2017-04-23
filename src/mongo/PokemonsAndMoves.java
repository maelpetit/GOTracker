package mongo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.bson.Document;

import com.mongodb.client.MongoCursor;

import pokemons.Item;
import pokemons.Pokemon;
import pokemons.moves.ChargeMove;
import pokemons.moves.Move;
import pokemons.moves.QuickMove;
import pokemons.moves.Types;
import users.UserList;

public class PokemonsAndMoves {
	
	private static PokemonsAndMoves INSTANCE = new PokemonsAndMoves();

	private static boolean init_done = false;
	
	public static final PokemonsAndMoves getInstance() {
		if(!init_done){
			init_done = true;
			INSTANCE._init();
		}
		return INSTANCE;
	}
	
	private List<QuickMove> quickmoves = new ArrayList<>();
	private List<ChargeMove> chargemoves = new ArrayList<>();
	private List<Pokemon> pokemons = new ArrayList<>();
	
	public List<QuickMove> getQuickmoves() {
		return quickmoves;
	}

	public void setQuickmoves(List<QuickMove> quickmoves) {
		this.quickmoves = quickmoves;
	}

	public List<ChargeMove> getChargemoves() {
		return chargemoves;
	}

	public void setChargemoves(List<ChargeMove> chargemoves) {
		this.chargemoves = chargemoves;
	}

	public List<Pokemon> getPokemons() {
		return pokemons;
	}

	public void setPokemons(List<Pokemon> pokemons) {
		this.pokemons = pokemons;
	}
	
	public void _init(){
		instanciateAllMovesFromDB();
		instanciateAllPokemonsFromDB();
		//Database.closeMongoClient();
	}
	
	@SuppressWarnings("unchecked")
	public void instanciateAllPokemonsFromDB(){
		Document pokemonDoc;
		List<Document> quickmoves, chargemoves, nextEvols;
		Map<Pokemon, List<Document>> mapEvols = new HashMap<>(); 
		Pokemon pokemon;
		String pokeID, name;
		Types[] types;
		MongoCursor<Document> cursor = Database.getPokemonsCollection().find().iterator();
		while(cursor.hasNext()){
			pokemonDoc = cursor.next();
			pokeID = pokemonDoc.getString("number");
			name = pokemonDoc.getString("name");
			types = getTypesFromList((List<String>) pokemonDoc.get("types"));
			
			quickmoves = ((List<Document>) pokemonDoc.get("quick moves"));
			chargemoves = ((List<Document>) pokemonDoc.get("charge moves"));
			
			pokemon = new Pokemon(pokeID, name, types, quickmoves, chargemoves);
			
			nextEvols = (List<Document>) pokemonDoc.get("next evolutions");
			if(nextEvols != null){
				mapEvols.put(pokemon, nextEvols);
			}
			
			pokemons.add(pokemon);
		}
		
		addEvolsToPokemons(mapEvols);
	}
	
	private void addEvolsToPokemons(Map<Pokemon, List<Document>> mapEvols) {
		Pokemon pokemon;
		String item;
		int number, nbCandies;
		for(Entry<Pokemon, List<Document>> entry : mapEvols.entrySet()){
			pokemon = entry.getKey();
			for(Document document : entry.getValue()){
				number = document.getInteger("number");
				nbCandies = document.getInteger("candies");
				item = document.getString("item");
				pokemon.addEvolution(getPokemon(number), nbCandies, Item.getItem(item));
			}
		}
		
	}

	private Types[] getTypesFromList(List<String> typesIN){
		Types[] typesOUT = new Types[typesIN.size()];
		for (int i = 0; i < typesIN.size(); i++) {
			typesOUT[i] = Types.getType(typesIN.get(i));
		}
		
		return typesOUT;
	}
	
	private void instanciateAllMovesFromDB(){
		instanciateAllQuickMovesFromDB();
		instanciateAllChargeMovesFromDB();
	}
	
	private void instanciateAllQuickMovesFromDB() {
		Document quickmove;
		QuickMove move;
		String name;
		Types type;
		int power, duration;
		Double dps, energyGain;
		MongoCursor<Document> cursor = Database.getQuickMovesCollection().find().iterator();
		while(cursor.hasNext()){
			quickmove = cursor.next();
			name = quickmove.getString("move name");
			type = Types.getType(quickmove.getString("type"));
			power = quickmove.getInteger("power");
			dps = Double.parseDouble(""+quickmove.get("dps"));
			duration = quickmove.getInteger("duration (ms)");
			energyGain = Double.parseDouble(""+quickmove.get("energy gain"));
			move = new QuickMove(name, type, power, dps, duration, energyGain);
			
			quickmoves.add(move);
		}
	}
	
	private void instanciateAllChargeMovesFromDB() {
		Document chargemove;
		ChargeMove move;
		String name;
		Types type;
		int power, duration, dpe;
		Double dps;
		MongoCursor<Document> cursor = Database.getChargeMovesCollection().find().iterator();
		while(cursor.hasNext()){
			chargemove = cursor.next();
			name = chargemove.getString("move name");
			type = Types.getType(chargemove.getString("type"));
			power = chargemove.getInteger("power");
			dps = Double.parseDouble("" + chargemove.get("dps"));
			duration = chargemove.getInteger("duration (ms)");
			dpe = chargemove.getInteger("dpe");
			move = new ChargeMove(name, type, power, dps, duration, dpe);
			
			chargemoves.add(move);
		}
	}

	public QuickMove getQuickMove(String moveName){
		for (QuickMove move : quickmoves) {
			if(move.getName().equals(moveName)){
				return move;
			}
		}
		return null;
	}
	
	public ChargeMove getChargeMove(String moveName){
		for (ChargeMove move : chargemoves) {
			if(move.getName().equals(moveName)){
				return move;
			}
		}
		return null;
	}
	
	public Pokemon getPokemon(int number){
		for(Pokemon pokemon : pokemons){
			if(Integer.parseInt(pokemon.getPokemonID()) == number){
				return pokemon;
			}
		}
		return null;
	}
	
	public static void main(String[] args) {
		PokemonsAndMoves pm = getInstance();
		System.out.println(pm.pokemons.size() + " pokemons were successfully loaded");

		System.out.println(pm.quickmoves.size() + " quick moves were successfully loaded");
		
		System.out.println(pm.chargemoves.size() + " charge moves were successfully loaded");

		Database.closeMongoClient();
	}

}
