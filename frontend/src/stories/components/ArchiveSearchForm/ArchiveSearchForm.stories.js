import React from "react";

import ArchiveSearchForm from "main/components/ArchiveSearch/ArchiveSearchForm";

export default {
    title: "components/ArchiveSearch/ArchiveSearchForm",
    component: ArchiveSearchForm,
};

const Template = (args) => {
    return <ArchiveSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => {
        console.log("Submit was clicked");
    },
}
