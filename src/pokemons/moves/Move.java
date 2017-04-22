package pokemons.moves;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@XmlSeeAlso({QuickMove.class, ChargeMove.class})
public abstract class Move {
	
	protected String name;
	protected Types type;
	protected int power;
	protected double damagePerSec;
	protected int duration; //in ms
	
	public Move(){
		
	}
	
	protected Move(String name, Types type, int power, Double dps, int duration){
		this.name = name;
		this.type = type;
		this.power = power;
		this.damagePerSec = dps;
		this.duration = duration;
	}

	public String getName() {
		return name;
	}

	public Types getType() {
		return type;
	}

	public int getPower() {
		return power;
	}

	public double getDamagePerSec() {
		return damagePerSec;
	}

	public int getDuration() {
		return duration;
	}

}
