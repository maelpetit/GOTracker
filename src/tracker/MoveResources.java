package tracker;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mongo.PokemonsAndMoves;
import pokemons.moves.ChargeMove;
import pokemons.moves.Move;
import pokemons.moves.QuickMove;

@Path("/moves")
public class MoveResources {
	
	@GET
	@Produces({MediaType.APPLICATION_XML})
	public List<Move> getMoves(){
		List<Move> moves = new ArrayList<>();
		moves.addAll(PokemonsAndMoves.getInstance().getQuickmoves());
		moves.addAll(PokemonsAndMoves.getInstance().getChargemoves());
		return moves;
	}
	
	@Path("/quick")
	@GET
	@Produces({MediaType.APPLICATION_XML})
	public List<QuickMove> getQuickMoves(){
		return PokemonsAndMoves.getInstance().getQuickmoves();
	}
	
	@Path("/charge")
	@GET
	@Produces({MediaType.APPLICATION_XML})
	public List<ChargeMove> getChargeMoves(){
		return PokemonsAndMoves.getInstance().getChargemoves();
	}

}
