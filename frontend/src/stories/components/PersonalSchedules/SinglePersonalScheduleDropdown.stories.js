import React, { useState } from 'react';

import SinglePersonalScheduleDropdown from "main/components/PersonalSchedules/SinglePersonalScheduleDropdown";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
// import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";


export default {
    title: 'components/PersonalSchedules/SinglePersonalScheduleDropdown',
    component: SinglePersonalScheduleDropdown
};

const Template = (args) => {
    const [personalSchedules, setPersonalSchedule] = useState(args.personalSchedules[0]);

    return (
        < SinglePersonalScheduleDropdown 
        personalSchedules={personalSchedules} 
        setPersonalSchedule={setPersonalSchedule} 
        controlId={"SampleControlId"}
        label={"Personal Schedule"} 
        {...args} />
    )
};

// export const OnePersonalSchedule = Template.bind({});
// OnePersonalSchedule.args = {
//     personalSchedules: personalSchedulesFixtures.onePersonalSchedule
// };

export const ThreePersonalSchedules = Template.bind({});
ThreePersonalSchedules.args = {
    personalSchedules: personalScheduleFixtures.threePersonalSchedules
};

// export const TwoPersonalSchedules = Template.bind({});
// TwoPersonalSchedules.args = {
//     personalSchedules: personalSchedulesFixtures.twoPersonalSchedules
// };

