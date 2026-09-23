package com.reconciliation.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/bank_reconciliation}")
    private String primaryUri;

    private static final String LOCAL_FALLBACK_URI = "mongodb://localhost:27017/bank_reconciliation";

    @Override
    protected String getDatabaseName() {
        try {
            ConnectionString connectionString = new ConnectionString(primaryUri);
            String db = connectionString.getDatabase();
            return (db != null && !db.isEmpty()) ? db : "bank_reconciliation";
        } catch (Exception e) {
            return "bank_reconciliation";
        }
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        // Attempt Primary Connection (Atlas or Configured URI)
        try {
            System.out.println(">>> Attempting MongoDB connection to: " + maskUri(primaryUri));
            ConnectionString connectionString = new ConnectionString(primaryUri);
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .build();
            MongoClient client = MongoClients.create(settings);
            
            // Ping to verify authentication & connectivity
            client.getDatabase(getDatabaseName()).runCommand(new org.bson.BsonDocument("ping", new org.bson.BsonInt32(1)));
            System.out.println(">>> Successfully connected to Primary MongoDB!");
            return client;
        } catch (Exception ex) {
            System.err.println(">>> Primary MongoDB Connection / Auth Notice: " + ex.getMessage());
            System.out.println(">>> Falling back to Local MongoDB: " + LOCAL_FALLBACK_URI);
            
            ConnectionString fallbackConn = new ConnectionString(LOCAL_FALLBACK_URI);
            MongoClientSettings fallbackSettings = MongoClientSettings.builder()
                    .applyConnectionString(fallbackConn)
                    .build();
            return MongoClients.create(fallbackSettings);
        }
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }

    private String maskUri(String uri) {
        if (uri == null) return "";
        return uri.replaceAll("://([^:]+):([^@]+)@", "://$1:****@");
    }
}
