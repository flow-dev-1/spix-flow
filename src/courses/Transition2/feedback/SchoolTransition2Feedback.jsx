import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Transition2Feedback from "./index";
import { decryptId } from "../../../../../../utils/encryption";

const SchoolTransition2Feedback = () => {
    const { userId } = useParams();
    const location = useLocation();
    const { enrollmentData } = location.state || {};

    const studentId = decryptId(userId);

    return (
        <Transition2Feedback
            isSchool={true}
            studentId={studentId}
            enrollmentData={enrollmentData}
        />
    );
};

export default SchoolTransition2Feedback;
