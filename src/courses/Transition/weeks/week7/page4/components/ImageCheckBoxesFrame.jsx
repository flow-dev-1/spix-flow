import React, { useState, useEffect } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

import watchingTv from "@/assets/watchingTV.png";
import spendingTimeOnePhone from "@/assets/spendingTimeOnePhone.png";
import GistingAndGossiping from "@/assets/GistingAndGossiping.png";
import playingGames from "@/assets/playingGames.png";
import playingAround from "@/assets/playingAround.png";
import socialMedia from "@/assets/socialMedia.png";

function ImageCheckBoxesFrame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, title, info } = data;
  const [selectedOptions, setSelectedOptions] = useState({});

  const images = [
    watchingTv,
    spendingTimeOnePhone,
    GistingAndGossiping,
    playingGames,
    playingAround,
    socialMedia,
  ];

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

  return (
    <QuestionBox>
      <div className="d-flex gap-2 flex-column flex-md-row">
        <h2 className="text-blue fs-1">Question:</h2>
        <h2 className="text-gray fs-1">{title}</h2>
      </div>

      <div
        className="row g-2"
        style={
          {
            // display: "grid",
            // gridTemplateColumns: "repeat(3, 1fr)",
            // gap: "20px",
            // justifyContent: "center",
          }
        }
      >
        {info.map((option, index) => (
          <div
            key={index}
            className="col-12 col-md-6 col-lg-4 col-xl-3  d-flex flex-column align-items-center"
          >
            {/* Title with Background Color */}
            <div
              className="mt-2 d-flex justify-content-center align-items-center px-5 py-2 mb-2"
              style={{
                borderRadius: "2em",
                backgroundColor: option.colorCode,
                color: "black",
                fontWeight: "bold",
                fontSize: "15px",
                textAlign: "center",
                flex: "1",
              }}
            >
              {option.title}
            </div>

            {/* Image Container with Gray Border */}
            <div
              style={{
                width: "120px", // Increase size
                height: "120px", // Increase size
                border: "2px solid gray", // Gray border
                borderRadius: "10px", // Rounded edges
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5", // Light background
              }}
            >
              <img
                src={images[index % images.length]} // Cycle through images
                alt={`Option ${index}`}
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>

            {/* Hidden Checkbox for Accessibility */}
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              checked={!!selectedOptions[index]}
              onChange={() => handleCheckboxChange(index)}
              style={{ display: "none" }}
            />

            {/* Checkbox Image */}
            <label htmlFor={`checkbox-${index}`} style={{ cursor: "pointer" }}>
              <img
                src={selectedOptions[index] ? checkedImage : uncheckedImage}
                alt={option.title}
                style={{ width: 40, height: 40 }}
              />
            </label>
          </div>
        ))}
      </div>
    </QuestionBox>
  );
}

export default ImageCheckBoxesFrame;
