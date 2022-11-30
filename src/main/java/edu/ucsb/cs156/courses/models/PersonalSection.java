package edu.ucsb.cs156.courses.models;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.Section;
 
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalSection {
    private PSCourse psCourse;
    private PersonalSchedule personalSchedule;
    private CourseInfo courseInfo;
    private Section section;
}