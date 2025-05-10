package com.dawillygene.ConfideHub.Storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    public String storeFile(MultipartFile file) {
        // Simplified: In practice, save file to a storage system and return URL
        return "uploaded_" + file.getOriginalFilename();
    }
}
