package pokemons;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

import org.bson.Document;

import mongo.PokemonsAndMoves;
import pokemons.moves.ChargeMove;
import pokemons.moves.QuickMove;
import pokemons.moves.Types;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "pokemon")
public class Pokemon {
	
	private String pokemonID;
	private String name;
	
	@XmlElementWrapper(name="types")
	@XmlElement(name="type")
	private Types[] types;
	private String image_url;
	
	@XmlElementWrapper(name="evolutions")
	@XmlElement(name="evolution")
	private List<EvolutionEntry> evolutions = new ArrayList<>();
	
	@XmlElementWrapper(name="quickmoves")
	@XmlElement(name="quickmove")
	private List<QuickMove> quickmoveSet = new ArrayList<>();
	
	@XmlElementWrapper(name="chargemoves")
	@XmlElement(name="chargemove")
	private List<ChargeMove> chargemoveSet = new ArrayList<>();
	
	public Pokemon(){
		
	}
	
	public Pokemon(String pokeID, String name, Types[] types, List<Document> quickmoves, List<Document> chargemoves){
		this.pokemonID = pokeID;
		this.name = name;
		this.types = types;
		this.image_url = "https://assets-lmcrhbacy2s.stackpathdns.com/img/pokemon/animated/" + this.name.toLowerCase() + ".gif";
		QuickMove qm;
		for (Document move : quickmoves) {
			qm = PokemonsAndMoves.getInstance().getQuickMove(move.getString("name"));
			addQuickMove(qm);
		}
		ChargeMove cm;
		for (Document move : chargemoves) {
			cm = PokemonsAndMoves.getInstance().getChargeMove(move.getString("name"));
			addChargeMove(cm);
		}
		
	}

	public void setName(String name) {
		this.name = name;
	}

	public void addEvolution(Pokemon evol, Integer nbCandies, Item item){
		evolutions.add(new EvolutionEntry(evol.getPokemonID(), nbCandies, item));
	}
	
	public void addQuickMove(QuickMove move){
		quickmoveSet.add(move);
	}
	
	public void addChargeMove(ChargeMove move){
		chargemoveSet.add(move);
	}

	public String getName() {
		return name;
	}
	
	public void setTypes(Types[] types) {
		this.types = types;
	}

	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}

	public void setEvolutions(List<EvolutionEntry> evolutions) {
		this.evolutions = evolutions;
	}

	public List<EvolutionEntry> getEvolutions() {
		return evolutions;
	}
	
	public Types[] getTypes() {
		return types;
	}

	public String getImage_url() {
		return image_url;
	}

	public List<QuickMove> getQuickmoveSet() {
		return quickmoveSet;
	}

	public void setQuickmoveSet(List<QuickMove> quickmoveSet) {
		this.quickmoveSet = quickmoveSet;
	}

	public List<ChargeMove> getChargemoveSet() {
		return chargemoveSet;
	}

	public void setChargemoveSet(List<ChargeMove> chargemoveSet) {
		this.chargemoveSet = chargemoveSet;
	}

	public String getPokemonID() {
		return pokemonID;
	}

	public void setPokemonID(String pokemonID) {
		this.pokemonID = pokemonID;
	}
	
}