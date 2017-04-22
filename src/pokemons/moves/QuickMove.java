package pokemons.moves;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class QuickMove extends Move {
	
	private double energyGainPerSec;
	
	public QuickMove(){
		
	}
	
	public QuickMove(String name, Types type, int power, Double dps, int duration, Double energyGain){
		super(name,type,power,dps,duration);
		this.energyGainPerSec = energyGain;
	}

	public double getEnergyGainPerSec() {
		return energyGainPerSec;
	}
	
}
