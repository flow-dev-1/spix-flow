import React, { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Icon } from "@iconify/react";
import CardBoard from "./CardBoard";
import ArrowTrail from "@/assets/ArrowTrail.svg";
import "../page8.css";
import dragImage1 from "@/assets/drag-images/transition-2-drag-images/week3/page8/1.png";
import dragImage2 from "@/assets/drag-images/transition-2-drag-images/week3/page8/2.png";
import dragImage3 from "@/assets/drag-images/transition-2-drag-images/week3/page8/3.png";
import dragImage4 from "@/assets/drag-images/transition-2-drag-images/week3/page8/4.png";
import dragImage5 from "@/assets/drag-images/transition-2-drag-images/week3/page8/5.png";
import dragImage6 from "@/assets/drag-images/transition-2-drag-images/week3/page8/6.png";
import dragImage7 from "@/assets/drag-images/transition-2-drag-images/week3/page8/7.png";
import dragImage8 from "@/assets/drag-images/transition-2-drag-images/week3/page8/8.png";
import dragImage9 from "@/assets/drag-images/transition-2-drag-images/week3/page8/9.png";
import dragImage10 from "@/assets/drag-images/transition-2-drag-images/week3/page8/10.png";

const dragImages = [
  dragImage1,
  dragImage2,
  dragImage3,
  dragImage4,
  dragImage5,
  dragImage6,
  dragImage7,
  dragImage8,
  dragImage9,
  dragImage10,
];

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
    orange: [],
    pink: [],
    red: [],
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeBucketId, setActiveBucketId] = useState(null);
  const activeBucketRef = useRef(null);
  const bucketRefs = useRef({});
  const dragItemRef = useRef(null);
  const isDraggingRef = useRef(false);
  const pointerPositionRef = useRef({ x: null, y: null });

  const getBucketIdAtPoint = useCallback(
    (x, y) => {
      if (x === null || y === null) return null;

      return (
        buckets.find((bucket) => {
          const bucketElement = bucketRefs.current[bucket.id];
          if (!bucketElement) return false;

          const rect = bucketElement.getBoundingClientRect();
          return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          );
        })?.id || null
      );
    },
    [buckets]
  );

  const getBucketIdForDraggedItem = useCallback(() => {
    const dragElement = dragItemRef.current;
    if (!dragElement) return null;

    const dragRect = dragElement.getBoundingClientRect();
    let bestBucketId = null;
    let bestOverlap = 0;

    buckets.forEach((bucket) => {
      const bucketElement = bucketRefs.current[bucket.id];
      if (!bucketElement) return;

      const bucketRect = bucketElement.getBoundingClientRect();
      const overlapX = Math.max(
        0,
        Math.min(dragRect.right, bucketRect.right) -
          Math.max(dragRect.left, bucketRect.left)
      );
      const overlapY = Math.max(
        0,
        Math.min(dragRect.bottom, bucketRect.bottom) -
          Math.max(dragRect.top, bucketRect.top)
      );
      const overlapArea = overlapX * overlapY;

      if (overlapArea > bestOverlap) {
        bestOverlap = overlapArea;
        bestBucketId = bucket.id;
      }
    });

    return bestOverlap > 0 ? bestBucketId : null;
  }, [buckets]);

  const updateActiveBucket = useCallback(
    (bucketId) => {
      activeBucketRef.current = bucketId;
      setActiveBucketId((currentBucketId) =>
        currentBucketId === bucketId ? currentBucketId : bucketId
      );
    },
    []
  );

  useEffect(() => {
    if (!answers?.length) return;

    const existingAnswer = answers.find((answer) => answer.stepId === 2);
    if (existingAnswer?.value) {
      setBucketResults({
        orange: existingAnswer.value.orange || [],
        pink: existingAnswer.value.pink || [],
        red: existingAnswer.value.red || [],
      });

      // Update currentImageIndex based on total dropped items
      const totalDropped =
        (existingAnswer.value.pink?.length || 0) +
        (existingAnswer.value.red?.length || 0) +
        (existingAnswer.value.orange?.length || 0);
      setCurrentImageIndex(totalDropped);
      setCurrentImageIndex1(totalDropped);
    }
  }, [answers, setCurrentImageIndex1]);

  const totalDropped = Object.values(bucketResults).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const allImagesDropped = totalDropped >= images.length;

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isDraggingRef.current) return;

      const point = event.touches?.[0] || event;
      const x = point.clientX;
      const y = point.clientY;
      pointerPositionRef.current = { x, y };

      window.requestAnimationFrame(() => {
        if (!isDraggingRef.current) return;

        const hoveredBucketId =
          getBucketIdForDraggedItem() || getBucketIdAtPoint(x, y);
        updateActiveBucket(hoveredBucketId);
      });
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
    };
  }, [getBucketIdAtPoint, getBucketIdForDraggedItem, updateActiveBucket]);

  const handleOnDragStart = () => {
    isDraggingRef.current = true;
    updateActiveBucket(null);
  };

  const handleOnDragEnd = (result) => {
    isDraggingRef.current = false;

    const destinationBucketId =
      activeBucketRef.current ||
      getBucketIdAtPoint(
        pointerPositionRef.current.x,
        pointerPositionRef.current.y
      ) ||
      getBucketIdForDraggedItem();

    updateActiveBucket(null);

    if (!destinationBucketId) return;

    setErrorMessage("");
    const { source } = result;

    if (source.droppableId === "image") {
      const draggedIndex = currentImageIndex;

      // Update bucket results
      const newBucketResults = {
        ...bucketResults,
        [destinationBucketId]: [
          ...(bucketResults[destinationBucketId] || []),
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

  useEffect(() => {
    setDragDropImageLength(images.length);

    return () => {};
  }, [images, setDragDropImageLength]);

  const resetDragAndDrop = () => {
    setBucketResults({
      orange: [],
      pink: [],
      red: [],
    });
    setCurrentImageIndex(0);
    setCurrentImageIndex1(0);
    setErrorMessage("");
    setAnswers((prevAnswers) =>
      prevAnswers.filter((answer) => answer.stepId !== 2)
    );
  };

  const renderDragItem = () => {
    if (currentImageIndex >= images.length || allImagesDropped) return null;

    const imagePath = dragImages[currentImageIndex];

    return (
      <Draggable
        draggableId={`image-${currentImageIndex}`}
        index={0}
        isDragDisabled={allImagesDropped}
      >
        {(provided, snapshot) => (
          <div
            ref={(element) => {
              provided.innerRef(element);
              dragItemRef.current = element;
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              cursor: allImagesDropped
                ? "not-allowed"
                : snapshot.isDragging
                ? "grabbing"
                : "grab",
              opacity: allImagesDropped || snapshot.isDropAnimating ? 0 : 1,
              transform: provided.draggableProps.style?.transform,
              transitionDuration: snapshot.isDropAnimating ? "0.001s" : undefined,
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
        onDragEnd={handleOnDragEnd}
      >
        <div className="row custom-border-20 w-100 m-0">
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
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Right Buckets (50%) */}
          <div className="col-12 col-md-6 bg-blue px-4 py-3">
            <div className="d-flex align-items-start mb-2">
              <img src={ArrowTrail} alt="arrow trail" className="arrow-head" />
              <div className="text-center text-white pt-1 flex-grow-1">
                <h1 className="fs-3">{instruction}</h1>
              </div>
              <img
                src={ArrowTrail}
                alt="arrow trail"
                className="arrow-head arrow-tail"
              />
            </div>

            <div className="d-flex justify-content-around align-items-center flex-wrap transition2-week3-dnd-bucket-row">
              {buckets &&
                buckets.map((bucket) => (
                  <Droppable key={bucket.title} droppableId={bucket.id}>
                    {(provided) => (
                      <div
                        className={`pt-1 transition2-week3-dnd-bucket-cell ${
                          activeBucketId === bucket.id
                            ? "transition2-week3-dnd-bucket-cell-active"
                            : ""
                        }`}
                      >
                        <h2
                          className={`text-nowrap text-gray transition2-week3-budget-count ${
                            bucket.id === "pink"
                              ? "pink-count"
                              : bucket.id === "orange"
                              ? "orange-count"
                              : "red-count"
                          }`}
                        >
                          {bucketResults[bucket.id]?.length || 0}
                        </h2>
                        <div className="transition2-week3-bucket-drop-target">
                          <div
                            ref={(element) => {
                              provided.innerRef(element);
                              if (element) {
                                bucketRefs.current[bucket.id] = element;
                              } else {
                                delete bucketRefs.current[bucket.id];
                              }
                            }}
                            {...provided.droppableProps}
                            className={
                              `${
                                bucket.id === "pink"
                                  ? "pink-dark-bucket"
                                  : bucket.id === "orange"
                                  ? "yellow-dark-bucket"
                                  : "red-dark-bucket"
                              } bucket-text transition2-week3-bucket-droppable ${
                                activeBucketId === bucket.id
                                  ? "transition2-week3-bucket-droppable-active"
                                  : ""
                              }`
                            }
                          >
                            <div>
                              <p className="text-center  bg-gray-rectangle">
                                {bucket.title}
                              </p>
                              <p className="text-center">{bucket.amount}</p>
                            </div>
                            <div className="transition2-week3-dnd-placeholder">
                              {provided.placeholder}
                            </div>
                          </div>
                        </div>
                        <span className="transition2-week3-column-overlay" />
                      </div>
                    )}
                  </Droppable>
                ))}
            </div>
          </div>
        </div>
      </DragDropContext>
      <p
        className="fs-5 d-flex justify-content-center gap-3 align-items-center mt-3 fs-2"
        onClick={resetDragAndDrop}
        style={{ cursor: "pointer" }}
      >
        <Icon className="ml-3" icon="teenyicons:refresh-solid" />
        Refresh
      </p>
    </>
  );
};

export default DragAndDropFrame;
