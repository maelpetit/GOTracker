package users;

import java.util.logging.Logger;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "role")
public enum Role {

	ADMIN ("admin"),
	USER ("user");

	private String name = "";


	Role(String name){
		this.name = name;
	}

	public String toString(){
		return name;
	}

	public static Role getRole(String role){
		if(role == null){
			Logger.getGlobal().warning("Role is null");
			return USER;
		}
		switch(role.toLowerCase()){
		case "admin": 
			return ADMIN;
		case "user":
		default:
			return USER;
		}
	}

}
