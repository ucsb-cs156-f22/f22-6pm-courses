import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PersonalSchedulesCreatePage from "main/pages/PersonalSchedules/PersonalSchedulesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("PersonalSchedulesCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const personalSchedule = {
            id: 17,
            name: "SampName",
            description: "desc",
            quarter: "W08"
        };

        axiosMock.onPost("/api/personalschedules/post").reply( 202, personalSchedule );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("PersonalScheduleForm-name")).toBeInTheDocument();
        
        const nameField = screen.getByTestId("PersonalScheduleForm-name");
        const descriptionField = screen.getByTestId("PersonalScheduleForm-description");
        //const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
        const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
        //const selectQuarter = getByLabelText("Quarter")
        const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

        fireEvent.change(nameField, { target: { value: 'SampName' } });
        fireEvent.change(descriptionField, { target: { value: 'desc' } });
        fireEvent.change(quarterField, { target: { value: '20124' } });
        //userEvent.selectOptions(selectQuarter, "20124");

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(quarterField).toHaveValue("20124");
        //expect(setQuarter).toBeCalledWith("20124"); //need this and axiosMock below?

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "SampName",
            "description": "desc",
            "quarter": "20124"
        });

        expect(mockToast).toBeCalledWith("New personalSchedule Created - id: 17 name: SampName");
        expect(mockNavigate).toBeCalledWith({ "to": "/personalschedules/list" });
    });

    test("when you try to store a personal schedule that the pair of name and quarter is not unique, you get a error message and a chance to fix it", async () => {

        const queryClient = new QueryClient();
        const expectedError = {
            message: "PersonalSchedule for ABC in W08 already exists"
        };
        axiosMock.onPost("/api/personalschedules/post").reply( 404, expectedError );


        // render the page
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // fill in the form
        expect(await screen.findByTestId("PersonalScheduleForm-name")).toBeInTheDocument();

        const nameField = screen.getByTestId("PersonalScheduleForm-name");
        const descriptionField = screen.getByTestId("PersonalScheduleForm-description");
        //const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
        const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
        //const selectQuarter = getByLabelText("Quarter")
        const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

        // fill in the form
        fireEvent.change(nameField, { target: { value: 'ABC' } });
        fireEvent.change(descriptionField, { target: { value: 'desc' } });
        fireEvent.change(quarterField, { target: { value: '20124' } });
        //userEvent.selectOptions(selectQuarter, "20124");

        // submit the form
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));//wait for the post request to be made

        expect(quarterField).toHaveValue("20124");
        //expect(setQuarter).toBeCalledWith("20124"); //need this and axiosMock below?

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "ABC",
                "description": "desc",
                "quarter": "20124"
            });

            expect(mockToast).toBeCalledWith("Axios Error: Error: Request failed with status code 404");        
            expect(mockToast).toBeCalledWith("Axios Error: PersonalSchedule for ABC in W08 already exists");
    });

});
