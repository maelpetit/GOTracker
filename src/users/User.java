package users;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlList;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.bson.Document;

import pokemons.MyPokemon;

@XmlRootElement(name = "user")
@XmlAccessorType(XmlAccessType.FIELD)
public class User {


	private String login;
	private String username;
	private Role role;
	@XmlTransient
	private byte[] passwordHash;

	@XmlElementWrapper(name="mypokemons")
	@XmlElement(name="mypokemon")
	private List<MyPokemon> myPokemons = null;

	public User(){
	}

	public User(String login, String username, Role role){
		this.login = login;
		this.username = username;
		this.role = role;
	}

	public void addMyPokemon(MyPokemon myPokemon){
		if(myPokemons == null){
			myPokemons = new ArrayList<MyPokemon>();
		}
		myPokemons.add(myPokemon);
	}
	
	public MyPokemon getMyPokemon(String pokemonID){
		for (MyPokemon myPokemon : myPokemons) {
			if(myPokemon.getPokemonID().equals(pokemonID)){
				return myPokemon;
			}
		}
		return null;
	}

	public void setMyPokemons(List<MyPokemon> myPokemons) {
		this.myPokemons = myPokemons;
	}

	public List<MyPokemon> getMyPokemons() {
		return myPokemons;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public void setPasswordHashWithPassword(String password) throws NoSuchAlgorithmException {
		this.passwordHash = java.security.MessageDigest.getInstance("SHA-256").digest(password.getBytes());
	}

	public byte[] getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(byte[] passwordHash) {
		this.passwordHash = passwordHash;
	}

	public Document getUserDocument(){
		Document doc = new Document();
		doc.append("login", login);
		doc.append("username", username);
		doc.append("role", role.toString());
		doc.append("passwordHash", passwordHash);
		return doc;
	}

	public Boolean samePassword(String password) {
		try {
			byte[] passwordToCheck = java.security.MessageDigest.getInstance("SHA-256").digest(password.getBytes());
			if(passwordToCheck.length != passwordHash.length){
				return false;
			}
			for (int i = 0; i < passwordToCheck.length; i++) {
				if(passwordToCheck[i] != passwordHash[i]){
					return false;
				}
			}
			return true;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return false;
	}

}
