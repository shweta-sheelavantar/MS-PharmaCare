import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.nio.file.Files;
import java.nio.file.Paths;

public class RunSql {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/auth_db?useSSL=false&allowPublicKeyRetrieval=true", "root", "Shweta@26");
            Statement stmt = conn.createStatement();
            
            String content = new String(Files.readAllBytes(Paths.get("d:/registerPage/pdf1_import.sql")));
            String[] queries = content.split(";");
            for (String query : queries) {
                if (query.trim().length() > 0) {
                    stmt.execute(query);
                }
            }
            
            System.out.println("SQL Script executed successfully");
            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
