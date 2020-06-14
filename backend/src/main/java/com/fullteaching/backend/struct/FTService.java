package com.fullteaching.backend.struct;

import com.fullteaching.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public interface FTService<T, ID> {

    JpaRepository<T, ID> getRepo();

    /**
     * Retrieves an entity by calling to the repo method: findById(ID id)
     * @param id The id of the entity we are looking for
     * @return The entity from database
     */
    default T getFromId(ID id) {
        return this.getRepo()
                .findById(id)
                .orElse(null);
    }

    /**
     * Deletes an entity by calling to the repo method deleteById(ID id)
     * @param id The id of the entity we want to remove
     */
    default void deleteById(ID id) {
        this.getRepo().deleteById(id);
    }

    /**
     * Removes all the entities from database
     * @param entities A collection of entities
     */
    default void deleteAll(Iterable<T> entities){
        this.getRepo().deleteAll(entities);
    }

    /**
     * Saves an entity in the database by calling to the crudrepository method save
     * @param entity The entity we want to save
     * @return The saved entity
     */
    default T save(T entity){
        T saved = this.getRepo().save(entity);
        this.getRepo().flush();
        return saved;
    }


    default Collection<T> saveAll(Collection<T> entities){
        List<T> saved = new ArrayList<>(this.getRepo().saveAll(entities));
        this.getRepo().flush();
        return saved;
    }

    default Collection<T> getAllFromIds(Iterable<ID> ids){
        return new ArrayList<>(this.getRepo().findAllById(ids));
    }


    default void delete(T entity){
        this.getRepo().delete(entity);
    }

    default Page<T> getall(int page, int size){
        return this.getRepo().findAll(PageRequest.of(page, size));
    }
}
