package tracker;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mongo.Database;
import mongo.PokemonsAndMoves;
import pokemons.Pokemon;

@Path("/pokemons")
public class PokemonResources {
	
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public List<Pokemon> getAllPokemons(){
		List<Pokemon> pokemonsList = PokemonsAndMoves.getInstance().getPokemons();
		//Database.closeMongoClient();
		return pokemonsList;
	}
	
	@Path("/{number}")
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public Pokemon getPokemon(@PathParam("number") int number){
		Pokemon pokemon = PokemonsAndMoves.getInstance().getPokemon(number);
		//Database.closeMongoClient();
		return pokemon;
	}

}
