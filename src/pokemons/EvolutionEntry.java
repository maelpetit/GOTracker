package pokemons;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement
@XmlType(propOrder={"pokemonID","nbCandies", "item"})
public class EvolutionEntry{
	
	private String pokemonID;
	private Integer nbCandies;
	private Item item;
	
	public EvolutionEntry(){
	}
	
	public EvolutionEntry(String pokemonID, Integer nbCandies, Item item) {
		this.setPokemonID(pokemonID);
		this.nbCandies = nbCandies;
		this.item = item;
	}
	
	public String getPokemonID() {
		return pokemonID;
	}

	public void setPokemonID(String pokemonID) {
		this.pokemonID = pokemonID;
	}

	public Integer getNbCandies() {
		return nbCandies;
	}
	
	public void setNbCandies(Integer nbCandies) {
		this.nbCandies = nbCandies;
	}
	
	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}
}