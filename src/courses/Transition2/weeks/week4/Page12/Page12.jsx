import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import StepIndicator from "../../../components/StepIndicator";
import {
  selectCurrentStep,
  selectPageData,
} from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import "./page12.css";

function WeekFourPage12() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const step = pageData?.steps?.[currentStep - 1];
  const totalSteps = pageData?.steps?.length || 1;
  const [textAnswer, setTextAnswer] = useState("");
  const [ratings, setRatings] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;

    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer && typeof response.answer === "object") {
      setTextAnswer(response.answer.textAnswer || response.answer[1] || "");
      setRatings(response.answer.ratings || {});
    } else if (response?.answer) {
      setTextAnswer(response.answer);
      setRatings({});
    }
  }, [userAnswers, pageData.id]);

  const handleTextChange = (event) => {
    setErrorMessage("");
    setTextAnswer(event.target.value);
  };

  const handleRatingChange = (skill, value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 1);
    setErrorMessage("");
    setRatings((prevRatings) => ({
      ...prevRatings,
      [skill]: numericValue,
    }));
  };

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (currentStep === 1 && !textAnswer.trim()) {
      setErrorMessage("Oops! Please enter your answer before moving on.");
      return false;
    }

    if (currentStep === 2) {
      const missingSkill = step.skills?.some((skill) => !ratings[skill]);
      const invalidRating = step.skills?.some((skill) => {
        const rating = Number(ratings[skill]);
        return rating < 1 || rating > 5;
      });

      if (missingSkill || invalidRating) {
        setErrorMessage("Please rate all four skills from 1 to 5.");
        return false;
      }
    }

    setErrorMessage("");
    if (currentStep !== totalSteps) return true;

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          textAnswer,
          ratings,
        },
      })
    );
    return true;
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    if (step.type === "socialSkillRating") {
      return (
        <QuestionBox extraStyle="bg-custom-blue">
          <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4 text-center">
            <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
            <div className="d-flex flex-column flex-grow-1 min-w-0">
              <h2 className="text-gray fs-1 mb-3">{step.question}</h2>
            </div>
          </div>
          <div className="mx-auto transition2-week4-social-rating">
            {step.skills.map((skill, index) => (
              <label
                key={skill}
                className="transition2-week4-social-rating-row"
              >
                <span>
                  {index + 1}. {skill}:
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={ratings[skill] || ""}
                  onChange={(event) =>
                    handleRatingChange(skill, event.target.value)
                  }
                  className="transition2-week4-social-rating-input"
                  aria-label={`${skill} rating`}
                />
              </label>
            ))}
          </div>
        </QuestionBox>
      );
    }

    return (
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
          <div className="d-flex flex-column flex-grow-1 min-w-0 mb-5">
            <h2 className="text-gray fs-1 mb-2 ">{step.question}</h2>
          </div>
        </div>
        <BigTextBox handleChange={handleTextChange} value={textAnswer} />
      </QuestionBox>
    );
  };

  return (
    <>
      {renderStep()}
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default WeekFourPage12;
