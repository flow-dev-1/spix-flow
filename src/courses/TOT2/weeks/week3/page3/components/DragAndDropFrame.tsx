import React, { useState, useEffect } from "react";

const dragImages = import.meta.glob(
  "/src/assets/drag-images/tot-2-drag-images/week3/page3/*.png",
  { eager: true, import: "default" }
);
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardBoard from "./CardBoard";
import ArrowTrail from "@/assets/ArrowTrail.svg";

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
    orange: [],
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!answers?.length) return;

    const existingAnswer = answers.find((answer) => answer.stepId === 2);
    if (existingAnswer?.value) {
      setBucketResults({
        green: existingAnswer.value.green || [],
        orange: existingAnswer.value.orange || [],
      });

      // Update currentImageIndex based on total dropped items
      const totalDropped =
        (existingAnswer.value.green?.length || 0) +
        (existingAnswer.value.orange?.length || 0);
      setCurrentImageIndex(totalDropped);
      setCurrentImageIndex1(totalDropped);
    }
  }, [answers]);

  const totalDropped = Object.values(bucketResults).reduce(
    (sum, arr) => sum + arr.length,
    0,
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
          (answer) => answer.stepId === 2,
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
        prevIndex + 1 < images.length ? prevIndex + 1 : prevIndex,
      );
      setCurrentImageIndex1((prevIndex) =>
        prevIndex + 1 < images.length ? prevIndex + 1 : prevIndex,
      );
    }
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

  const renderDragItem = () => {
    if (currentImageIndex >= images.length || allImagesDropped) return null;

    const imagePath = dragImages[`/src/assets/drag-images/tot-2-drag-images/week3/page3/image${currentImageIndex + 1}.png`] as string;

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
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div
          className="row custom-border-20 w-100 m-0 dnd-row-fixed"
          style={{ overflow: "hidden" }}
        >
          {/* Left Droppable (50%) */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4" >
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
          <div className="col-12 col-md-6 bg-blue dnd-buckets-col">
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

            <div className="d-flex justify-content-around align-items-center flex-nowrap" style={{ minHeight: "160px", overflow: "hidden" }}>
              {buckets &&
                buckets.map((bucket) => (
                  <Droppable key={bucket.title} droppableId={bucket.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        className="pt-1 draggable-bucket"
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
                              ? "green-cube bucket-text"
                              : bucket.id === "orange"
                                ? "orange-cube bucket-text"
                                : "red-cube bucket-text"
                          }
                          style={{
                            outline: snapshot.isDraggingOver
                              ? "3px solid #fff"
                              : "none",
                            outlineOffset: "-3px",
                            transition: "outline 0.15s ease",
                          }}
                        >
                          <p
                            className="text-center"
                            style={{ fontSize: "12px" }}
                          >
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
