package pokemons;

public enum Item {
	
	KINGS_ROCK,
	DRAGON_SCALE,
	METAL_COAT,
	SUN_STONE,
	UPGRADE,
	NONE;
	
	public static Item getItem(String item){
		if(item == null){
			return NONE;
		}
		switch(item.toLowerCase()){
		case "kings rock":
			return KINGS_ROCK;
		case "dragon scale":
			return DRAGON_SCALE;
		case "metal coat":
			return METAL_COAT;
		case "sun stone":
			return SUN_STONE;
		case "upgrade":
			return UPGRADE;
		default:
			return NONE;
		}
	}

}
