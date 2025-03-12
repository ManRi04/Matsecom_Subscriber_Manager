package org.example;

import java.sql.DriverManager;
import java.sql.SQLException;

public class SubscriptionType {
    String name;
    int basicFee;
    int minutesIncluded;
    int pricePerExtraMinute;
    int _3G_4G_Datavolume;

    public SubscriptionType(String name, int basicFee, int minutesIncluded, int pricePerExtraMinute, int _3G_4G_Datavolume) {
        this.name = name;
        this.basicFee = basicFee;
        this.minutesIncluded = minutesIncluded;
        this.pricePerExtraMinute = pricePerExtraMinute;
        this._3G_4G_Datavolume = _3G_4G_Datavolume;

    }

    public void createInDB() {
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        var sql = "CREATE TABLE IF NOT EXISTS subscriptionType ("
                + "	id INTEGER PRIMARY KEY,"
                + "	name text NOT NULL,"
                + "	basicFee INTEGER," +
                "minutesIncluded INTEGER," +
                "pricePerExtraMinute INTEGER," +
                "_3G_4G_Datavolume INTEGER);";

        try (var conn = DriverManager.getConnection(url);
             var stmt = conn.createStatement()) {
            // create a new table
            stmt.execute(sql);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    public static void main(String[] args) {
        SubscriptionType st = new SubscriptionType("test", 10, 10, 10, 10);
        st.createInDB();

    }
}



