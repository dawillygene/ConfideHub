package com.dawillygene.ConfideHubs.controllers;

import com.dawillygene.ConfideHubs.model.GeminiModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class GeminiModelController {

    private static final Logger log = LoggerFactory.getLogger(GeminiModelController.class);
    
    @Value("${spring.ai.openai.api-key}")
    private String GEMINI_API_KEY;

    private final RestClient restClient;

    public GeminiModelController(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    @GetMapping("/models")
    public List<GeminiModel> models() {
        ResponseEntity<ModelListResponse> response = restClient.get()
                .uri("/v1beta/openai/models")
                .header("Authorization", "Bearer " + GEMINI_API_KEY)
                .retrieve()
                .toEntity(ModelListResponse.class);
        return response.getBody().data();
    }

    @PostMapping("/generate-title")
    public String generateTitle(@RequestBody String content) {
        log.info("Generating title for content: {}", content.substring(0, Math.min(content.length(), 50)) + "...");

        String prompt = "Generate a single, emotionally resonant and eye-catching headline (max 15 words) for the following story. The headline must sound human and sincere, like a real blog or story title. Avoid clickbait, special characters, and additional options. Return only the headline, plain text, no punctuation at the end. Content: " + content;



        Map<String, Object> requestBody = new HashMap<>();

        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> contentObj = new HashMap<>();
        contentObj.put("parts", List.of(part));

        requestBody.put("contents", List.of(contentObj));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 50);
        generationConfig.put("topP", 0.8);
        generationConfig.put("topK", 40);
        
        requestBody.put("generationConfig", generationConfig);
        
        try {
            log.info("Making request to Gemini API...");
            
            ResponseEntity<Map> response = restClient.post()
                    .uri("/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + GEMINI_API_KEY)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .toEntity(Map.class);
            
            log.info("Received response from Gemini API: {}", response.getStatusCode());
            
            if (response.getBody() != null) {
                log.debug("Response body: {}", response.getBody());
                
                // Extract the generated title from the response
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> content1 = (Map<String, Object>) candidate.get("content");
                    if (content1 != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content1.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            String generatedTitle = (String) parts.get(0).get("text");
                            if (generatedTitle != null && !generatedTitle.trim().isEmpty()) {
                                log.info("Successfully generated title: {}", generatedTitle);
                                return generatedTitle.trim();
                            }
                        }
                    }
                }
                
                // Check for error in response
                if (response.getBody().containsKey("error")) {
                    Map<String, Object> error = (Map<String, Object>) response.getBody().get("error");
                    log.error("Gemini API error: {}", error.get("message"));
                }
            }
            
            log.warn("No valid title generated, using fallback");
            return "Untitled Post";
            
        } catch (Exception e) {
            log.error("Error generating title: ", e);
            return "Untitled Post";
        }
    }
}