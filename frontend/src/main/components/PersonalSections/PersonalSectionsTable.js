import React from "react";
import OurTable from "main/components/OurTable";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSection } from "main/utils/sectionUtils.js";

export default function PersonalSectionsTable({ personalSections }) {
    
    //personalSections is an array of Course objects
    
    // Stryker enable all 

    const columns = [
        {
            Header: 'Course ID',
            accessor: 'courseId', // accessor is the "key" in the data
        },
        {
            Header: 'Enroll Code',
            accessor: 'classSections.enrollCode',
        },
        {
            Header: 'Is Section?',
            accessor: (row) => String(isSection(row.classSections.section)),
            id: 'isSection',
        },
        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.classSections.enrolledTotal, row.classSections.maxEnroll),
            id: 'enrolled',
        },
        {
            Header: 'Location',
            accessor: (row) => formatLocation(row.classSections.timeLocations),
            id: 'location',
        },
        {
            Header: 'Days',
            accessor: (row) => formatDays(row.classSections.timeLocations),
            id: 'days',
        },
        {
            Header: 'Time',
            accessor: (row) => formatTime(row.classSections.timeLocations),
            id: 'time',
        },
        {
            Header: 'Instructor',
            accessor: (row) => formatInstructors(row.classSections.instructors),
            id: 'instructor',
        },
    ];

    const testId = "PersonalSectionsTable";

    // add onto buttonColumns
    const buttonColumns = [
        ...columns,
    ]

    const columnsToDisplay = buttonColumns;

    return <OurTable
        data={personalSections}
        columns={columnsToDisplay}
        testid={testId}
    />;
};