package tracker;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mongo.Database;
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
		//Database.closeMongoClient();
		return moves;
	}
	
	@Path("/quick")
	@GET
	@Produces({MediaType.APPLICATION_XML})
	public List<QuickMove> getQuickMoves(){
		List<QuickMove> moveList = PokemonsAndMoves.getInstance().getQuickmoves();
		//Database.closeMongoClient();
		return moveList;
	}
	
	@Path("/charge")
	@GET
	@Produces({MediaType.APPLICATION_XML})
	public List<ChargeMove> getChargeMoves(){
		List<ChargeMove> moveList = PokemonsAndMoves.getInstance().getChargemoves();
		//Database.closeMongoClient();
		return moveList;
	}

}
