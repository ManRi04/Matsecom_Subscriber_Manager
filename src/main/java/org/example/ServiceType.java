package org.example;

import java.sql.DriverManager;
import java.sql.SQLException;

public class ServiceType {
    String name;
    String voiceCall;
    String  browsingAndSocialNetworking;
    String AppDownload;
    String AdaptiveHDVideo;

    public void insertIntoDB() {
        var url = "jdbc:sqlite:src/main/java/org/example/database.db";

        var sql = "INSERT INTO service_type (name, voice_call, browsing_and_social_networking, app_download, adaptive_hd_video) VALUES (?, ?, ?, ?, ?)";

        try (var conn = DriverManager.getConnection(url);
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, this.name);
            pstmt.setString(2, this.voiceCall);
            pstmt.setString(3, this.browsingAndSocialNetworking);
            pstmt.setString(4, this.AppDownload);
            pstmt.setString(5, this.AdaptiveHDVideo);

            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

}
