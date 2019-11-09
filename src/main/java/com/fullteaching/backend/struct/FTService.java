package com.fullteaching.backend.struct;

import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public interface FTService<T, ID> {

    CrudRepository<T, ID> getRepo();

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
        return this.getRepo().save(entity);
    }


    default Collection<T> saveAll(Collection<T> entities){
        return StreamSupport.stream(this.getRepo().saveAll(entities).spliterator(), false)
                .collect(Collectors.toList());
    }

    default Collection<T> getAllFromIds(Iterable<ID> ids){
        return StreamSupport.stream(this.getRepo().findAllById(ids).spliterator(), false)
                .collect(Collectors.toList());
    }


    default void delete(T entity){
        this.getRepo().delete(entity);
    }

}
