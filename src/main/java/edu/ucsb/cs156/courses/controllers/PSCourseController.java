package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.entities.PSCourse;
import edu.ucsb.cs156.courses.entities.User;
import edu.ucsb.cs156.courses.errors.EntityNotFoundException;
import edu.ucsb.cs156.courses.models.CurrentUser;
import edu.ucsb.cs156.courses.repositories.PSCourseRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Iterator;

import edu.ucsb.cs156.courses.entities.PersonalSchedule;
import edu.ucsb.cs156.courses.repositories.PersonalScheduleRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import edu.ucsb.cs156.courses.errors.BadEnrollCdException;

@Api(description = "PSCourse")
@RequestMapping("/api/courses")
@RestController
@Slf4j
public class PSCourseController extends ApiController {

    @Autowired
    PSCourseRepository coursesRepository;
    @Autowired
    PersonalScheduleRepository personalScheduleRepository;
    @Autowired
    UCSBCurriculumService ucsbCurriculumService;
    @Autowired
    ObjectMapper mapper;

    @ApiOperation(value = "List all courses (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public Iterable<PSCourse> allUsersCourses() {
        Iterable<PSCourse> courses = coursesRepository.findAll();
        return courses;
    }

    @ApiOperation(value = "List all courses (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user/all")
    public Iterable<PSCourse> thisUsersCourses() {
        CurrentUser currentUser = getCurrentUser();
        Iterable<PSCourse> courses = coursesRepository.findAllByUserId(currentUser.getUser().getId());
        return courses;
    }

    @ApiOperation(value = "List all courses for a specified psId (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/psid/all")
    public Iterable<PSCourse> allCoursesForPsId(
            @ApiParam("psId") @RequestParam Long psId) {
        Iterable<PSCourse> courses = coursesRepository.findAllByPsId(psId);
        return courses;
    }

    @ApiOperation(value = "List all courses for a specified psId (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user/psid/all")
    public Iterable<PSCourse> thisUsersCoursesForPsId(
            @ApiParam("psId") @RequestParam Long psId) {
        User currentUser = getCurrentUser().getUser();
        Iterable<PSCourse> courses = coursesRepository.findAllByPsIdAndUser(psId, currentUser);
        return courses;
    }

    @ApiOperation(value = "Get a single course (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public PSCourse getCourseById_admin(
            @ApiParam("id") @RequestParam Long id) {
        PSCourse courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

        return courses;
    }

    @ApiOperation(value = "Get a single course (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user")
    public PSCourse getCourseById(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        PSCourse courses = coursesRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

        return courses;
    }


