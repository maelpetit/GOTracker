package pokemons.moves;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ChargeMove extends Move {
	
	private int damagePerFullEnergyBar;
	
	public ChargeMove(){
		
	}
	
	public ChargeMove(String name, Types type, int power, Double dps, int duration, int dpe){
		super(name,type,power,dps,duration);
		this.damagePerFullEnergyBar = dpe;
	}

	public int getDamagePerFullEnergyBar() {
		return damagePerFullEnergyBar;
	}
	
}
