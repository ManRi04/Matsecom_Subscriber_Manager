package org.example;

import java.sql.DriverManager;
import java.sql.SQLException;

public class RanTechnology {
    String name;
    double maximumThroughput;
    double achievableThroughputPerSignalQualityGood;
    double achievableThroughputPerSignalQualityMedium;
    double achievableThroughputPerSignalQualityLow;
    double achievableThroughputPerSignalQualityNA;
    boolean voiceCallSupport;

    public void insertIntoDB() {
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        var sql = "INSERT INTO ran_technology (name, maximum_throughput, achievable_throughput_per_signal_quality_good, achievable_throughput_per_signal_quality_medium, achievable_throughput_per_signal_quality_low, achievable_throughput_per_signal_quality_na, voice_call_support) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (var conn = DriverManager.getConnection(url);
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, this.name);
            pstmt.setDouble(2, this.maximumThroughput);
            pstmt.setDouble(3, this.achievableThroughputPerSignalQualityGood);
            pstmt.setDouble(4, this.achievableThroughputPerSignalQualityMedium);
            pstmt.setDouble(5, this.achievableThroughputPerSignalQualityLow);
            pstmt.setDouble(6, this.achievableThroughputPerSignalQualityNA);
            pstmt.setBoolean(7, this.voiceCallSupport);

            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }



}
