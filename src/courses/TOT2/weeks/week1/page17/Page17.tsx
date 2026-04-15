import React from "react";
import { useSelector } from "react-redux";
import VideoComponent from "../../../components/Video";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";

const Page17 = () => {
  const pageData = useSelector(selectPageData);

  return (
    <>
      <VideoComponent videoSrc={pageData.videoSrc} />
      <div className="d-flex justify-content-center mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" />
      </div>
    </>
  );
};

export default Page17;
