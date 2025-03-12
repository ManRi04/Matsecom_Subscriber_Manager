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
    public void createInDB(){

        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        var sql = "CREATE TABLE IF NOT EXISTS users ("
                + "	id INTEGER PRIMARY KEY,"
                + "	prename text NOT NULL,"
                + "	surname text NOT NULL," +
                "IMSI text NOT NULL," +
                "terminal_type text NOT NULL," +
                "subscription_type text NOT NULL);";

        try (var conn = DriverManager.getConnection(url);
             var stmt = conn.createStatement()) {
            // create a new table
            stmt.execute(sql);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

    }

    public static void main(String[] args) {
        User u = new User(3,null,null,null,null,null);
        u.createInDB();
    }

}
