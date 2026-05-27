import React, { useState, useEffect } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

import maroonCheckBg from "@/assets/maroonCheckBg.png";
import orangeCheckBg from "@/assets/orangeCheckBg.png";
import purpleCheckBg from "@/assets/purpleCheckBg.png";
import greenCheckBg from "@/assets/greenCheckBg.png";

import maroonModalBg from "@/assets/maroonModalBg.png";
import orangeModalBg from "@/assets/orangeModalBg.png";
import purpleModalBg from "@/assets/purpleModalBg.png";
import greenModalBg from "@/assets/greenModalBg.png";

function MuitiFlipCheckBoxesFrame({
  data,
  answers,
  setAnswers,
  setErrorMessage,
}) {
  const { step, instruction, info } = data;
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const colorToBackgroundMap = {
    maroon: {
      checkBg: maroonCheckBg,
      modalBg: maroonModalBg,
      colorCode: "#F46851",
    },
    orange: {
      checkBg: orangeCheckBg,
      modalBg: orangeModalBg,
      colorCode: "#CB962C",
    },
    purple: {
      checkBg: purpleCheckBg,
      modalBg: purpleModalBg,
      colorCode: "#8F44B5",
    },
    green: {
      checkBg: greenCheckBg,
      modalBg: greenModalBg,
      colorCode: "#89BB3E",
    },
  };

  useEffect(() => {
    const existingAnswers =
      answers.find((answer) => answer.stepId === step)?.value || {};
    setSelectedOptions(existingAnswers);
  }, [answers, step]);

  const handleCheckboxChange = (index) => {
    setErrorMessage("");
    setSelectedOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        [index]: !prevOptions[index],
      };
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        const stepIndex = updatedAnswers.findIndex(
          (answer) => answer.stepId === step
        );

        if (stepIndex !== -1) {
          updatedAnswers[stepIndex] = { stepId: step, value: updatedOptions };
        } else {
          updatedAnswers.push({ stepId: step, value: updatedOptions });
        }

        return updatedAnswers;
      });
      return updatedOptions;
    });
  };

  const openModal = (option, event) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setSelectedOption(option);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOption(null);
  };

  return (
    <QuestionBox>
      <div className="d-flex gap-2 mb-5 flex-column flex-md-row">
        <h2 className="text-blue">Instruction:</h2>
        <h2 className="text-gray">{instruction}</h2>
      </div>

      <div className="container">
        <div
          className="row mt-md-5 g-3"
          style={
            {
              // display: "grid",
              // gridTemplateColumns: "repeat(4, 1fr)",
              // gap: "20px",
              // justifyContent: "center",
            }
          }
        >
          {info?.map((option, index) => (
            <div
              key={index}
              className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex flex-column align-items-center"
              style={{
                backgroundImage: `url(${
                  colorToBackgroundMap[option.color].checkBg
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <div
                className="d-flex flex-col justify-content-between align-items-center w-100"
                // style={{ width: "100%" }}
              >
                <div
                  onClick={(e) => openModal(option, e)}
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    textAlign: "left",
                    cursor: "pointer",
                    // marginLeft: "10px",
                    // marginRight: "5em",
                    maxWidth: "100%",
                  }}
                >
                  {option.value}
                </div>
                <div style={{ marginRight: "0" }}>
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={!!selectedOptions[index]}
                    onChange={() => handleCheckboxChange(index)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor={`checkbox-${index}`}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        selectedOptions[index] ? checkedImage : uncheckedImage
                      }
                      alt={`Checkbox for ${option.value}`}
                      style={{ width: 40, height: 40 }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedOption && (
        <div
          className="position-fixed"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "100px",
          }}
          onClick={closeModal}
        >
          <div
            className="px-4 py-3 text-center"
            style={{
              backgroundImage: `url(${
                colorToBackgroundMap[selectedOption.color].modalBg
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "100%",
              maxHeight: "300px",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              paddingRight: "30px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                cursor: "pointer",
              }}
              className="mr-5"
              onClick={closeModal}
            >
              ✕
            </div>
            <h2 className="mb-1 mt-1 w-100">{selectedOption.value}</h2>
            <hr
              style={{
                border: `0.01em solid ${
                  colorToBackgroundMap[selectedOption.color].colorCode
                }`,
              }}
            />
            <p
              style={{
                color: colorToBackgroundMap[selectedOption.color].colorCode,
              }}
            >
              {selectedOption.description}
            </p>
            <p className="font-italic">{selectedOption.eg}</p>
          </div>
        </div>
      )}
    </QuestionBox>
  );
}

export default MuitiFlipCheckBoxesFrame;
