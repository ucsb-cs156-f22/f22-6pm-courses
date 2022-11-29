import {  _fireEvent, render, screen } from "@testing-library/react";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("PersonalSections tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable personalSections={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable personalSections={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable personalSections={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSectionsTable personalSections={personalSectionsFixtures.threePersonalSections} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Course ID", "Enroll Code", "Is Section?", "Title", "Enrolled", "Location", "Days", "Time", "Instructor"];
    const expectedFields = ["courseId", "classSections.enrollCode", "isSection", "title", "enrolled", "location", "days", "time", "instructor"];
    const testId = "PersonalSectionsTable";
    
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-courseId`)).toHaveTextContent("ECE 1A -1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-classSections.enrollCode`)).toHaveTextContent("12583");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("COMP ENGR SEMINAR");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-isSection`)).toHaveTextContent("true");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-enrolled`)).toHaveTextContent("102/125");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-days`)).toHaveTextContent("M W F");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-location`)).toHaveTextContent("LSB 1001");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-time`)).toHaveTextContent("12:00 PM - 12:50 PM");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-instructor`)).toHaveTextContent("LIN Q");

  });

});

