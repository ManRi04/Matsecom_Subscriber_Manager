package org.example;

import java.sql.DriverManager;
import java.sql.SQLException;

public class SubscriptionType {
    String name;
    int basicFee;
    int minutesIncluded;
    int pricePerExtraMinute;
    int _3G_4G_Datavolume;

    public SubscriptionType(){

    }

    public SubscriptionType(String name, int basicFee, int minutesIncluded, int pricePerExtraMinute, int _3G_4G_Datavolume) {
        this.name = name;
        this.basicFee = basicFee;
        this.minutesIncluded = minutesIncluded;
        this.pricePerExtraMinute = pricePerExtraMinute;
        this._3G_4G_Datavolume = _3G_4G_Datavolume;

    }
    public void insertIntoDB() {
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        var sql = "INSERT INTO subscriptionType (name, basicFee, minutesIncluded, pricePerExtraMinute, _3G_4G_Datavolume) VALUES (?, ?, ?, ?, ?)";

        try (var conn = DriverManager.getConnection(url);
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, this.name);
            pstmt.setInt(2, this.basicFee);
            pstmt.setInt(3, this.minutesIncluded);
            pstmt.setInt(4, this.pricePerExtraMinute);
            pstmt.setInt(5, this._3G_4G_Datavolume);

            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }



    public static void main(String[] args) {
        SubscriptionType st = new SubscriptionType("test", 10, 10, 10, 10);


    }
}



