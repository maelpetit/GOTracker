package pokemons;

import java.util.logging.Logger;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement
public class MyPokemon {

	@XmlElement(name = "pokemonID")
	private String pokemonID = null;
	private Boolean caught = null;
	private Integer nbCandies = null;
	private Integer nbPokemons = null;

	@XmlElement(name = "myfavs")
	private FavPokemonWrapper favs = null;

	public MyPokemon(){
	}

	public MyPokemon(String pokemonID, boolean caught, int nbCandies){
		this.pokemonID = pokemonID;
		this.caught = caught;
		this.nbCandies = nbCandies;
	}

	public void addFav(FavPokemon fav){
		if(this.favs == null){
			this.favs = new FavPokemonWrapper();
		}
		favs.getFavsList().add(fav);
	}

	public Boolean isCaught() {
		return caught;
	}
	public void setCaught(boolean caught) {
		this.caught = caught;
	}
	public Integer getNbCandies() {
		return nbCandies;
	}
	public void setNbCandies(int nbCandies) {
		this.nbCandies = nbCandies;
	}

	public Integer getNbPokemons() {
		return nbPokemons;
	}

	public void setNbPokemons(Integer nbPokemons) {
		this.nbPokemons = nbPokemons;
	}

	public String getPokemonID() {
		return pokemonID;
	}

	public FavPokemonWrapper getFavs(){
		return favs;
	}

	public void setPokemonID(String pokemonID) {
		this.pokemonID = pokemonID;
	}

	public void setFavs(FavPokemonWrapper favs) {
		this.favs = favs;
	}

	public void importValues(MyPokemon myPokemonJAXB) {
		if(Integer.parseInt(this.pokemonID) == Integer.parseInt(myPokemonJAXB.getPokemonID())){
			Boolean caughtJAXB = myPokemonJAXB.isCaught();
			Integer nbcandiesJAXB = myPokemonJAXB.getNbCandies();
			if(caughtJAXB == null){}
			else{
				this.caught = caughtJAXB;
				}
			if(nbcandiesJAXB == null){}
			else{
				this.nbCandies = nbcandiesJAXB;
			}
		}else{
			Logger.getGlobal().warning("Something went wrong while importing values : pokemonIDs dont match -> nothing was done...");
		}
		
	}


}
