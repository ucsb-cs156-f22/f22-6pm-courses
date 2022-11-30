package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;


import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.mockito.Mockito.when;
//import org.springframework.context.annotation.Import;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.entities.UCSBSubject;

import java.rmi.NoSuchObjectException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@RestClientTest(UpdateCourseDataOneQuarterJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataOneQuarterJobFactoryTests {

    @MockBean
    UCSBCurriculumService ucsbCurriculumService;

    @MockBean
    ConvertedSectionCollection convertedSectionCollection;

    @MockBean
    UCSBSubjectRepository subjectRepository;

    @Autowired
    UpdateCourseDataOneQuarterJobFactory updateCourseDataOneQuarterJobFactory;

    @Test
    void test_create() throws Exception {

        UCSBSubject sub = UCSBSubject.builder()
            .subjectCode("MATH")
            .subjectTranslation("Mathematics")
            .deptCode("MATH")
            .collegeCode("L&S")
            .relatedDeptCode(null)
            .inactive(false)
            .build();

        ArrayList<UCSBSubject> subjects = new ArrayList<>();
        subjects.addAll(Arrays.asList(sub));

        when(subjectRepository.findAll()).thenReturn(subjects);

        // Act

        UpdateCourseDataOneQuarterJob updateCourseDataOneQuarterJob = updateCourseDataOneQuarterJobFactory.create("20211");

        // Assert

        assertEquals("20211",updateCourseDataOneQuarterJob.getQuarterYYYYQ());
        assertEquals(ucsbCurriculumService,updateCourseDataOneQuarterJob.getUcsbCurriculumService());
        assertEquals(convertedSectionCollection,updateCourseDataOneQuarterJob.getConvertedSectionCollection());

    }
}