package edu.ucsb.cs156.courses.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;


import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.controllers.UCSBSubjectsController;


@RestClientTest(UpdateCourseDataOneQuarterJobFactory.class)
@AutoConfigureDataJpa
public class UpdateCourseDataOneQuarterJobFactoryTests {

    @MockBean
    UCSBCurriculumService ucsbCurriculumService;

    @MockBean
    ConvertedSectionCollection convertedSectionCollection;

    @MockBean
    UCSBSubjectsController subjectsController;

    @Autowired
    UpdateCourseDataOneQuarterJobFactory updateCourseDataOneQuarterJobFactory;

    @Test
    void test_create() throws Exception {

        // Act

        UpdateCourseDataOneQuarterJob updateCourseDataOneQuarterJob = updateCourseDataOneQuarterJobFactory.create("20211");

        // Assert

        assertEquals("20211",updateCourseDataOneQuarterJob.getQuarterYYYYQ());
        assertEquals(ucsbCurriculumService,updateCourseDataOneQuarterJob.getUcsbCurriculumService());
        assertEquals(convertedSectionCollection,updateCourseDataOneQuarterJob.getConvertedSectionCollection());

    }
}