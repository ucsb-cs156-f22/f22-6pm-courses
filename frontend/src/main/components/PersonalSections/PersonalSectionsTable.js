import React from "react";
import OurTable from "main/components/OurTable";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSection } from "main/utils/sectionUtils.js";

export default function PersonalSectionsTable({ personalSections }) {
    
    // Stryker enable all 

    const columns = [
        {
            Header: 'Course ID',
            accessor: 'courseId', // accessor is the "key" in the data

            //Cell: ({ cell: { value } }) => value.substring(0, value.length-2) 
        },
        {
            Header: 'Enroll Code',
            accessor: 'classSections.enrollCode', 
            disableGroupBy: true,

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
            Header: 'Is Section?',
            accessor: (row) => isSection(row.classSections.section),
            // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
            id: 'isSection',
        },
        {
            Header: 'Title',
            accessor: 'title',
            disableGroupBy: true,

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.classSections.enrolledTotal, row.classSections.maxEnroll),
            disableGroupBy: true,
            id: 'enrolled',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Location',
            accessor: (row) => formatLocation(row.classSections.timeLocations),
            disableGroupBy: true,
            id: 'location',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Days',
            accessor: (row) => formatDays(row.classSections.timeLocations),
            disableGroupBy: true,
            id: 'days',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Time',
            accessor: (row) => formatTime(row.classSections.timeLocations),
            disableGroupBy: true,
            id: 'time',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Instructor',
            accessor: (row) => formatInstructors(row.classSections.instructors),
            disableGroupBy: true,
            id: 'instructor',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
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