import { _compareValues } from "main/utils/sortHelper";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

const SinglePersonalScheduleDropdown = ({
  personalSchedules,
  personalSchedule,
  setPersonalSchedule,
  controlId,
  onChange = null,
  label = "Personal Schedule",
}) => {
  const localSearchPersonalSchedule = localStorage.getItem(controlId);

  const [personalScheduleState, setPersonalScheduleState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchPersonalSchedule || personalSchedule
  );

  const handlePersonalScheduleOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setPersonalScheduleState(event.target.value);
    setPersonalSchedule(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={personalScheduleState}
        onChange={handlePersonalScheduleOnChange}
      >
        {personalSchedules.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object.id}>
              {yyyyqToQyy(object.quarter)} - {object.name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SinglePersonalScheduleDropdown;
