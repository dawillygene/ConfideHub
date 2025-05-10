package com.dawillygene.ConfideHub.Post;

import com.dawillygene.ConfideHub.Storage.FileStorageService;
import com.dawillygene.ConfideHub.User.User;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PostService {
    @Autowired
  private PostRepository postRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public JpaRepository<Post, Long> createPost(String content, MultipartFile file, User user){
        String fileName = fileStorageService.storeFile(file);
        Post post = new Post();
        post.setContent(content);
        post.setMediaUrl(fileName);
        post.setUser(user);
        return postRepository;
    }

    public Page<Post> getAllPosts(PageRequest pageRequest){
        return postRepository.findAll(pageRequest);
    }



}
