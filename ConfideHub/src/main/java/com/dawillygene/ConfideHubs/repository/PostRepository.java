package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {

    @Query(value = "SELECT p FROM Post p ORDER BY p.trendingScore DESC, p.createdAt DESC, p.id ASC",
            countQuery = "SELECT count(p) FROM Post p")
    Page<Post> findAll(Pageable pageable);
}