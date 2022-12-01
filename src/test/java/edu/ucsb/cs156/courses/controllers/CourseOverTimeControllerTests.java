package edu.ucsb.cs156.courses.controllers;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.Section;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;

@WebMvcTest(value = CourseOverTimeController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class CourseOverTimeControllerTests {
    private final Logger logger = LoggerFactory.getLogger(CourseOverTimeControllerTests.class);
    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    ConvertedSectionCollection convertedSectionCollection;

    @Test
    public void test_search_emptyRequest() throws Exception {
        List<ConvertedSection> expectedResult = new ArrayList<ConvertedSection>();
        String urlTemplate = "/api/public/courseovertime/search?endQuarter=%s&number=%s&startQuarter=%s&subject=%s";
        
        String url = String.format(urlTemplate, "20222", "156", "20221", "CMPSC");

        when(convertedSectionCollection.findCourseOverTime(any(String.class), any(String.class), any(String.class)))
            .thenReturn(expectedResult);

        MvcResult response = mockMvc.perform(get(url).contentType("application/json")).andExpect(status().isOk()).andReturn();

        String responseString = response.getResponse().getContentAsString();
        String expcted = mapper.writeValueAsString(expectedResult);
        
        assertEquals(expcted, responseString);
    }

    @Test public void test_search_short() throws Exception {
        CourseInfo info = CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   64")
            .title("COMP ORGANIZATION")
            .description("Intro to Computer Organization")
            .build();
        
        Section section1 = new Section();
        Section section2 = new Section();
        Section section3 = new Section();

        ConvertedSection course_one = ConvertedSection.builder()
            .courseInfo(info)
            .section(section1)
            .build();
        
        ConvertedSection course_two = ConvertedSection.builder()
            .courseInfo(info)
            .section(section2)
            .build();
        ConvertedSection couse_three = ConvertedSection.builder()
            .courseInfo(info)
            .section(section3)
            .build();

            String urlTemplate = "/api/public/courseovertime/search?endQuarter=%s&number=%s&startQuarter=%s&subject=%s";
    
            String url = String.format(urlTemplate, "20222", "64", "20221", "CMPSC");

        List<ConvertedSection> expectedSections = new ArrayList<ConvertedSection>();
        expectedSections.add(course_one);
        expectedSections.add(course_two);
        expectedSections.add(couse_three);

        // mock
        when(convertedSectionCollection.findCourseOverTime(any(String.class), any(String.class), eq("CMPSC    64"))).thenReturn(expectedSections);

        // act
        MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();

        // assert
        String expectedString = mapper.writeValueAsString(expectedSections);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedString, responseString);
    }

    @Test public void test_search_long() throws Exception {
        CourseInfo info = CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC   130A")
            .title("DATA STRUCT AND ALG")
            .description("Data Structures and Algorithms")
            .build();
        
        Section section1 = new Section();

        Section section2 = new Section();

        ConvertedSection course_one = ConvertedSection.builder()
            .courseInfo(info)
            .section(section1)
            .build();
        
        ConvertedSection course_two = ConvertedSection.builder()
            .courseInfo(info)
            .section(section2)
            .build();

        String urlTemplate = "/api/public/courseovertime/search?endQuarter=%s&number=%s&startQuarter=%s&subject=%s";
    
        String url = String.format(urlTemplate, "20222", "130A", "20221", "CMPSC");

        System.out.println("testing two");
        System.out.println(url);

        List<ConvertedSection> expectedSections = new ArrayList<ConvertedSection>();
        expectedSections.add(course_one);
        expectedSections.add(course_two);

        when(convertedSectionCollection.findCourseOverTime(any(String.class), any(String.class), eq("CMPSC   130A "))).thenReturn(expectedSections);

        MvcResult response = mockMvc.perform(get(url)).andExpect(status().isOk()).andReturn();
        
        String responseString = response.getResponse().getContentAsString();
        String expected = mapper.writeValueAsString(expectedSections);
        assertEquals(expected, responseString);
    }

}