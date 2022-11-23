import React from "react";

import CourseSearchOverTime from "main/components/BasicCourseSearch/CourseSearchOverTime";

export default {
    title: "components/BasicCourseSearch/CourseSearchOverTime",
    component: CourseSearchOverTime,
};

const Template = (args) => {
    return <CourseSearchOverTime {...args} />;
};

export const Default = Template.bind({});

