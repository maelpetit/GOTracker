package mongo;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Utils {
	
	public static String readFile(String filename) throws FileNotFoundException{
		Scanner scanner = new Scanner(new File(filename));
		String json = scanner.useDelimiter("\\Z").next();
		scanner.close();
		return json;
	}

}
