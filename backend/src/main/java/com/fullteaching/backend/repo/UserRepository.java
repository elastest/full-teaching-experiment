package com.fullteaching.backend.repo;

import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Collection;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByName(String name);

    Collection<User> findByNameIn(Collection<String> names);

    Collection<User> findAllByCoursesIn(Collection<Course> courses);

    Collection<User> findAllByIdIn(Collection<Long> ids);

    User findById(long id);

    boolean existsByName(String name);

}
