import React from "react";

import ArchiveSearchForm from "main/components/ArchiveSearch/ArchiveSearchForm";
import {allTheSubjects} from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
    title: "components/ArchiveSearch/ArchiveSearchForm",
    component: ArchiveSearchForm,
    parameters: {
        data: [
            {
                url: "/api/UCSBSubjects/all",
                method: "GET",
                status: '200',
                response: allTheSubjects
            },
            {
                url: "/api/systemInfo",
                method: "GET",
                status: '200',
                response: systemInfoFixtures.showingBothStartAndEndQtr
            },
        ]
    }
};

const Template = (args) => {
    return <ArchiveSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    fetchJSON: (_event, data) => {
      console.log("Submit was clicked, data=", data);
    }
  };
  