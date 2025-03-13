package org.example;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.*;

import java.io.*;
import java.net.InetSocketAddress;
import java.sql.*;
import java.util.stream.Collectors;

public class SimpleHttpServer {
    public static void main(String[] args) throws IOException {
        // HTTP-Server starten auf Port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/user", new UserHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server läuft auf http://localhost:8080/");
    }

    static class UserHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // CORS-Header setzen
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");  // * erlaubt alle Ursprünge
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS"); // Erlaubte HTTP-Methoden
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type"); // Erlaubte Header

            // Wenn die Anfrage eine Preflight-Anfrage (OPTIONS) ist
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);  // 204 No Content für OPTIONS-Anfragen
                return; // Stoppe hier, keine weitere Verarbeitung notwendig
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                // JSON aus dem Request-Body lesen
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
                String json = new BufferedReader(isr).lines().collect(Collectors.joining());

                // Optional: JSON in User-Objekt umwandeln (falls du das noch später brauchst)
                ObjectMapper objectMapper = new ObjectMapper();
                // User user = objectMapper.readValue(json, User.class);

                // Für Debugging: Gebe den empfangenen JSON-Inhalt im Log aus
                System.out.println("Empfangene JSON-Daten: " + json);

                // Antwort senden (gibt die empfangenen Daten zurück)
                String response = "Empfangen: " + json;
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Methode nicht erlaubt
            }
        }
    }
}

