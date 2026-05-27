import React, { useEffect, useRef, useState } from "react";
import "./accordion.css";
import { Icon } from "@iconify/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ClimbingBoxLoader } from "react-spinners";

function Accordion({
  activeIndex,
  setActiveIndex,
  items,
  allDataLoaded,
  hasPercentile,
  setHasPercentile,
}) {
  const contentRef = useRef();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [startDownload, setStartDownload] = useState(false);

  const handleToggle = (index) => {
    window.scroll(0, 0);
    setActiveIndex(activeIndex === index ? "" : index);
  };

  useEffect(() => {
    if (!startDownload) return;
    generatePDF();
  }, [hasPercentile, allDataLoaded]);

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

          pdf.save("CompassionFeedback.pdf");
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
          Feedback for Compassion
        </h2>

        {items.map((item, index) => (
          <div key={index} className="accordion-item">
            <div
              className={
                index > 9
                  ? "bg-blue-feedback  py-4 px-5 d-flex gap-3 align-items-center justify-space-between"
                  : "py-4 px-5 d-flex gap-3 align-items-center justify-space-between"
              }
            >
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                {index < 10 ? (
                  <h2
                    className="text-gray text-nowrap"
                    onClick={() => handleToggle(index)}
                    style={{ cursor: "pointer" }}
                  >
                    Week {index + 1}:
                  </h2>
                ) : (
                  <h2
                    className="text-gray"
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
                {index === 10 && (
                  <p
                    className="text-blue"
                    style={{ zIndex: 100, cursor: "pointer" }}
                    onClick={() => {
                      handleToggle(index);
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
