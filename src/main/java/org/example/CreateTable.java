package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;


public class CreateTable {
    public static void main(String[] args) {
        // SQLite connection string
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        // SQL statement for creating a new table
        var sql = "CREATE TABLE IF NOT EXISTS warehouses ("
                + "	id INTEGER PRIMARY KEY,"
                + "	name text NOT NULL,"
                + "	capacity REAL"
                + ");";

        try (var conn = DriverManager.getConnection(url);
             var stmt = conn.createStatement()) {
            // create a new table
            stmt.execute(sql);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}


