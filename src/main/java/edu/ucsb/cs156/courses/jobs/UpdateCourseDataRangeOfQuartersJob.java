package edu.ucsb.cs156.courses.jobs;

import java.util.List;
import java.util.Optional;


import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
//import edu.ucsb.cs156.courses.entities.UCSBSubject;
//import edu.ucsb.cs156.courses.models.Quarter;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.services.jobs.JobContext;
import edu.ucsb.cs156.courses.services.jobs.JobContextConsumer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;


@AllArgsConstructor
@Slf4j
public class UpdateCourseDataRangeOfQuartersJob implements JobContextConsumer {

    @Getter private String start_quarterYYYYQ;
    @Getter private String end_quarterYYYYQ;
    @Getter private UCSBCurriculumService ucsbCurriculumService;
    @Getter private ConvertedSectionCollection convertedSectionCollection;
    @Getter private List<String> subjects;

    @Override
    public void accept(JobContext ctx) throws Exception {


        int year1 = Integer.parseInt(start_quarterYYYYQ.substring(0,4));
        int qtr1 = Integer.parseInt(start_quarterYYYYQ.substring(4));


        int year2 = Integer.parseInt(end_quarterYYYYQ.substring(0,4));
        int qtr2 = Integer.parseInt(end_quarterYYYYQ.substring(4));

        int current_year = year1;
        int current_qtr = qtr1;

        int end_year = year2;
        int end_qtr = qtr2;
    
        //case 1
        if(year1 > year2){
            return;
            // current_year = year2;
            // current_qtr = qtr2;

            // end_year = year1;
            // end_qtr = qtr1;
        }

        //case 2
        if(year1 == year2) {

            if(qtr1 > qtr2) {
                return;
            }
            // current_year = year1;
            // end_year = year2;

            // if(qtr1 <= qtr2){
            //     current_qtr = qtr1;
            //     end_qtr = qtr2;
            // } else {
            //     current_qtr = qtr2;
            //     end_qtr = qtr1;
            // }
        }
        for(int c_year = current_year; c_year < 9999; c_year++) {
            for(int c_qtr = current_qtr; c_qtr<=4; c_qtr++){
                String quarterYYYYQ = String.valueOf(c_year) + String.valueOf(c_qtr);
                for (String subjectArea : subjects) {
                    ctx.log("Updating courses for [" + subjectArea + " " + quarterYYYYQ + "]");

                    List<ConvertedSection> convertedSections = ucsbCurriculumService.getConvertedSections(subjectArea, quarterYYYYQ,
                            "A");

                    ctx.log("Found " + convertedSections.size() + " sections");
                    ctx.log("Storing in MongoDB Collection...");

                    int newSections = 0;
                    int updatedSections = 0;
                    int errors = 0;

                    for (ConvertedSection section : convertedSections) {
                        try {
                            String quarter = section.getCourseInfo().getQuarter();
                            String enrollCode =  section.getSection().getEnrollCode();
                            Optional<ConvertedSection> optionalSection = convertedSectionCollection
                                    .findOneByQuarterAndEnrollCode(quarter,enrollCode);
                            if (optionalSection.isPresent()) {
                                ConvertedSection existingSection = optionalSection.get();
                                existingSection.setCourseInfo(section.getCourseInfo());
                                existingSection.setSection(section.getSection());
                                convertedSectionCollection.save(existingSection);
                                updatedSections++;
                            } else {
                                convertedSectionCollection.save(section);
                                newSections++;
                            }
                        } catch (Exception e) {
                            ctx.log("Error saving section: " + e.getMessage());
                            errors++;
                        }
                    }
                
                    ctx.log(String.format("%d new sections saved, %d sections updated, %d errors", newSections, updatedSections,
                            errors));
                    ctx.log("Courses for [" + subjectArea + " " + quarterYYYYQ + "] have been updated");

                    //break;
                }

                if(c_year == end_year && c_qtr == end_qtr){
                    return;
                }

                //current_qtr++;

                if(c_qtr == 4){
                    //current_year++;
                    current_qtr = 1;
                }
            }
        }
    }
}