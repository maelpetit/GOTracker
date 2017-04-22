package pokemons;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlType(propOrder={"PC","wonder", "quickmove", "chargemove"})
@XmlRootElement
public class FavPokemon {
	
	private int PC;
	private boolean wonder;
	private String quickmove;
	private String chargemove;
	
	public FavPokemon(){
		
	}
	
	public FavPokemon(int PC, boolean wonder, String quick, String charge){
		this.PC = PC;
		this.wonder = wonder;
		this.quickmove = quick;
		this.chargemove = charge;
	}
	
	public int getPC() {
		return PC;
	}
	public void setPC(int pC) {
		PC = pC;
	}
	public boolean isWonder() {
		return wonder;
	}
	public void setWonder(boolean wonder) {
		this.wonder = wonder;
	}
	public String getQuickmove() {
		return quickmove;
	}
	public void setQuickmove(String quickmove) {
		this.quickmove = quickmove;
	}
	public String getChargemove() {
		return chargemove;
	}
	public void setChargemove(String chargemove) {
		this.chargemove = chargemove;
	}

}
