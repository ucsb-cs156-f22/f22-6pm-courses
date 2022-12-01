import React from "react";

import UpdateCoursesOneQuarterJobForm from "main/components/Jobs/UpdateCoursesOneQuarterJobForm";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Jobs/UpdateCoursesOneQuarterJobForm",
  component: UpdateCoursesOneQuarterJobForm,
  parameters: {
    mockData: [
      {
        url: '/api/UCSBSubjects/all',
        method: 'GET',
        status: 200,
        response: ucsbSubjectsFixtures.threeSubjects
      },
      {
        url: '/api/systemInfo',
        method: 'GET',
        status: 200,
        response: systemInfoFixtures.showingBoth
      },
    ],
  },
};

const Template = (args) => {
  return <UpdateCoursesOneQuarterJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    console.log("Submit was clicked, data=", data);
  }
};
