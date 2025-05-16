package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findAll(Pageable pageable);
}