package org.example;

import java.sql.DriverManager;
import java.sql.SQLException;

public class Terminal {
    String name;
    boolean _2GSupported;
    boolean _3GSupported;
    boolean _4GSupported;


    public Terminal(String name, boolean _2GSupported, boolean _3GSupported, boolean _4GSupported) {
        this.name = name;
        this._2GSupported = _2GSupported;
        this._3GSupported = _3GSupported;
        this._4GSupported = _4GSupported;
    }


    public void insertIntoDB() {
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        var sql = "INSERT INTO terminal (name, _2GSupported, _3GSupported, _4GSupported) VALUES (?, ?, ?, ?)";

        try (var conn = DriverManager.getConnection(url);
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, this.name);
            pstmt.setBoolean(2, this._2GSupported);
            pstmt.setBoolean(3, this._3GSupported);
            pstmt.setBoolean(4, this._4GSupported);

            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

}
