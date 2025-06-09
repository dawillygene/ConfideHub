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
import java.util.Optional;

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

    /**
     * Find all posts by a specific user
     * @param userId the user ID
     * @param pageable pagination information
     * @return Page of posts by the user
     */
    @Query("SELECT p FROM Post p WHERE p.userId = :userId ORDER BY p.createdAt DESC")
    Page<Post> findByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * Find non-expired posts by a specific user
     * @param userId the user ID
     * @param now current time to check against expiry
     * @param pageable pagination information
     * @return Page of non-expired posts by the user
     */
    @Query("SELECT p FROM Post p WHERE p.userId = :userId AND (p.expiresAt IS NULL OR p.expiresAt > :now) ORDER BY p.createdAt DESC")
    Page<Post> findByUserIdAndNotExpired(@Param("userId") Long userId, @Param("now") LocalDateTime now, Pageable pageable);

    /**
     * Check if a post belongs to a specific user
     * @param postId the post ID
     * @param userId the user ID
     * @return true if the post belongs to the user
     */
    @Query("SELECT COUNT(p) > 0 FROM Post p WHERE p.id = :postId AND p.userId = :userId")
    boolean existsByIdAndUserId(@Param("postId") String postId, @Param("userId") Long userId);

    /**
     * Find a post by ID and user ID
     * @param postId the post ID
     * @param userId the user ID
     * @return Optional of the post if found and belongs to user
     */
    @Query("SELECT p FROM Post p WHERE p.id = :postId AND p.userId = :userId")
    Optional<Post> findByIdAndUserId(@Param("postId") String postId, @Param("userId") Long userId);

    /**
     * Count posts by user ID
     * @param userId the user ID
     * @return number of posts by the user
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
}
