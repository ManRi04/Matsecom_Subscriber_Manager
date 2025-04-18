package org.example;

import java.sql.DriverManager;
import java.sql.SQLException;

public class User {
    int id;
    String prename;
    String surname;
    String IMSI;
    String terminal_type;
    String subscription_type;

    public User(int id,String prename, String surname, String IMSI, String terminal_type, String subscription_type) {
        this.id = id;
        this.prename = prename;
        this.surname = surname;
        this.IMSI = IMSI;
        this.terminal_type = terminal_type;
        this.subscription_type = subscription_type;

    }





    public void insertIntoDB() {
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";
        //this.createTable();

        // SQL-INSERT Statement, um den Benutzer in die Datenbank einzufügen
        var sql = "INSERT INTO users (id, prename, surname, IMSI, terminal_type, subscription_type) VALUES (?, ?, ?, ?, ?, ?)";

        try (var conn = DriverManager.getConnection(url);
             var pstmt = conn.prepareStatement(sql)) {

            // Setze die Werte des Prepared Statements
            pstmt.setInt(1, this.id);  // id
            pstmt.setString(2, this.prename);  // prename
            pstmt.setString(3, this.surname);  // surname
            pstmt.setString(4, this.IMSI);  // IMSI
            pstmt.setString(5, this.terminal_type);  // terminal_type
            pstmt.setString(6, this.subscription_type);  // subscription_type

            // Führe das Statement aus
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    public static void main(String[] args) {
        User u = new User(5,"Maxime","Mustermann","Test","Test","Test");

        u.insertIntoDB();
    }

}
