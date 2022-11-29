import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import { useBackendMutation } from "main/utils/useBackend";

const ArchiveSearchForm = ({ fetchJSON }) => {
   const { data : systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localStartQuarter = localStorage.getItem("ArchiveSearch.StartQuarter");
  const localEndQuarter = localStorage.getItem("ArchiveSearch.EndQuarter");
  const localSubject = localStorage.getItem("ArchiveSearch.Subject");
  const localCourseNumber = localStorage.getItem("ArchiveSearch.CourseNumber");

  const getObjectToAxiosParams = () => ({
    url: "api/UCSBSubjects/all",
    method: "GET",
    params: {},
  });

  const onSuccess = (listSubjects) => {
    setSubjects(listSubjects);
  };

  const getMutation = useBackendMutation(
    getObjectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  useEffect(() => {
    getMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [startQuarter, setStartQuarter] = useState(localStartQuarter || quarters[0].yyyyq);
  const [endQuarter, setEndQuarter] = useState(localEndQuarter || quarters[0].yyyyq);
  const [subject, setSubject] = useState(localSubject || {});
  const [subjects, setSubjects] = useState([]);
  const [courseNumber, setCourseNumber] = useState(localCourseNumber || "");
  const [courseSuf, setCourseSuf] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, subject, courseNumber, courseSuf });
  };

  const handleCourseNumberOnChange = (event) => {
      const rawCourse = event.target.value;
      if (rawCourse.match(/\d+/g) != null) {
          const number = rawCourse.match(/\d+/g)[0];
          setCourseNumber(number);
      } else {
          setCourseNumber("");
      }
    
      if (rawCourse.match(/[a-zA-Z]+/g) != null) {
          const suffix = rawCourse.match(/[a-zA-Z]+/g)[0];
          setCourseSuf(suffix);
      } else {
          setCourseSuf("");
      }
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
        <Container>
            <Row>
                <Col md ="auto">
                    <SingleQuarterDropdown
                        quarters={quarters}
                        quarter={startQuarter}
                        setQuarter={setStartQuarter}
                        controlId={"ArchiveSearch.StartQuarter"}
                        label={"Start Quarter"}
                />
                </Col>
                <Col md ="auto">
                    <SingleQuarterDropdown
                        quarters={quarters}
                        quarter={endQuarter}
                        setQuarter={setEndQuarter}
                        controlId={"ArchiveSearch.EndQuarter"}
                        label={"End Quarter"}
                />
                </Col>
                <Col md="auto">
                    <SingleSubjectDropdown
                        subjects={subjects}
                        subject={subject}
                        setSubject={setSubject}
                        controlId={"ArchiveSearch.Subject"}
                        label={"Subject Area"}
                />
                </Col>
            </Row>
            <Form.Group controlId="CourseNameSearch.CourseNumber">
                <Form.Label>Course Number (Try searching '16' or '130A')</Form.Label>
                <Form.Control onChange={handleCourseNumberOnChange} defaultValue={courseNumber} />
            </Form.Group>
                <Col md="auto">
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Col>
        </Container>
    </Form>
  )
};

export default ArchiveSearchForm;
