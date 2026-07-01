import React, { useState } from "react";
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

function FlipCheckBoxesFrameSingle({
  options,
  selectedValues,
  handleToggle,
  setErrorMessage,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const colorToBackgroundMap = {
    red: {
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

  const openModal = (option) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOption(null);
  };

  return (
    <>
      <div className="container">
        <div className="row mt-md-5 g-3">
          {options?.map((option, index) => (
            <div
              key={index}
              className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex flex-column align-items-center "
              style={{
                backgroundImage: `url(${colorToBackgroundMap[option.color].checkBg
                  })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
                padding: "15px",
                cursor: "pointer",
              }}
              onClick={() => openModal(option)}
            >
              <div className="d-flex justify-content-between align-items-center w-100">
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    textAlign: "left",
                    maxWidth: "100%",
                  }}
                >
                  {option.value}
                </div>

                <label
                  style={{ cursor: "pointer" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={selectedValues[index] ? checkedImage : uncheckedImage}
                    alt="checkbox"
                    style={{ width: 40, height: 40 }}
                    onClick={() => handleToggle(index)}
                  />
                </label>
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
              backgroundImage: `url(${colorToBackgroundMap[selectedOption.color].modalBg
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
              onClick={closeModal}
            >
              ✕
            </div>

            <h2 className="mb-1 mt-1">{selectedOption.value}</h2>
            <hr
              style={{
                border: `0.01em solid ${colorToBackgroundMap[selectedOption.color].colorCode
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
    </>
  );
}

export default FlipCheckBoxesFrameSingle;
