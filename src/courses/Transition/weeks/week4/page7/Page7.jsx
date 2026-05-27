import React from "react";
import { useSelector } from "react-redux";
import VideoComponent from "../../../components/Video";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";
import { useDispatch } from "react-redux";

import {
  selectCurrentStep,
  selectCurrentWeek,
  setCurrentPage,
  showReviewPopup,
} from "@/store/navigationSlice";

function WeekFourPage7() {
  const pageData = useSelector(selectPageData);
  const dispatch = useDispatch();

  return (
    <>
      <VideoComponent videoSrc={pageData.videoSrc} />
      <div className="d-flex justify-content-center gap-96px mt-4 w-1029px gap-4">
        <Button text="Prev" />
        <Button text="Next" />
      </div>
    </>
  );
}

export default WeekFourPage7;
