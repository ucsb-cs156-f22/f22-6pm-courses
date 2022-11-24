import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";

import SinglePersonalScheduleDropdown from "main/components/PersonalSchedules/SinglePersonalScheduleDropdown";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  compareValues: jest.fn(),
}));

describe("SinglePersonalScheduleDropdown tests", () => {

  beforeEach(() => {
    jest.spyOn(console, 'error')
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
 })

  const personalSchedule = jest.fn();
  const setPersonalSchedule = jest.fn();

  test("renders without crashing on one personal schedule", () => {
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalSchedulesFixtures.onePersonalScheduleArr}
        personalSchedule={personalSchedulesFixtures.onePersonalScheduleArr}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );
  });

  test("renders without crashing on three personal schedules", () => {
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );
  });

  test("when I select an object, the value changes", async () => {
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );
    
    expect(await screen.findByLabelText("Personal Schedule")).toBeInTheDocument();

    const selectQuarter = screen.getByLabelText("Personal Schedule");
    userEvent.selectOptions(selectQuarter, "1");
    expect(setPersonalSchedule).toBeCalledWith("1");
  });

//   test("out of order personal schedules is sorted by personal schedule id", async () => {
//     render(
//       <SinglePersonalScheduleDropdown
//         personalSchedules={// outOfOrderSubjects}
//         personalSchedule={personalSchedule}
//         setPersonalSchedule={setPersonalSchedule}
//         controlId="spsd1"
//       />
//     );

//     expect(await screen.findByText("Personal Schedule")).toBeInTheDocument();
//     expect(screen.getByText("// ANTH - Anthropology")).toHaveAttribute(
//       "data-testid",
//       "spsd1-option-0"
//     );
//   });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
        onChange={onChange}
      />
    );
    
    expect(await screen.findByLabelText("Personal Schedule")).toBeInTheDocument();

    const selectPersonalSchedule = screen.getByLabelText("Personal Schedule");
    userEvent.selectOptions(selectPersonalSchedule, "1");
    await waitFor(() => expect(setPersonalSchedule).toBeCalledWith("1"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("1");
  });

  test("default label is Personal Schedule", async () => {
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );
    
    expect(await screen.findByLabelText("Personal Schedule")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );

    const expectedKey = "spsd1-option-0";
    await waitFor(() => expect(screen.getByTestId(expectedKey).toBeInTheDocument));
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "1");

    const setPersonalScheduleStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setPersonalScheduleStateSpy]);

    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );

    await waitFor(() => expect(useState).toBeCalledWith("1"));
  });

  test("when localstorage has no value, first element of personal schedule list is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setPersonalScheduleStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setPersonalScheduleStateSpy]);

    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={personalScheduleFixtures.threePersonalSchedules}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );

    await waitFor(() =>
      expect(useState).toBeCalledWith(expect.objectContaining({}))
    );
  });

  test("When no personal schedules, dropdown is blank", async () => {
    render(
      <SinglePersonalScheduleDropdown
        personalSchedules={[]}
        personalSchedule={personalSchedule}
        setPersonalSchedule={setPersonalSchedule}
        controlId="spsd1"
      />
    );

    const expectedKey = "spsd1";
    expect(screen.queryByTestId(expectedKey)).toBeNull();
  });
});
