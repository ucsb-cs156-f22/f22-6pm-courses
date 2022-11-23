import React from "react";
import OurTable from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/PersonalSectionUtils"
import { useNavigate } from "react-router-dom";

export default function PersonalSectionsTable({ personalSections, showButtons=true }) {
    
    // Stryker enable all 

    const columns = [
        {
            Header: 'Course ID',
            accessor: 'courseId', // accessor is the "key" in the data
        },
        
        {
            Header: 'Enroll Code',
            accessor: 'enrollCd',
        },
        {
            Header: 'Section',
            accessor: 'section',
        },
        {
            Header: 'Title',
            id: 'title',
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
            disableGroupBy: true,
            id: 'enrolled',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Location',
            id: 'location',
        },
        {
            Header: 'Days',
            id: 'days',
        },
        {
            Header: 'Time',
            id: 'time',
        },
        {
            Header: 'Instructor',
            id: 'instructor',
        },
    ];

    const buttonColumns = [
        ...columns,
    ]

    // const columnsToDisplay = showButtons ? buttonColumns : columns;
    const columnsToDisplay = buttonColumns;

    return <OurTable
        data={personalSections}
        columns={columnsToDisplay}
        testid={"PersonalSectionsTable"}
    />;
};