import React, { useEffect, useRef, useState } from "react";
import "./accordion.css";
import { Icon } from "@iconify/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ClimbingBoxLoader } from "react-spinners";
import { mapSelectedOptions } from "../weeks/week6/Week6";
import pdfTemplate from "@/assets/tot-images/pdf/template.pdf";
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/api/user";
import adminService from "@/services/api/admin";
import { adminData } from "@/store/adminReducer";
import { useSelector } from "react-redux";

function Accordion({
  activeIndex,
  setActiveIndex,
  items,
  allDataLoaded,
  hasPercentile,
  setHasPercentile,
  enrollmentId,
}) {
  const contentRef = useRef();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [startDownload, setStartDownload] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isAdmin, code } = useSelector(adminData);

  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    if (!startDownload) return;

    // download pdf, based on index, we will just check if the index is the one we want to downlaod, and serve the pdf we want, then return

    // Worksheet
    if (currentIndex === 6) {
      console.log("downloading Worksheet pdf");
      generateWorkSheetPDF(answers);

      return;
    }

    // Final course PDF (index 7)
    if (currentIndex === 7) {
      const originalState = activeIndex;
      setPdfLoading(true);
      setActiveIndex(null);

      if (!hasPercentile) {
        setActiveIndex(originalState);
        setPdfLoading(false);
        return;
      }
      console.log("downloading course pdf");

      const link = document.createElement("a");
      link.href = "/Teacher Resources.pdf";
      link.download = "Teacher Resources.pdf";
      link.click();

      setStartDownload(false);
      setActiveIndex("");
      setHasPercentile(false);
      setPdfLoading(false);

      return;
    }
    generatePDF();
  }, [hasPercentile, allDataLoaded, startDownload, currentIndex]);
  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/tot-feedback-6", enrollmentId, 6],
    queryFn: () =>
      isAdmin
        ? adminService.getUserCourseData(enrollmentId, 6, code)
        : userService.getUserCourseData(enrollmentId, 6),
    enabled: !!enrollmentId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });
  const handleToggle = (index) => {
    window.scroll(0, 0);
    setActiveIndex(activeIndex === index ? "" : index);
  };

  useEffect(() => {
    if (
      data &&
      data.activity &&
      Array.isArray(data.activity.activities) &&
      data.activity.activities[4] &&
      data.activity.activities[4].answer !== undefined &&
      data.activity.activities[4].answer !== null
    ) {
      setAnswers(data.activity.activities[4].answer);
    }

    return () => {};
  }, [data]);

  if (isPending) {
    // setWorksheetComponent("<div>Loading...</div>");
  }
  if (data?.status === "failed" || isError) {
    // alert(`${data?.message} || "Internal server error!"`);
  }
  const FIELD_COORDINATES = {
    page2: { x: 40, y: 501, page: 3 },
    page3: { x: 40, y: 502, page: 4 },
    page4checkbox: { x: 41, y: 563, page: 5 },
    page4Others: { x: 40, y: 259, page: 5 },
    page4integrationplan: { x: 40, y: 115, page: 5 },
    page5: { x: 40, y: 501, page: 6 },
    page6: { x: 40, y: 501, page: 7 },
    page7input1: { x: 58, y: 477, page: 8 },
    page7input2: { x: 58, y: 456, page: 8 },
    page7collboaration: { x: 40, y: 167, page: 8 },
    page8: { x: 40, y: 500, page: 9 },
  };

  const CHECKBOX_COORDINATES = {
    "morning-check-ins": { page: 5, x: 41, y: 552, size: 16 },
    "emotional-vocabulary-in-lessons": { page: 5, x: 41, y: 524, size: 16 },
    "gratitude-journals": { page: 5, x: 41, y: 496, size: 16 },
    relationship_skills: { page: 5, x: 252, y: 453, size: 16 },
    breathing_or_grounding_exercises: { page: 5, x: 41, y: 449, size: 16 },
    weekly_class_meetings: { page: 5, x: 41, y: 421, size: 16 },
    "praise_for_effort,_not_just_results": { page: 5, x: 41, y: 393, size: 16 },
    growth_mindset_reflections: { page: 5, x: 254, y: 552, size: 16 },
    cooperative_learning_tasks: { page: 5, x: 254, y: 523, size: 16 },
    "storytelling_or-character_analysis": { page: 5, x: 252, y: 496, size: 16 },
  };

  const pageField = {
    step_3: {
      coords: FIELD_COORDINATES.page2,
      textFields: [{ key: "mainInput" }],
    },
    step_4: {
      coords: FIELD_COORDINATES.page3,
      textFields: [{ key: "mainInput" }],
    },
    step_5: {
      coordsOthers: FIELD_COORDINATES.page4Others,
      coordsPlan: FIELD_COORDINATES.page4integrationplan,
      coordsCheckbox: FIELD_COORDINATES.page4checkbox,
      textFields: [
        { key: "others_", coordKey: "coordsOthers" },
        {
          key: "my_integration_plan__brief_description__",
          coordKey: "coordsPlan",
        },
      ],
    },
    step_6: {
      coords: FIELD_COORDINATES.page5,
      textFields: [{ key: "mainInput" }],
    },
    step_7: {
      coords: FIELD_COORDINATES.page6,
      textFields: [{ key: "mainInput" }],
    },
    step_8: {
      coords1: FIELD_COORDINATES.page7input1,
      coords2: FIELD_COORDINATES.page7input2,
      coords3: FIELD_COORDINATES.page7collboaration,
      textFields: [
        { key: "input1", coordKey: "coords1" },
        { key: "input2", coordKey: "coords2" },
        { key: "collaboration", coordKey: "coords3" },
      ],
    },
    step_9: {
      coords: FIELD_COORDINATES.page8,
      textFields: [{ key: "mainInput" }],
    },
  };

  // Helper function to wrap text into multiple lines
  function wrapText(text, font, fontSize, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [""];
  }

  async function generateWorkSheetPDF(answers) {
    if (data?.status === "failed" || isError) {
      alert(`${data?.message} || "Internal server error!"`);
    }
    if (!answers) return;

    try {
      const link = document.createElement("a");
      link.href = pdfTemplate;
      link.download = "SEL Worksheet.pdf";
      link.click();
      setStartDownload(false);
      setPdfLoading(false);
    } catch (error) {
      console.error("Error generating worksheet PDF:", error);
      setStartDownload(false);
      alert("Failed to generate PDF. Please try again.");
    }
  }

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

          pdf.save("ToT_1_Feedback.pdf");
          setActiveIndex("");
          setPdfLoading(false);
          setHasPercentile(false);
        });
      }, 1000);
    }
  };

  return (
    <>
      {pdfLoading && ( // SHOW LOADER WHEN PDF IS LOADING
        <div className="loader-overlay">
          <ClimbingBoxLoader color="#275DAD" />
        </div>
      )}
      <div className="accordion" ref={contentRef}>
        <h2 className="accordion-header p-lg-2 p-md-4 bg-blue text-center text-white">
          Feedback for ToT Course 1
        </h2>

        {items.map((item, index) => (
          <div key={index} className="accordion-item">
            <div
              className={`py-4 px-5 d-flex gap-3 align-items-center justify-space-between
py-4 px-5 d-flex gap-3 align-items-center justify-space-between ${
                index > 7 ? "bg-blue-feedback" : ""
              }`}
            >
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                {index < 6 ? (
                  <p
                    className="text-gray text-nowrap fw-bold"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    Week {index + 1}:
                  </p>
                ) : index >= 6 && index < 7 ? (
                  <p
                    className="text-gray text-nowrap fw-bold"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    Summary
                  </p>
                ) : (
                  <p
                    className="text-gray fw-bold"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    Final Report:
                  </p>
                )}
                <div
                  className="text-gray "
                  onClick={() => handleToggle(index)}
                  style={{ cursor: "pointer" }}
                >
                  {item.title}
                </div>
                {index >= 6 && (
                  <p
                    className="text-blue"
                    style={{ zIndex: 100, cursor: "pointer" }}
                    onClick={() => {
                      handleToggle(index);
                      setCurrentIndex(index);
                      setStartDownload(true);
                    }}
                  >
                    {pdfLoading ? "Generating PDF..." : "(Download PDF)"}{" "}
                    <Icon icon="bi:download" />
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
                <div>{item.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Accordion;
