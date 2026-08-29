import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DropTables {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/auth_db";
        String user = "root";
        String pass = "Shweta@26";
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            stmt.executeUpdate("SET FOREIGN_KEY_CHECKS = 0;");
            stmt.executeUpdate("DROP TABLE IF EXISTS order_items, reviews, wishlists, productimages, products, categories;");
            stmt.executeUpdate("SET FOREIGN_KEY_CHECKS = 1;");
            
            System.out.println("Tables dropped successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
