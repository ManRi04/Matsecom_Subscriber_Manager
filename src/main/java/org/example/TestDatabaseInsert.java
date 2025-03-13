package org.example;

public class TestDatabaseInsert {

    public static void main(String[] args) {
        // Terminal Testobjekt
        Terminal terminal = new Terminal("iPhone 13", true, true, true);

        terminal.insertIntoDB();

        // SubscriptionType Testobjekt
        SubscriptionType st = new SubscriptionType("test", 10, 500, 5, 10000);

        st.insertIntoDB();

        // ServiceType Testobjekt
        ServiceType service = new ServiceType();
        service.name = "Standard Service";
        service.voiceCall = "Supported";
        service.browsingAndSocialNetworking = "Unlimited";
        service.AppDownload = "Up to 5GB";
        service.AdaptiveHDVideo = "1080p supported";
        service.insertIntoDB();

        // RanTechnology Testobjekt
        RanTechnology ranTech = new RanTechnology();
        ranTech.name = "5G NR";
        ranTech.maximumThroughput = 1000.0;
        ranTech.achievableThroughputPerSignalQualityGood = 800.0;
        ranTech.achievableThroughputPerSignalQualityMedium = 500.0;
        ranTech.achievableThroughputPerSignalQualityLow = 200.0;
        ranTech.achievableThroughputPerSignalQualityNA = 50.0;
        ranTech.voiceCallSupport = true;
        ranTech.insertIntoDB();


        User u = new User(5,"Maxime","Mustermann","Test","Test","Test");
        u.insertIntoDB();

        System.out.println("Testobjekte erfolgreich in die Datenbank eingefügt!");
    }
}
