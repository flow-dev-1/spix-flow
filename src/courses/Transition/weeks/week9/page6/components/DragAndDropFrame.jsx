import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Icon } from "@iconify/react";
import CardBoard from "./CardBoard";
import ArrowTrail from "@/assets/ArrowTrail.svg";
import { getAssetUrl } from "../../../../assetUrls";
import "../page6.css";

const InternalStepIndicator = ({ totalSteps, currentStep }) => {
  return (
    <div className="transition-week9-step-indicators">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`transition-week9-step-dot ${
            index + 1 <= currentStep ? "is-active" : ""
          }`}
        />
      ))}
    </div>
  );
};

const DragAndDropFrame = ({ info, setErrorMessage, answers, setAnswers }) => {
  const { images, buckets, instruction } = info;
  const [bucketResults, setBucketResults] = useState({ green: [], red: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dndResetKey, setDndResetKey] = useState(0);

  useEffect(() => {
    if (!answers?.length) return;

    const existingAnswer = answers.find((answer) => answer.stepId === 6);
    if (existingAnswer?.value) {
      setBucketResults({
        green: existingAnswer.value.green || [],
        red: existingAnswer.value.red || [],
      });

      // Update currentImageIndex based on total dropped items
      const totalDropped =
        (existingAnswer.value.green?.length || 0) +
        (existingAnswer.value.red?.length || 0);
      setCurrentImageIndex(totalDropped);
    }
  }, [answers]);

  const totalDropped = Object.values(bucketResults).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const allImagesDropped = totalDropped >= images.length;

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    setErrorMessage("");
    const { source, destination } = result;

    if (source.droppableId === "image" && destination.droppableId !== "image") {
      const draggedIndex = currentImageIndex;

      // Update bucket results
      const newBucketResults = {
        ...bucketResults,
        [destination.droppableId]: [
          ...(bucketResults[destination.droppableId] || []),
          draggedIndex,
        ],
      };
      setBucketResults(newBucketResults);

      // Update answers state
      setAnswers((prevAnswers) => {
        const existingAnswerIndex = prevAnswers.findIndex(
          (answer) => answer.stepId === 6
        );

        if (existingAnswerIndex !== -1) {
          // Update existing answer
          const updatedAnswers = [...prevAnswers];
          updatedAnswers[existingAnswerIndex] = {
            ...updatedAnswers[existingAnswerIndex],
            value: newBucketResults,
          };
          return updatedAnswers;
        } else {
          // Create new answer
          return [
            ...prevAnswers,
            {
              stepId: 6,
              value: newBucketResults,
            },
          ];
        }
      });

      // Update current image index
      setCurrentImageIndex((prevIndex) =>
        prevIndex + 1 < images.length ? prevIndex + 1 : prevIndex
      );
    }
  };

  const goToStep = (index) => {
    if (index < currentImageIndex) {
      setCurrentImageIndex(index);
    }
  };

  const handleReset = () => {
    setErrorMessage("");
    setBucketResults({ green: [], red: [] });
    setCurrentImageIndex(0);
    setDndResetKey((key) => key + 1);
    setAnswers((prevAnswers) =>
      prevAnswers.filter((answer) => answer.stepId !== 6)
    );
  };

  const renderDragItem = () => {
    if (currentImageIndex >= images.length || allImagesDropped) return null;

    const imagePath = getAssetUrl(
      `drag-images/transition-drag-images/week9/image${currentImageIndex + 1}.png`,
    );

    return (
      <Draggable
        draggableId={`image-${currentImageIndex}`}
        index={0}
        isDragDisabled={allImagesDropped}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              cursor: allImagesDropped
                ? "not-allowed"
                : snapshot.isDragging
                ? "grabbing"
                : "grab",
              opacity: allImagesDropped ? 0.5 : 1,
              transform: `${provided.draggableProps.style?.transform || ""} ${
                snapshot.isDragging ? "scale(0.3)" : ""
              }`,
              zIndex: snapshot.isDragging ? 9999 : 1,
            }}
          >
            <CardBoard imgSrc={imagePath} />
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <>
      {" "}
      <InternalStepIndicator
        totalSteps={images.length}
        currentStep={currentImageIndex + 1}
      />
      <button
        type="button"
        onClick={handleReset}
        className="transition-week9-reset-button"
      >
        <Icon icon="teenyicons:refresh-solid" width={18} />
        <span>Reset</span>
      </button>
      <DragDropContext key={dndResetKey} onDragEnd={handleOnDragEnd}>
        <div className="d-flex flex-column align-items-center pt-2">
          {/* Step Indicator */}

          <div className="d-flex custom-border-20 flex-column flex-md-row">
            <Droppable droppableId="image">
              {(provided, snapshot) => (
                <div
                  className="d-flex p-5 justify-content-center align-items-center w-lg-50"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    minHeight: "200px",
                    transition: "background-color 0.2s ease",
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                  }}
                >
                  {allImagesDropped && (
                    <span
                      className="d-none d-md-block w-lg-50"
                      style={{ width: "150px" }}
                    ></span>
                  )}
                  {renderDragItem()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="bg-blue w-lg-50">
              <div className="d-flex align-items-start mb-2">
                <img
                  src={ArrowTrail}
                  alt="arrow trail"
                  className="arrow-head"
                />
                <div className="text-center text-white pt-2">
                  <h1 className="transition-week9-drag-instruction">
                    {instruction}
                  </h1>
                </div>
                <img
                  src={ArrowTrail}
                  alt="arrow trail"
                  className="arrow-head"
                />
              </div>
              <div className="transition-week9-buckets-row px-0 py-0 px-md-4 py-md-2">
                {buckets &&
                  buckets.map((bucket) => (
                    <Droppable
                      key={bucket.title}
                      droppableId={bucket.id}
                      ignoreContainerClipping
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          className={`transition-week9-bucket-drop p-0 p-md-2 ${
                            snapshot.isDraggingOver ? "is-dragging-over" : ""
                          }`}
                          {...provided.droppableProps}
                        >
                          <h2
                            className={
                              bucket.id === "green"
                                ? "inner-count"
                                : "both-count"
                            }
                          >
                            {bucketResults[bucket.id]?.length || 0}
                          </h2>
                          <div
                            className={`${
                              bucket.id === "green"
                                ? "inner-bucket"
                                : "both-bucket"
                            } bucket-text`}
                          >
                            <span>{bucket.title}</span>
                          </div>
                          <div className="transition-week9-hidden-placeholder">
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
              </div>
            </div>
          </div>
          {allImagesDropped && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              All images have been placed!
            </p>
          )}
        </div>
      </DragDropContext>
    </>
  );
};

export default DragAndDropFrame;
