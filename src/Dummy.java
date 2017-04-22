import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import org.bson.BsonArray;
import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCursor;

import mongo.Database;

public class Dummy {

	public static void main(String[] args) throws FileNotFoundException {

		//		String res = "";
		//		String number;
		//		for(int i = 1 ; i < 252; i++){
		//			number = (i<10?"00"+i:i<100?"0"+i:i+"");
		//			res += "{\"Number\": \"" + number +"\", \"Caught\":\"false\", \"NbCandies\" : 0,"
		//					+ " \"Favs\": [ { \"PC\": 0, \"Wonder\":\"false\", \"QuickMove\":\"None\", \"ChargeMove\":\"None\" } ]},";
		//		}
		//		System.out.println(res);

		BasicDBObject filter = new BasicDBObject();
		filter.append("number", "130");
		MongoCursor<Document> cursor = Database.getPokedexCollection("martin").find(filter).iterator();
		while(cursor.hasNext()){
			Document pokemon = cursor.next();
			pokemon.replace("Caught", true);
			pokemon.replace("NbCandies", 15);
			@SuppressWarnings("unchecked")
			List<Document> favs = (List<Document>) pokemon.get("Favs");
			Document doc = favs.get(0);
			doc.replace("PC", 2646);
			doc.replace("Wonder", true);
			doc.replace("QuickMove", "bite");
			doc.replace("ChargeMove", "hydro pump");
			Database.getPokedexCollection("martin").replaceOne(filter, pokemon);
			System.out.println(pokemon.toJson());
		}
		Database.getMongoClient().close();

	}


}
