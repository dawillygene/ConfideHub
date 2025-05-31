package com.dawillygene.ConfideHubs.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class AnonymousUsernameService {

    private static final List<String> ADJECTIVES = Arrays.asList(
            "Kimya",         // Swahili: Silent
            "Fiche",         // Swahili: Hidden
            "Siri",          // Swahili: Secret
            "Mpole",         // Swahili: Calm/Gentle
            "Nyuma",         // Swahili: Behind
            "Waziwazi",      // Swahili: Subtle
            "Obscuro",       // Spanish: Obscure
            "Silencieux",    // French: Silent
            "Clandestino",   // Spanish: Clandestine
            "Tihka",         // Arabic: Mysterious
            "Kivuli",        // Swahili: Shadowed
            "Lointain",      // French: Distant
            "Latente",       // Italian/Spanish: Latent
            "Incognito",     // Latin: Unknown
            "Hafifu",        // Swahili: Dim
            "Veiled",        // English: Covered/Hidden
            "Silent",
            "Hidden",
            "Dusky",
            "Cicha"          // Swahili: Quiet/Whispered
    );


    private static final List<String> NOUNS = Arrays.asList(
            "Mgeni",         // Swahili: Stranger/Guest
            "Roho",          // Swahili: Spirit
            "Mzuka",         // Swahili: Ghost
            "Sauti",         // Swahili: Voice
            "Upepo",         // Swahili: Wind
            "Wingu",         // Swahili: Cloud
            "Silhouette",    // French/English
            "Eco",           // Spanish: Echo
            "Nocturne",      // French: Night-themed
            "Sombras",       // Spanish: Shadows
            "Voyageur",      // French: Traveler
            "Njia",          // Swahili: Path
            "Malaika",       // Swahili: Angel
            "Nomad",
            "Watcher",
            "Drifter",
            "Echo",
            "Phantom",
            "Stranger",
            "Mwitu"          // Swahili: Wilderness
    );

    /**
     * Generates a random username for general purposes
     * @return a randomly generated username
     */
    public String generateAnonymousUsername() {
        Random random = new Random();
        String adjective = ADJECTIVES.get(random.nextInt(ADJECTIVES.size()));
        String noun = NOUNS.get(random.nextInt(NOUNS.size()));
        int randomNumber = random.nextInt(10000);

        return adjective + noun + randomNumber;
    }

    /**
     * Generates a deterministic anonymous username based on the provided ID.
     * The same ID will always generate the same username.
     *
     * @param id The ID to use as a seed (post ID or user ID)
     * @return A consistently generated anonymous username for the given ID
     */
    public String generateDeterministicUsername(String id) {
        if (id == null || id.isEmpty()) {
            return generateAnonymousUsername();
        }

        // Create a consistent seed based on the ID's hashcode
        int seed = id.hashCode();
        Random seededRandom = new Random(seed);

        // Generate consistent username components
        String adjective = ADJECTIVES.get(Math.abs(seededRandom.nextInt()) % ADJECTIVES.size());
        String noun = NOUNS.get(Math.abs(seededRandom.nextInt()) % NOUNS.size());

        // Generate a number between 1000-9999 to avoid small numbers
        int randomNumber = 1000 + (Math.abs(seededRandom.nextInt()) % 9000);

        return adjective + noun + randomNumber;
    }
}
