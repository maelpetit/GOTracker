package pokemons.moves;

import com.mongodb.diagnostics.logging.Logger;

public enum Types {
	NORMAL,
	FIRE,
	WATER,
	ELECTRIC,
	GRASS,
	ICE,
	FIGHTING,
	POISON,
	GROUND,
	FLYING,
	PSYCHIC,
	BUG,
	ROCK,
	GHOST,
	DRAGON,
	DARK,
	STEEL,
	FAIRY;
	
	public static Types getType(String type){
		switch(type.toLowerCase()){
		case "normal":
			return NORMAL;
		case "fire":
			return FIRE;
		case "water":
			return WATER;
		case "electric":
			return ELECTRIC;
		case "grass":
			return GRASS;
		case "ice":
			return ICE;
		case "fighting":
			return FIGHTING;
		case "poison":
			return POISON;
		case "ground":
			return GROUND;
		case "flying":
			return FLYING;
		case "psychic":
			return PSYCHIC;
		case "bug":
			return BUG;
		case "rock":
			return ROCK;
		case "ghost":
			return GHOST;
		case "dragon":
			return DRAGON;
		case "dark":
			return DARK;
		case "steel":
			return STEEL;
		case "fairy":
			return FAIRY;
		default:
			System.err.println("Type is wrong or misspelled : '" + type + "'");
			return null;
		}
	}

}
