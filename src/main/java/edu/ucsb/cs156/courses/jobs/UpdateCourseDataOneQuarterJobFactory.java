package edu.ucsb.cs156.courses.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.repositories.UCSBSubjectRepository;
import edu.ucsb.cs156.courses.entities.UCSBSubject;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

@Service
@Slf4j
public class UpdateCourseDataOneQuarterJobFactory  {

    @Autowired 
    private UCSBCurriculumService ucsbCurriculumService;

    @Autowired
    private ConvertedSectionCollection convertedSectionCollection;

    @Autowired
    private UCSBSubjectRepository subjectRepository;

    public UpdateCourseDataOneQuarterJob create(String quarterYYYYQ) {
        log.info("ucsbCurriculumService = " + ucsbCurriculumService);
        log.info("convertedSectionCollection = " + convertedSectionCollection);
        List<String> subjects = new ArrayList<String>();
        Iterable<UCSBSubject> UCSBSubjects = subjectRepository.findAll();
        for (UCSBSubject UCSBSubject : UCSBSubjects)
            subjects.add(UCSBSubject.getSubjectCode());
        return new UpdateCourseDataOneQuarterJob(quarterYYYYQ, ucsbCurriculumService, convertedSectionCollection, subjects);
    }
}