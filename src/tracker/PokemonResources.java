package tracker;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mongo.PokemonsAndMoves;
import pokemons.Pokemon;

@Path("/pokemons")
public class PokemonResources {
	
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public List<Pokemon> getAllPokemons(){
		return PokemonsAndMoves.getInstance().getPokemons();
	}
	
	@Path("/{number}")
	@GET
	@Produces({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public Pokemon getPokemon(@PathParam("number") int number){
		return PokemonsAndMoves.getInstance().getPokemon(number);
	}

}
