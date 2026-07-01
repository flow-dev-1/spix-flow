import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../components/Button";
import QuestionBox from "../../../components/QuestionBox";

import {
  selectCurrentStep,
  selectPageData,
} from "@/store/navigationSlice";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

import FlipCheckBoxesFrameSingle from "./components/FlipCheckBoxesFrameSingle";
import checkedImage from "@/assets/checkedbox.png";
import "./page8.css";

function WeekTwoPage8() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const [selectedValues, setSelectedValues] = useState({});
  const [rankValues, setRankValues] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;

    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer) {
      setSelectedValues(response.answer.selectedValues || {});
      setRankValues(response.answer.rankValues || {});
    }
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    const chosenCount = Object.values(selectedValues).filter(Boolean).length;

    if (chosenCount !== 5) {
      setErrorMessage("Please choose exactly 5 values before moving on.");
      return false;
    }

    if (currentStep === 2) {
      const selectedOptions = getSelectedOptions();
      const ranks = selectedOptions.map((option) => rankValues[option.value]);
      const hasMissingRank = ranks.some((rank) => !rank);
      const validRanks = ["1", "2", "3", "4", "5"];
      const hasInvalidRank = ranks.some((rank) => !validRanks.includes(rank));
      const uniqueRanks = new Set(ranks);

      if (hasMissingRank) {
        setErrorMessage("Please rank each selected value from 1 to 5.");
        return false;
      }

      if (hasInvalidRank || uniqueRanks.size !== 5) {
        setErrorMessage("Please use each rank from 1 to 5 only once.");
        return false;
      }
    }

    setErrorMessage("");

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          selectedValues,
          rankValues,
        },
      })
    );

    return true;
  };

  const handleToggle = (index) => {
    setErrorMessage("");

    setSelectedValues((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRankChange = (value, rank) => {
    setErrorMessage("");
    if (rank && !["1", "2", "3", "4", "5"].includes(rank)) return;
    setRankValues((prev) => ({
      ...prev,
      [value]: rank,
    }));
  };

  const getSelectedOptions = () =>
    pageData.options?.filter((_, index) => selectedValues[index]) || [];

  return (
    <>
      <QuestionBox>
        {currentStep === 1 ? (
          <>
            <div className="d-flex gap-2 mb-5 flex-column flex-md-row">
              <h2 className="text-blue">Instruction:</h2>
              <h2 className="text-gray">{pageData.instruction}</h2>
            </div>

            <FlipCheckBoxesFrameSingle
              options={pageData.options}
              selectedValues={selectedValues}
              handleToggle={handleToggle}
              setErrorMessage={setErrorMessage}
            />
          </>
        ) : (
          <div className="transition2-page12-rank">
            <h2 className="transition2-page12-rank-question">
              <span className="text-blue">Question:</span>{" "}
              {pageData.rankInstruction}
            </h2>
            <div className="transition2-page12-rank-list">
              {getSelectedOptions().map((option) => (
                <div
                  className="transition2-page12-rank-row"
                  key={option.value}
                >
                  <div
                    className={`transition2-page12-value-card transition2-page12-value-${option.color}`}
                  >
                    <span>{option.value}</span>
                    <img src={checkedImage} alt="" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="transition2-page12-rank-input"
                    value={rankValues[option.value] || ""}
                    onChange={(event) =>
                      handleRankChange(option.value, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </QuestionBox>

      {errorMessage && <div className="text-danger">{errorMessage}</div>}

      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default WeekTwoPage8;
