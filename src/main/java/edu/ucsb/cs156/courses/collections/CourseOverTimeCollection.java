package edu.ucsb.cs156.courses.collections;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import edu.ucsb.cs156.courses.documents.ConvertedSection;

@Repository
public interface CourseOverTimeCollection extends MongoRepository<ConvertedSection, ObjectId> {
    @Query("{'courseInfo.startquarter': ?0, 'courseInfo.endquarter': ?1, 'courseInfo.courseId': ?2}")
    Optional<ConvertedSection> findOneByQuarterAndEnrollCode(String startquarter, String endQuarter, String courseId);
}
