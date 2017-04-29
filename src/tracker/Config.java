package tracker;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import mongo.Database;
import mongo.PokemonsAndMoves;
import users.UserList;

@WebListener
public class Config implements ServletContextListener {
    public void contextInitialized(ServletContextEvent event) {
    	System.out.println("Initializing context...");
        PokemonsAndMoves.getInstance()._init();
        UserList.getInstance();
    }
    public void contextDestroyed(ServletContextEvent event) {
        Database.closeMongoClient();
    }
}