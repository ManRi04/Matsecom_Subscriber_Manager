package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class InitDB {
    public static final String URL = "jdbc:sqlite:src/main/java/org/example/database.db";
    public void init() {
        createProductsTable();

    }
    public void createUserTable(){
        var sql = "CREATE TABLE IF NOT EXISTS users ("
                + "	id INTEGER PRIMARY KEY,"
                + "	prename text NOT NULL,"
                + "	surname text NOT NULL," +
                "IMSI text NOT NULL," +
                "terminal_type text NOT NULL," +
                "subscription_type text NOT NULL);";

        executeSQL(sql, "users");
    }
    public void createSubscriptionTable(){
        var sql = "CREATE TABLE IF NOT EXISTS subscriptionType ("
                + "	id INTEGER PRIMARY KEY,"
                + "	name text NOT NULL,"
                + "	basicFee INTEGER," +
                "minutesIncluded INTEGER," +
                "pricePerExtraMinute INTEGER," +
                "_3G_4G_Datavolume INTEGER);";
        executeSQL(sql, "subscriptionType");
    }

    public void createTerminalTable() {
        var sql = "CREATE TABLE IF NOT EXISTS terminal ("
                + " id INTEGER PRIMARY KEY,"
                + " name TEXT NOT NULL,"
                + " _2GSupported BOOLEAN,"
                + " _3GSupported BOOLEAN,"
                + " _4GSupported BOOLEAN"
                + ");";
        executeSQL(sql, "terminal");
    }

    public void createProductsTable() {
        var sql = "CREATE TABLE IF NOT EXISTS products ("
                + " id INTEGER PRIMARY KEY,"
                + " name TEXT NOT NULL,"
                + " description TEXT,"
                + " price REAL NOT NULL,"
                + " stock_quantity INTEGER NOT NULL,"
                + " created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                + ");";
        executeSQL(sql, "products");
    }

    private static void executeSQL(String sql, String tableName) {
        try (Connection conn = DriverManager.getConnection(URL);
             Statement stmt = conn.createStatement()) {

            stmt.execute("PRAGMA foreign_keys = ON;");  // Fremdschlüssel aktivieren

            stmt.execute(sql);
            System.out.println("Tabelle '" + tableName + "' überprüft/erstellt.");

        } catch (SQLException e) {
            System.out.println("Fehler beim Erstellen der Tabelle '" + tableName + "': " + e.getMessage());
        }

    }

    public static void main(String[] args) {
        InitDB init = new InitDB();
        init.init();

    }
}
