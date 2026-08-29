import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DescribeTables {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/auth_db";
        String user = "root";
        String pass = "Shweta@26";
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
             
             String[] tables = {"categories", "products", "productimages"};
             for (String t : tables) {
                 System.out.println("---- Table: " + t + " ----");
                 try (ResultSet rs = stmt.executeQuery("DESCRIBE " + t)) {
                     while(rs.next()) {
                         System.out.println(rs.getString("Field") + " - " + rs.getString("Type"));
                     }
                 } catch(Exception e) {
                     System.out.println("Error describing " + t + ": " + e.getMessage());
                 }
                 System.out.println();
             }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
