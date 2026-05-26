import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardBoard from "./CardBoard";
import ArrowTrail from "@/assets/ArrowTrail.svg";
import "../page10.css";
import { getAssetUrl } from "../../../../assetUrls";

const DragAndDropFrame = ({
  info,
  setErrorMessage,
  answers,
  setAnswers,
  setCurrentImageIndex1,
  setDragDropImageLength,
}) => {
  const { imagePairs, buckets, instruction } = info;
  const [bucketResults, setBucketResults] = useState({ green: [], red: [] });
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [droppedInCurrentPair, setDroppedInCurrentPair] = useState([]);

  // Calculate total images across all pairs
  const totalImages =
    imagePairs?.reduce((sum, pair) => sum + pair.images.length, 0) || 0;

  useEffect(() => {
    if (!answers?.length) return;

    const existingAnswer = answers.find((answer) => answer.stepId === 2);
    if (existingAnswer?.value) {
      setBucketResults({
        green: existingAnswer.value.green || [],
        red: existingAnswer.value.red || [],
      });

      // Calculate which pair we're on based on total dropped items
      const totalDropped =
        (existingAnswer.value.green?.length || 0) +
        (existingAnswer.value.red?.length || 0);

      let pairIndex = 0;
      let itemsCount = 0;

      for (let i = 0; i < imagePairs.length; i++) {
        if (itemsCount + imagePairs[i].images.length <= totalDropped) {
          itemsCount += imagePairs[i].images.length;
          pairIndex = i + 1;
        } else {
          break;
        }
      }

      setCurrentPairIndex(Math.min(pairIndex, imagePairs.length - 1));
      setCurrentImageIndex1(totalDropped);

      // Track what's been dropped in current pair
      const droppedIds = [
        ...(existingAnswer.value.green || []),
        ...(existingAnswer.value.red || []),
      ];
      const currentPairImageIds =
        imagePairs[pairIndex]?.images.map((img) => img.id) || [];
      const droppedInPair = currentPairImageIds.filter((id) =>
        droppedIds.includes(id)
      );
      setDroppedInCurrentPair(droppedInPair);
    }
  }, [answers, imagePairs]);

  useEffect(() => {
    setDragDropImageLength(totalImages);
  }, [totalImages]);

  const totalDropped = Object.values(bucketResults).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const allImagesDropped = totalDropped >= totalImages;
  const currentPair = imagePairs?.[currentPairIndex];
  const allCurrentPairDropped =
    currentPair && droppedInCurrentPair.length >= currentPair.images.length;

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.droppableId === "image") return;

    setErrorMessage("");
    const { source, destination } = result;

    if (source.droppableId === "image") {
      // Extract the image ID from draggableId (format: "image-{imageId}")
      const draggedImageId = parseInt(result.draggableId.split("-")[1]);

      // Check if this image was already dropped
      if (droppedInCurrentPair.includes(draggedImageId)) return;

      // Update bucket results
      const newBucketResults = {
        ...bucketResults,
        [destination.droppableId]: [
          ...(bucketResults[destination.droppableId] || []),
          draggedImageId,
        ],
      };
      setBucketResults(newBucketResults);

      // Update dropped in current pair
      const newDroppedInPair = [...droppedInCurrentPair, draggedImageId];
      setDroppedInCurrentPair(newDroppedInPair);

      // Update answers state
      setAnswers((prevAnswers) => {
        const existingAnswerIndex = prevAnswers.findIndex(
          (answer) => answer.stepId === 2
        );

        if (existingAnswerIndex !== -1) {
          const updatedAnswers = [...prevAnswers];
          updatedAnswers[existingAnswerIndex] = {
            ...updatedAnswers[existingAnswerIndex],
            value: newBucketResults,
          };
          return updatedAnswers;
        } else {
          return [
            ...prevAnswers,
            {
              stepId: 2,
              value: newBucketResults,
            },
          ];
        }
      });

      // Update total dropped count for the indicator
      const newTotalDropped = totalDropped + 1;
      setCurrentImageIndex1(newTotalDropped);

      // Move to next pair if current pair is complete
      if (
        newDroppedInPair.length >= currentPair.images.length &&
        currentPairIndex < imagePairs.length - 1
      ) {
        setCurrentPairIndex(currentPairIndex + 1);
        setDroppedInCurrentPair([]);
      }
    }
  };

  const renderDragItems = () => {
    if (!currentPair || allImagesDropped || allCurrentPairDropped) return null;

    return currentPair.images.map((image, index) => {
      // Skip if this image was already dropped
      if (droppedInCurrentPair.includes(image.id)) return null;

      const imagePath = getAssetUrl(`drag-images/tot-drag-images/week1/page10/image${
        image.id + 1
      }.png`);

      return (
        <Draggable
          key={`image-${image.id}`}
          draggableId={`image-${image.id}`}
          index={index}
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
              <CardBoard imgSrc={imagePath} text={image.text} />
            </div>
          )}
        </Draggable>
      );
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="row custom-border-20 w-100 m-0">
          {/* Left Droppable (50%) */}
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center p-4">
            {/* Decision Text */}
            {currentPair && !allImagesDropped && (
              <div className="text-center mb-4 w-100">
                <h2 className="text-blue fw-bold tot-week-2-question-text">
                  {currentPair.decisionText}
                </h2>
              </div>
            )}

            <Droppable droppableId="image">
              {(provided, snapshot) => (
                <div
                  className="w-100 d-flex justify-content-center align-items-center gap-3 flex-wra"
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
                  {renderDragItems()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Right Buckets (50%) */}
          <div className="col-12 col-md-6 bg-blue px-4 py-3">
            <div className="d-flex align-items-start mb-2">
              <img src={ArrowTrail} alt="arrow trail" className="arrow-head" />
              <div className="text-center text-white pt-1 flex-grow-1 resilience-drag-instruction">
                <h1 className="tot-week-2-question-text fw-bold">
                  {instruction}
                </h1>
              </div>
              <img
                src={ArrowTrail}
                alt="arrow trail"
                className="arrow-head arrow-tail"
              />
            </div>

            <div className="d-flex justify-content-around align-items-center flex-wrap">
              {buckets &&
                buckets.map((bucket) => (
                  <Droppable key={bucket.title} droppableId={bucket.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        className="pt-1 flex-fill draggable-bucket"
                        {...provided.droppableProps}
                        style={{
                          backgroundColor: snapshot.isDraggingOver
                            ? "rgba(255, 255, 255, 0.1)"
                            : "transparent",
                        }}
                      >
                        <h2
                          className={
                            bucket.id === "green" ? "inner-count" : "both-count"
                          }
                        >
                          {bucketResults[bucket.id]?.length || 0}
                        </h2>
                        <div
                          className={
                            bucket.id === "green"
                              ? "inner-box-sel bucket-text"
                              : "outer-box-not-sel bucket-text"
                          }
                        >
                          {/* <p className="text-center">{bucket.title}</p> */}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default DragAndDropFrame;
