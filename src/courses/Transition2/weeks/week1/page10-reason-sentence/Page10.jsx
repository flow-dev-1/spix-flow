import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentStep,
  selectPageData,
} from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  saveActivity,
  userAnswer,
} from "@/store/userAnswersReducer";
import Button from "../../../components/Button";
import BigTextBox from "../../../components/BigTextBox";
import QuestionBox from "../../../components/QuestionBox";
import StepIndicator from "../../../components/StepIndicator";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";
import confidentImg from "@/assets/transition-2-images/week1/page6/confident.png";
import independentImg from "@/assets/transition-2-images/week1/page6/independent.png";
import disciplinedImg from "@/assets/transition-2-images/week1/page6/disciplined.png";
import socialImg from "@/assets/transition-2-images/week1/page6/social.png";
import curiousImg from "@/assets/transition-2-images/week1/page6/curious.png";
import resilientImg from "@/assets/transition-2-images/week1/page6/resilient.png";
import creativeImg from "@/assets/transition-2-images/week1/page6/creative.png";
import leaderImg from "@/assets/transition-2-images/week1/page6/leader.png";
import "./page10.css";

function Page10ReasonSentence() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);
  const totalSteps = pageData?.steps?.length || 0;
  const step = pageData?.steps?.[currentStep - 1];
  const [textAnswer, setTextAnswer] = useState("");
  const [sentenceAnswer, setSentenceAnswer] = useState({
    reason: "",
    identity: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const futureSelfOptions = [
    { label: "Confident", image: confidentImg },
    { label: "Independent", image: independentImg },
    { label: "Disciplined", image: disciplinedImg },
    { label: "Social", image: socialImg },
    { label: "Curious", image: curiousImg },
    { label: "Resilient", image: resilientImg },
    { label: "Creative", image: creativeImg },
    { label: "Leader", image: leaderImg },
  ];

  const page8Response = userAnswers?.activities?.find(
    (item) => item.page === 8
  );
  const page8CheckboxAnswers = page8Response?.answer?.checkboxAnswers || {};

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer) {
      setTextAnswer(response.answer.textAnswer || "");
      setSentenceAnswer(
        response.answer.sentenceAnswer &&
          typeof response.answer.sentenceAnswer === "object"
          ? {
              reason: response.answer.sentenceAnswer.reason || "",
              identity: response.answer.sentenceAnswer.identity || "",
            }
          : {
              reason: "",
              identity: "",
            }
      );
    }
  }, [userAnswers, pageData.id]);

  const handleTextChange = (event) => {
    setErrorMessage("");
    setTextAnswer(event.target.value);
  };

  const handleSentenceChange = (field, value) => {
    setErrorMessage("");
    setSentenceAnswer((prevAnswer) => ({
      ...prevAnswer,
      [field]: value,
    }));
  };

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (currentStep === 1 && !textAnswer.trim()) {
      setErrorMessage("Oops! Please enter your reason before moving on.");
      return false;
    }

    if (currentStep === 2) {
      const hasReason = sentenceAnswer.reason.trim();
      const hasIdentity = sentenceAnswer.identity.trim();

      if (!hasReason || !hasIdentity) {
        setErrorMessage("Oops! Please complete both blanks in the sentence.");
        return false;
      }
    }

    setErrorMessage("");

    if (currentStep === totalSteps) {
      dispatch(
        saveActivity({
          page: pageData.id,
          answer: {
            textAnswer,
            sentenceAnswer,
          },
        })
      );
    }

    return true;
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    if (step.type === "sentenceCompletion") {
      return (
        <QuestionBox>
          <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5">
            <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
            <div className="d-flex flex-column flex-grow-1 min-w-0 text-gray">
              <h2 className="text-gray mb-4 transition2-week1-page10-copy">
                "Complete this sentence.
              </h2>
              <p className="mb-2 transition2-week1-page10-copy">
                I am choosing to pursue higher education/further training
                because
              </p>
              <div className="d-flex align-items-end mb-3">
                <label
                  className="flex-grow-1 d-block"
                  style={{
                    borderBottom: "3px dashed #5b616a",
                    minHeight: "56px",
                  }}
                >
                  <input
                    aria-label="Reason for choosing higher education or further training"
                    className="w-100 bg-transparent text-gray px-2 py-1 transition2-week1-page10-input"
                    value={sentenceAnswer.reason}
                    onChange={(event) =>
                      handleSentenceChange("reason", event.target.value)
                    }
                  />
                </label>
                <span className="transition2-week1-page10-copy">,</span>
              </div>
              <p className="mb-2 transition2-week1-page10-copy">
                and the person I want to become is someone who
              </p>
              <div className="d-flex align-items-end mb-0">
                <label
                  className="flex-grow-1 d-block"
                  style={{
                    borderBottom: "3px dashed #5b616a",
                    minHeight: "56px",
                  }}
                >
                  <input
                    aria-label="The person I want to become"
                    className="w-100 bg-transparent text-gray px-2 py-1 transition2-week1-page10-input"
                    value={sentenceAnswer.identity}
                    onChange={(event) =>
                      handleSentenceChange("identity", event.target.value)
                    }
                  />
                </label>
                <span className="transition2-week1-page10-copy">."</span>
              </div>
            </div>
          </div>
        </QuestionBox>
      );
    }

    if (step.type === "visionBoard") {
      return (
        <div className="transition2-week1-page10-vision-board">
          <div className="transition2-week1-page10-vision-title">
            MY VISION BOARD
          </div>

          <div className="transition2-week1-page10-vision-grid">
            {futureSelfOptions.map((option, index) => (
              <div
                key={option.label}
                className="transition2-week1-page10-vision-item"
              >
                <div className="transition2-week1-page10-vision-image-wrap">
                  <img src={option.image} alt={option.label} />
                </div>
                <div className="transition2-week1-page10-vision-label">
                  <img
                    src={
                      page8CheckboxAnswers[index] ? checkedImage : uncheckedImage
                    }
                    alt=""
                  />
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="transition2-week1-page10-vision-sentence">
            "Complete this sentence: I am choosing to pursue higher
            education/further training because{" "}
            <span>{sentenceAnswer.reason || "________________________"}</span>,
            and the person I want to become is someone who{" "}
            <span>{sentenceAnswer.identity || "________________________"}</span>
            ."
          </div>
        </div>
      );
    }

    return (
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
          <div className="d-flex flex-column flex-grow-1 min-w-0 mb-5">
            <h2 className="text-gray fs-1 mb-2">{step.question}</h2>
          </div>
        </div>
        <BigTextBox handleChange={handleTextChange} value={textAnswer} />
      </QuestionBox>
    );
  };

  return (
    <>
      {renderStep()}
      {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page10ReasonSentence;
