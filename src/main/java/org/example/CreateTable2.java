package org.example;

import java.sql.*;

public class CreateTable2 {
    private static final String URL = "jdbc:sqlite:src/main/java/org/example/database.db";

    public static void main(String[] args) {
        insertProduct("Product1",20.6,34);
    }

    // Methode zum Erstellen der "warehouses"-Tabelle
    public static void createWarehousesTable() {
        String sql = "CREATE TABLE IF NOT EXISTS warehouses ("
                + " id INTEGER PRIMARY KEY,"
                + " name TEXT NOT NULL,"
                + " capacity REAL"
                + ");";

        executeSQL(sql, "warehouses");
    }

    // Methode zum Erstellen der "products"-Tabelle
    public static void createProductsTable() {
        String sql = "CREATE TABLE IF NOT EXISTS products ("
                + " id INTEGER PRIMARY KEY,"
                + " name TEXT NOT NULL,"
                + " price REAL,"
                + " warehouse_id INTEGER,"
                + " FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)"
                + ");";

        executeSQL(sql, "products");
    }

    // Hilfsmethode zur Ausführung von SQL-Befehlen
    private static void executeSQL(String sql, String tableName) {
        try (Connection conn = DriverManager.getConnection(URL);
             Statement stmt = conn.createStatement()) {

            stmt.execute(sql);
            System.out.println("Tabelle '" + tableName + "' überprüft/erstellt.");

        } catch (SQLException e) {
            System.out.println("Fehler beim Erstellen der Tabelle '" + tableName + "': " + e.getMessage());
        }

    }
    public static void insertWarehouse(String name, double capacity) {
        String sql = "INSERT INTO warehouses(name, capacity) VALUES(?, ?)";

        try (Connection conn = DriverManager.getConnection(URL);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setDouble(2, capacity);

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                System.out.println("Lagerhaus '" + name + "' erfolgreich eingefügt.");
            }

        } catch (SQLException e) {
            System.out.println("Fehler beim Einfügen in 'warehouses': " + e.getMessage());
        }
    }
    public static void createEmployeesTable() {
        String sql = "CREATE TABLE IF NOT EXISTS employees ("
                + " id INTEGER PRIMARY KEY,"
                + " name TEXT NOT NULL,"
                + " position TEXT NOT NULL,"
                + " warehouse_id INTEGER,"
                + " FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)"
                + ");";

        executeSQL(sql, "employees");
    }
    public static void insertProduct(String name, double price, int warehouseId) {
        String sql = "INSERT INTO products(name, price, warehouse_id) VALUES(?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setDouble(2, price);
            pstmt.setInt(3, warehouseId);

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                System.out.println("Produkt '" + name + "' erfolgreich eingefügt.");
            }

        } catch (SQLException e) {
            System.out.println("Fehler beim Einfügen in 'products': " + e.getMessage());
        }
    }
}
