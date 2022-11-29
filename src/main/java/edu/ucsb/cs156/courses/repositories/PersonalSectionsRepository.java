package edu.ucsb.cs156.courses.repositories;

import edu.ucsb.cs156.courses.models.PersonalSection;
import edu.ucsb.cs156.courses.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PersonalSectionsRepository extends CrudRepository<PersonalSection, Long> {
  Optional<PersonalSection> findByPsId(Long psId);
  Optional<PersonalSection> findByIdAndUser(long id, User user);

  Iterable<PersonalSection> findAllByPsId(Long psId);
  Iterable<PersonalSection> findAllByPsIdAndUser(Long psId, User user);
  Iterable<PersonalSection> findAllByUserId(Long user_id);
}
