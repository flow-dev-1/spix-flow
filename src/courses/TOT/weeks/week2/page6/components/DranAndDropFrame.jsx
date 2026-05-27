import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardBoard from "./CardBoard";
import ArrowTrail from "@/assets/ArrowTrail.svg";
import { getAssetUrl } from "../../../../assetUrls";
import "../page6.css";

const DragAndDropFrame = ({
  info,
  setErrorMessage,
  answers,
  setAnswers,
  setCurrentImageIndex1,
  setDragDropImageLength,
}) => {
  const { images, buckets, instruction } = info;
  const [bucketResults, setBucketResults] = useState({
    green: [],
    red: [],
    orange: [],
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeBucketId, setActiveBucketId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const activeBucketRef = useRef(null);

  useEffect(() => {
    if (!answers?.length) return;

    const existingAnswer = answers.find((answer) => answer.stepId === 2);
    if (existingAnswer?.value) {
      setBucketResults({
        green: existingAnswer.value.green || [],
        red: existingAnswer.value.red || [],
        orange: existingAnswer.value.orange || [],
      });

      // Update currentImageIndex based on total dropped items
      const totalDropped =
        (existingAnswer.value.green?.length || 0) +
        (existingAnswer.value.red?.length || 0) +
        (existingAnswer.value.orange?.length || 0);
      setCurrentImageIndex(totalDropped);
      setCurrentImageIndex1(totalDropped);
    }
  }, [answers]);

  const totalDropped = Object.values(bucketResults).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const allImagesDropped = totalDropped >= images.length;

  const getTrackedDestinationId = (destination) => {
    if (activeBucketRef.current) return activeBucketRef.current;
    if (destination?.droppableId && destination.droppableId !== "image") {
      return destination.droppableId;
    }
    return null;
  };

  const handleOnDragEnd = (result) => {
    setErrorMessage("");
    const { source, destination } = result;
    const destinationId = getTrackedDestinationId(destination);

    setIsDragging(false);
    setActiveBucketId(null);
    activeBucketRef.current = null;

    if (source.droppableId === "image" && destinationId) {
      const draggedIndex = currentImageIndex;

      // Update bucket results
      const newBucketResults = {
        ...bucketResults,
        [destinationId]: [
          ...(bucketResults[destinationId] || []),
          draggedIndex,
        ],
      };
      setBucketResults(newBucketResults);

      // Update answers state
      setAnswers((prevAnswers) => {
        const existingAnswerIndex = prevAnswers.findIndex(
          (answer) => answer.stepId === 2
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
              stepId: 2,
              value: newBucketResults,
            },
          ];
        }
      });

      // Update current image index
      setCurrentImageIndex((prevIndex) =>
        prevIndex + 1 < images.length ? prevIndex + 1 : prevIndex
      );
      setCurrentImageIndex1((prevIndex) =>
        prevIndex + 1 < images.length ? prevIndex + 1 : prevIndex
      );
    }
  };

  const handleOnDragStart = () => {
    setIsDragging(true);
    setActiveBucketId(null);
    activeBucketRef.current = null;
  };

  const handleOnDragUpdate = (update) => {
    const destinationId = update.destination?.droppableId;
    if (!destinationId || destinationId === "image") return;
    activeBucketRef.current = destinationId;
    setActiveBucketId(destinationId);
  };

  const goToStep = (index) => {
    if (index < currentImageIndex) {
      setCurrentImageIndex(index);
      setCurrentImageIndex1(index);
    }
  };

  useEffect(() => {
    setDragDropImageLength(images.length);

    return () => {};
  }, [images]);

  useEffect(() => {
    if (!isDragging) return;

    const getPoint = (event) => {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      if (touch) {
        return { x: touch.clientX, y: touch.clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    const trackBucket = (event) => {
      const { x, y } = getPoint(event);
      const bucketElement = document
        .elementsFromPoint(x, y)
        .find((element) => element.closest?.(".tot-week2-bucket-drop"))
        ?.closest(".tot-week2-bucket-drop");
      const bucketId = bucketElement?.dataset?.bucketId || null;

      activeBucketRef.current = bucketId;
      setActiveBucketId(bucketId);
    };

    window.addEventListener("mousemove", trackBucket);
    window.addEventListener("touchmove", trackBucket, { passive: true });

    return () => {
      window.removeEventListener("mousemove", trackBucket);
      window.removeEventListener("touchmove", trackBucket);
    };
  }, [isDragging]);

  const renderDragItem = () => {
    if (currentImageIndex >= images.length || allImagesDropped) return null;

    const imagePath = getAssetUrl(`drag-images/tot-drag-images/week2/page6/image${
      currentImageIndex + 1
    }.png`);

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
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragUpdate={handleOnDragUpdate}
        onDragEnd={handleOnDragEnd}
      >
        <div className="row custom-border-20 w-100 m-0 dnd-row-fixed">
          {/* Left Droppable (50%) */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4">
            <Droppable droppableId="image">
              {(provided, snapshot) => (
                <div
                  className="w-100 d-flex justify-content-center align-items-center"
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
                      className="d-none d-md-block"
                      style={{ width: "150px" }}
                    />
                  )}
                  {renderDragItem()}
                  <div style={{ height: 0, overflow: "hidden" }}>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>

          {/* Right Buckets (50%) */}
          <div className="col-12 col-md-6 bg-blue px-4 py-3 dnd-buckets-col">
            <div className="d-flex align-items-start mb-2">
              <img src={ArrowTrail} alt="arrow trail" className="arrow-head" />
              <div className="text-center text-white pt-1 flex-grow-1 tot-drag-instruction">
                <h1 className="fs-3">{instruction}</h1>
              </div>
              <img
                src={ArrowTrail}
                alt="arrow trail"
                className="arrow-head arrow-tail"
              />
            </div>

            <div className="tot-week2-buckets-row">
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
                        className={`pt-1 draggable-bucket tot-week2-bucket-drop ${
                          (
                            activeBucketId
                              ? activeBucketId === bucket.id
                              : snapshot.isDraggingOver
                          )
                            ? "is-dragging-over"
                            : ""
                        }`}
                        data-bucket-id={bucket.id}
                        {...provided.droppableProps}
                      >
                        <h2
                          className={
                            bucket.id === "green"
                              ? "inner-count"
                              : bucket.id === "orange"
                              ? "outer-count"
                              : "both-count"
                          }
                        >
                          {bucketResults[bucket.id]?.length || 0}
                        </h2>
                        <div
                          className={
                            bucket.id === "green"
                              ? "inner-bucket bucket-text"
                              : bucket.id === "orange"
                              ? "outer-bucket bucket-text"
                              : "both-bucket bucket-text"
                          }
                        >
                          <p className="text-center">
                          {bucket.title}
                          </p>
                        </div>
                        <div style={{ height: 0, overflow: "hidden" }}>
                          {provided.placeholder}
                        </div>
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
