package com.dawillygene.ConfideHubs.repository;

import com.dawillygene.ConfideHubs.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {

    @Query(value = "SELECT p FROM Post p ORDER BY p.trendingScore DESC, p.createdAt DESC, p.id ASC",
            countQuery = "SELECT count(p) FROM Post p")
    Page<Post> findAll(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.expiresAt IS NULL OR p.expiresAt > :now ORDER BY p.trendingScore DESC, p.createdAt DESC")
    Page<Post> findNonExpiredPosts(@Param("now") LocalDateTime now, Pageable pageable);

    /**
     * Find posts by their IDs that are not expired
     *
     * @param ids List of post IDs to retrieve
     * @param now Current time to check against expiry
     * @param pageable Pagination information
     * @return Page of non-expired posts with the given IDs
     */
    @Query("SELECT p FROM Post p WHERE p.id IN :ids AND (p.expiresAt IS NULL OR p.expiresAt > :now)")
    Page<Post> findByIdInAndExpiresAtIsNullOrExpiresAtAfter(
            @Param("ids") List<String> ids,
            @Param("now") LocalDateTime now,
            Pageable pageable);
}
