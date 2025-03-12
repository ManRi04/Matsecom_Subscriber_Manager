package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class SQLiteConnection {
    public static Connection connect() {
        String url = "jdbc:sqlite:src/main/java/org/example/database.db"; // Passe den Pfad an

        try {
            Connection conn = DriverManager.getConnection(url);
            System.out.println("Verbindung zur SQLite-Datenbank erfolgreich!");
            return conn;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public static void main(String[] args) {
        SQLiteConnection con = new SQLiteConnection();
        con.connect();
    }
}
