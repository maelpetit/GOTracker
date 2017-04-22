package pokemons;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
		"myfav"
})
@XmlRootElement(name = "myfavs")
public class FavPokemonWrapper {

	@XmlElement(required = true)
	protected List<FavPokemon> myfav;

	public List<FavPokemon> getFavsList() {
		if(myfav == null){
			myfav = new ArrayList<>();
		}
		return myfav;
	}
}
