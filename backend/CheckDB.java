import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckDB {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/auth_db";
        String user = "root";
        String pass = "Shweta@26";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT user_id, email, password, role FROM users")) {
            
            System.out.println("Users in DB:");
            while (rs.next()) {
                System.out.println("ID: " + rs.getLong("user_id") + 
                                   ", Email: " + rs.getString("email") + 
                                   ", Role: " + rs.getString("role") + 
                                   ", Pass: " + rs.getString("password"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
