import React from "react";
import { useSelector } from "react-redux";
import VideoComponent from "../../../components/Video";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";

const Page11 = () => {
  const pageData = useSelector(selectPageData);

  return (
    <>
      <VideoComponent videoSrc={pageData.videoSrc} />
      <div className="d-flex justify-content-center mt-4 gap-96px gap-4">
        <Button text="Prev" />
        <Button text="Next" />
      </div>
    </>
  );
};

export default Page11;
