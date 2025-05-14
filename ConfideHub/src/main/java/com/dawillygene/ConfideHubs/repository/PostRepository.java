package com.dawillygene.ConfideHubs.repository;


import com.dawillygene.ConfideHubs.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
}