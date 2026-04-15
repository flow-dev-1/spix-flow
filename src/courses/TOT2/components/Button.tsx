import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  navigateNext,
  navigatePrev,
  selectNavigationState,
} from "@/store/navigationSlice";
import { RotatingLines } from "react-loader-spinner";

const Button = ({ loading, text, customOnClick }) => {
  const dispatch = useDispatch();
  const navigationState = useSelector(selectNavigationState);
  const { isFirstPage, isFirstStep, isFirstWeek } = navigationState;

  const handleClick = (e) => {
    e.preventDefault();

    if (loading) return;

    if (customOnClick) {
      const inputOkay = customOnClick();

      // If the User is expected to enter input and does not they cant proceed.
      if (!inputOkay) return;
    }

    if (text === "Next") {
      dispatch(navigateNext());
    } else if (text === "Prev") {
      dispatch(navigatePrev());
    }
  };

  // Don't render prev button on first page of first week
  // or first step of a multi-step page
  // if (text === "Prev" && isFirstStep) {
  //   return null; // should have not saved currentStep to be 1 initally
  // }               or maybe we can use this // (imageDragAndDrop || multiStep || interactiveScenario || multiScenario ), get it from page data, for the assesment, just get pag etype

  const isNextButton = text === "Next";
  const isSubmitButton = text === "Submit";
  const isActionButton = isNextButton || isSubmitButton;
  const isPrevButton = text === "Prev";

  return (
    <button
      className={`btn fs-5 rounded w-200px h-40px d-flex align-items-center justify-content-center ${
        isNextButton || customOnClick
          ? "bg-button text-white border-0 hover-prev"
          : isPrevButton
          ? "bg-transparent text-button-blue border border-blue hover-next"
          : ""
      }`}
      onClick={handleClick}
      type="button"
      disabled={loading}
      style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
    >
      {loading && isActionButton ? (
        <RotatingLines
          className="me-2 text-white"
          type="Oval"
          strokeColor="white"
          height={20}
          width={20}
        />
      ) : (
        <>
          {isPrevButton && <span className="me-2">{"<<<"}</span>}
          {text}
          {isNextButton && <span className="ms-2">{">>>"}</span>}
        </>
      )}
    </button>
  );
};

export default React.memo(Button);