    @ApiOperation(value = "Create a new course")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public ArrayList<PSCourse> postCourses(
            @ApiParam("enrollCd") @RequestParam String enrollCd,
            @ApiParam("psId") @RequestParam Long psId) throws JsonProcessingException {
        CurrentUser currentUser = getCurrentUser();
        log.info("currentUser={}", currentUser);

        PersonalSchedule checkPsId = personalScheduleRepository.findByIdAndUser(psId, currentUser.getUser())
        .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, psId));

        String body = ucsbCurriculumService.getAllSections(enrollCd, checkPsId.getQuarter());
        if(body.equals("{\"error\": \"401: Unauthorized\"}") || body.equals("{\"error\": \"Enroll code doesn't exist in that quarter.\"}")){
            throw new BadEnrollCdException(enrollCd);
        }

        String enrollCdPrimary = null;
        boolean hasSecondary = false;
        Iterator<JsonNode> allSections = mapper.readTree(body).path("classSections").elements();
        while (allSections.hasNext()) {
            JsonNode node = allSections.next();
            String section = node.path("section").asText();
            if (section.endsWith("00")) {
                enrollCdPrimary = node.path("enrollCode").asText();
            }
            else {
                hasSecondary = true;
                break;
            }
        }

        if (enrollCdPrimary == null) {
            enrollCdPrimary = enrollCd;
            hasSecondary = false;
        }

        if (enrollCdPrimary.equals(enrollCd) && hasSecondary) {
            throw new IllegalArgumentException(enrollCd + " is for a course with sections; please add a specific section and the lecture will be automatically added");
        }

        ArrayList<PSCourse> savedCourses = new ArrayList<>();

        PSCourse primary = new PSCourse();
        primary.setUser(currentUser.getUser());
        primary.setEnrollCd(enrollCdPrimary);
        primary.setPsId(psId);
        PSCourse saved = coursesRepository.save(primary);
        savedCourses.add(saved);

        if (hasSecondary) {
            PSCourse secondary = new PSCourse();
            secondary.setUser(currentUser.getUser());
            secondary.setEnrollCd(enrollCd);
            secondary.setPsId(psId);
            saved = coursesRepository.save(secondary);
            savedCourses.add(saved);
        }

        return savedCourses;
    }

    @ApiOperation(value = "Delete a course (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deleteCourses_Admin(
            @ApiParam("id") @RequestParam Long id) {
              PSCourse courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

          coursesRepository.delete(courses);

        return genericMessage("PSCourse with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Delete a course (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/user")
    public Object deleteCourses(
            @ApiParam("id") @RequestParam Long id) throws JsonProcessingException {
        User currentUser = getCurrentUser().getUser();
        PSCourse course = coursesRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));
          String enrollmentCode = course.getEnrollCd();

          PersonalSchedule checkPsId = personalScheduleRepository.findByIdAndUser(course.getPsId(), currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, course.getPsId()));
  
          String body = ucsbCurriculumService.getAllSections(enrollmentCode, checkPsId.getQuarter());
  
          Long primaryId = id;
          Long secondaryId = id;
          String primaryCode = null;
          boolean hasSecondary = false;
          Iterator<JsonNode> allSections = mapper.readTree(body).path("classSections").elements();
          while (allSections.hasNext()) {
              JsonNode node = allSections.next();
              String section = node.path("section").asText();
              if (section.endsWith("00")) {
                  primaryCode = node.path("enrollCode").asText();
                  Iterable<PSCourse> userCourses = thisUsersCoursesForPsId(course.getPsId());
                  for (PSCourse psc: userCourses) {
                      if (psc.getEnrollCd().equals(primaryCode)) {
                          primaryId = psc.getId();
                      }
                  }
              }
              else {
                  hasSecondary = true;
                  break;
              }
          }
          String output = "";
          if (!hasSecondary) { 
              coursesRepository.delete(course);
              return genericMessage("PSCourse with id %s deleted".formatted(id));
          }
          PSCourse primaryCourse = coursesRepository.findById(primaryId).get();
          coursesRepository.delete(primaryCourse);
          if (enrollmentCode.equals(primaryCode)) {
              Iterator<JsonNode> allSections2 = mapper.readTree(body).path("classSections").elements();
              Iterable<PSCourse> currentCourses = thisUsersCoursesForPsId(course.getPsId());
              boolean done = false;
              while (!done) {
                JsonNode node2 = allSections2.next();
                String sectionCodes = node2.path("enrollCode").asText();
                if (!sectionCodes.equals(primaryCode)){
                    for (PSCourse psc: currentCourses) {
                        if (psc.getEnrollCd().equals(sectionCodes)) {
                            secondaryId = psc.getId();
                            done = true;
                        }
                    }
                }
              }
              output = "PSCourse with id %s and matching secondary with id %s deleted".formatted(primaryId, secondaryId);
          } else {
            output = "PSCourse with id %s and matching primary with id %s deleted".formatted(secondaryId, primaryId);
          }
        PSCourse secondaryCourse = coursesRepository.findById(secondaryId).get();
        coursesRepository.delete(secondaryCourse);
        return genericMessage(output);
    }

    @ApiOperation(value = "Update a single Course (admin)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public PSCourse putCourseById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PSCourse incomingCourses) {
              PSCourse courses = coursesRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

          courses.setEnrollCd(incomingCourses.getEnrollCd());
          courses.setPsId(incomingCourses.getPsId());

        coursesRepository.save(courses);

        return courses;
    }

    @ApiOperation(value = "Update a single course (user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/user")
    public PSCourse putCoursesById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PSCourse incomingCourses) {
        User currentUser = getCurrentUser().getUser();
        PSCourse courses = coursesRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PSCourse.class, id));

        courses.setEnrollCd(incomingCourses.getEnrollCd());
        courses.setPsId(incomingCourses.getPsId());

        coursesRepository.save(courses);

        return courses;
    }
}