import React, { useEffect, useRef, useState } from "react";
import "./accordion.css";
import { Icon } from "@iconify/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ClimbingBoxLoader } from "react-spinners";
import { useQueries } from "@tanstack/react-query";
import userService from "@/services/api/user";
import adminService from "@/services/api/admin";
import { adminData } from "@/store/adminReducer";
import { useSelector } from "react-redux";
import VisionBoard from "../VisionBoard.jsx";

function Accordion({
  activeIndex,
  setActiveIndex,
  items,
  allDataLoaded,
  hasPercentile,
  setHasPercentile,
  enrollmentId,
}) {
  const pdfRef = useRef(null);

  const contentRef = useRef();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [startDownload, setStartDownload] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(null);
  const { isAdmin, code } = useSelector(adminData);

  useEffect(() => {
    if (!startDownload) return;

    // download pdf, based on index, we will just check if the index is the one we want to downlaod, and serve the pdf we want, then return

    // Vision Board
    if (currentIndex === 5) {
      if (!allDataLoaded) {
        setStartDownload(false);
        return;
      }

      if (!pdfRef.current) return;

      setPdfLoading(true);

      html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Extra Page Incase
        while (heightLeft > 1) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("Vision-Board.pdf");

        setPdfLoading(false);
        setStartDownload(false);
      });

      return;
    }

    // Final course PDF (index 6)
    if (currentIndex === 6) {
      generatePDF();

      return;
    }
  }, [hasPercentile, allDataLoaded, startDownload, currentIndex]);

  const generatePDF = async () => {
    const originalState = activeIndex;
    setPdfLoading(true);
    setActiveIndex(null);

    if (!hasPercentile) {
      setActiveIndex(originalState);
      setPdfLoading(false);
      return;
    }

    if (allDataLoaded) {
      setTimeout(() => {
        const input = contentRef.current;

        html2canvas(input).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save("Transition2Feedback.pdf");
          setActiveIndex("");
          setPdfLoading(false);
          setHasPercentile(false);
        });
      }, 1000);
    }
  };

  // toDo: Fetch User assessment and Activity Data for week and 2
  const [first, second] = useQueries({
    queries: [1, 2].map((step) => ({
      queryKey: ["dashboard/transition2-feedback", enrollmentId, step],
      queryFn: () =>
        isAdmin
          ? adminService.getUserCourseData(enrollmentId, step, code)
          : userService.getUserCourseData(enrollmentId, step),
      enabled: !!enrollmentId,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      keepPreviousData: false,
    })),
  });

  const handleToggle = (index) => {
    window.scroll(0, 0);
    setActiveIndex(activeIndex === index ? "" : index);
  };

  useEffect(() => {
    if (!first?.data && !second?.data) return;

    const week1Activities = first?.data?.activity?.activities || [];
    const week2Activities = second?.data?.activity?.activities || [];

    const findActivityAnswer = (activities, pageIds, predicate) => {
      const byPageId = activities.find((activity) =>
        pageIds.includes(Number(activity.page))
      )?.answer;

      if (byPageId) return byPageId;

      return activities.find((activity) => predicate?.(activity.answer))?.answer ?? null;
    };

    const week1FutureSelfAnswer = findActivityAnswer(
      week1Activities,
      [8],
      (answer) => answer?.checkboxAnswers
    );
    const week1VisionAnswer = findActivityAnswer(
      week1Activities,
      [10],
      (answer) => answer?.textAnswer || answer?.sentenceAnswer
    );
    const week2ValuesAnswer = findActivityAnswer(
      week2Activities,
      [12],
      (answer) => answer?.rankValues || answer?.selectedValues
    );

    setAnswers({
      week1FutureSelf: week1FutureSelfAnswer,
      week1Vision: week1VisionAnswer,
      week2Values: week2ValuesAnswer,
    });
  }, [first?.data, second?.data]);

  if (first.isPending || second.isPending) {
    // setWorksheetComponent("<div>Loading...</div>");
  }
  if (first?.status === "failed" || first.isError) {
    // alert(`${data?.message} || "Internal server error!"`);
  }

  return (
    <>
      {pdfLoading && ( // SHOW LOADER WHEN PDF IS LOADING
        <div className="loader-overlay">
          <ClimbingBoxLoader color="#275DAD" />
        </div>
      )}
      <div className="accordion" ref={contentRef}>
        <h2 className="accordion-header p-lg-2 p-md-4 bg-blue text-center text-white mt-2">
          Feedback for Transition 2
        </h2>

        {items.map((item, index) => (
          <div key={index} className="accordion-item">
            <div
              className={`py-4 px-5 d-flex gap-3 align-items-center justify-space-between
py-4 px-5 d-flex gap-3 align-items-center justify-space-between ${
                index > 5 ? "bg-blue-feedback" : ""
              }`}
            >
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                {index < 5 ? (
                  <h2
                    className="text-gray text-nowrap fw-bold"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    Week {index + 1}:
                  </h2>
                ) : index >= 5 && index < 6 ? (
                  <h2
                    className="text-gray text-nowrap fw-bold"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    My Vision Board
                  </h2>
                ) : (
                  <h2
                    className="text-gray fw-bold"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    Final Report:
                  </h2>
                )}
                <div
                  className="text-gray "
                  onClick={() => handleToggle(index)}
                  style={{ cursor: "pointer" }}
                >
                  {item.title}
                </div>
                {index >= 5 && (
                  <p
                    className={index === 5 && !allDataLoaded ? "text-gray" : "text-blue"}
                    style={{
                      zIndex: 100,
                      cursor: index === 5 && !allDataLoaded ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (index === 5 && !allDataLoaded) return;
                      handleToggle(index);
                      setCurrentIndex(index);
                      setStartDownload(true);
                    }}
                  >
                    {index === 5 && !allDataLoaded
                      ? "(Complete all 5 weeks to download)"
                      : pdfLoading
                        ? "Generating PDF..."
                        : "(Download PDF)"}{" "}
                    {!(index === 5 && !allDataLoaded) && (
                      <Icon icon="bi:download" />
                    )}
                  </p>
                )}
              </div>
              <Icon
                onClick={() => handleToggle(index)}
                icon={
                  activeIndex === index
                    ? "simple-line-icons:arrow-up"
                    : "simple-line-icons:arrow-down"
                }
                style={{ cursor: "pointer" }}
              />
            </div>
            {(activeIndex === index || activeIndex === null) && (
              <div className="accordion-content">
                <div>{index === 5 ? <VisionBoard answers={answers} /> : item.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "794px",
        }}
      >
        <VisionBoard answers={answers} />
      </div>
    </>
  );
}

export default Accordion;
