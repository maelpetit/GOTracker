package users;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Authentication {
	
	private String login;
	private String password;
	
	public Authentication(){
		
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String toString(){
		return login + " " + password;
	}

}
