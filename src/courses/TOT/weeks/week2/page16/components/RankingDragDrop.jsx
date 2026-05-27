import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../page12.css";

function RankingDragDrop({
  step,
  currentStep,
  answers,
  setAnswers,
  setErrorMessage,
}) {
  const [rankings, setRankings] = useState({});
  const [availableResponses, setAvailableResponses] = useState(step.responses);
  const [activeDropId, setActiveDropId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const activeDropRef = useRef(null);

  const stepKey = `step_${currentStep}`;

  useEffect(() => {
    // Load existing rankings if any
    if (answers[stepKey]?.rankings) {
      setRankings(answers[stepKey].rankings);

      // Update available responses
      const placedResponseIds = Object.values(answers[stepKey].rankings);
      const remaining = step.responses.filter(
        (resp) => !placedResponseIds.includes(resp.id)
      );
      setAvailableResponses(remaining);
    } else {
      setAvailableResponses(step.responses);
      setRankings({});
    }
  }, [answers, stepKey, step.responses]);

  const getTrackedDestination = (destination) => {
    if (activeDropRef.current) {
      return {
        droppableId: activeDropRef.current,
        index: 0,
      };
    }
    return destination;
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    const trackedDestination = getTrackedDestination(destination);

    setIsDragging(false);
    setActiveDropId(null);
    activeDropRef.current = null;

    if (!trackedDestination) return;

    // If dropped in the same place, do nothing
    if (
      source.droppableId === trackedDestination.droppableId &&
      source.index === trackedDestination.index
    ) {
      return;
    }

    setErrorMessage("");

    // Dragging from responses back to responses is a no-op.
    if (
      source.droppableId === "responses" &&
      trackedDestination.droppableId === "responses"
    ) {
      return;
    }

    // Dragging from responses to ranking slot
    if (
      source.droppableId === "responses" &&
      trackedDestination.droppableId.startsWith("rank_")
    ) {
      const responseId = result.draggableId;
      const targetRank = parseInt(
        trackedDestination.droppableId.replace("rank_", "")
      );

      // Check if slot already has an item
      if (rankings[targetRank]) {
        // Return the existing item to available responses
        const existingResponseId = rankings[targetRank];
        const existingResponse = step.responses.find(
          (r) => r.id === existingResponseId
        );
        setAvailableResponses((prev) => [...prev, existingResponse]);
      }

      // Update rankings
      const newRankings = {
        ...rankings,
        [targetRank]: responseId,
      };
      setRankings(newRankings);

      // Remove from available responses
      setAvailableResponses((prev) => prev.filter((r) => r.id !== responseId));

      // Save to answers
      setAnswers((prev) => ({
        ...prev,
        [stepKey]: {
          rankings: newRankings,
        },
      }));
    }

    // Dragging from ranking slot back to responses (remove from ranking)
    if (
      source.droppableId.startsWith("rank_") &&
      trackedDestination.droppableId === "responses"
    ) {
      const sourceRank = parseInt(source.droppableId.replace("rank_", ""));
      const responseId = rankings[sourceRank];
      const response = step.responses.find((r) => r.id === responseId);

      console.log("response brought back", response);

      // Remove from rankings
      const newRankings = { ...rankings };
      delete newRankings[sourceRank];
      setRankings(newRankings);

      // Add back to available responses
      setAvailableResponses((prev) => [...prev, response]);

      // Save to answers
      setAnswers((prev) => ({
        ...prev,
        [stepKey]: {
          rankings: newRankings,
        },
      }));
    }

    //  Dragging from one ranking slot to another
    else if (source.droppableId.startsWith("rank_")) {
      const sourceRank = parseInt(source.droppableId.replace("rank_", ""));
      const targetRank = parseInt(
        trackedDestination.droppableId.replace("rank_", "")
      );

      if (sourceRank === targetRank) return;

      const sourceResponseId = rankings[sourceRank];
      const targetResponseId = rankings[targetRank];

      const newRankings = { ...rankings };

      if (targetResponseId) {
        // Swap
        newRankings[targetRank] = sourceResponseId;
        newRankings[sourceRank] = targetResponseId;
      } else {
        // Move
        newRankings[targetRank] = sourceResponseId;
        delete newRankings[sourceRank];
      }

      setRankings(newRankings);

      // Save to answers
      setAnswers((prev) => ({
        ...prev,
        [stepKey]: {
          rankings: newRankings,
        },
      }));
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setActiveDropId(null);
    activeDropRef.current = null;
  };

  const handleDragUpdate = (update) => {
    const destinationId = update.destination?.droppableId;
    if (!destinationId) return;
    activeDropRef.current = destinationId;
    setActiveDropId(destinationId);
  };

  const getResponseById = (id) => {
    return step.responses.find((r) => r.id === id);
  };

  useEffect(() => {
    if (!isDragging) return;

    const getPoint = (event) => {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      if (touch) {
        return { x: touch.clientX, y: touch.clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    const trackDropTarget = (event) => {
      const { x, y } = getPoint(event);
      const target = document
        .elementsFromPoint(x, y)
        .find((element) =>
          element.closest?.("[data-ranking-drop-id]")
        )
        ?.closest("[data-ranking-drop-id]");
      const dropId = target?.dataset?.rankingDropId || null;

      activeDropRef.current = dropId;
      setActiveDropId(dropId);
    };

    window.addEventListener("mousemove", trackDropTarget);
    window.addEventListener("touchmove", trackDropTarget, { passive: true });

    return () => {
      window.removeEventListener("mousemove", trackDropTarget);
      window.removeEventListener("touchmove", trackDropTarget);
    };
  }, [isDragging]);

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <div className="row custom-border-20 w-100 m-0 tot-week2-ranking-frame">
        {/* Left Side - Available Responses */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center p-4 ranking-responses-panel">
          <Droppable droppableId="responses">
            {(provided, snapshot) => (
              <div
                className="w-100 d-flex flex-column gap-3 ranking-responses-list"
                data-ranking-drop-id="responses"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  minHeight: "300px",
                  transition: "background-color 0.2s ease",
                  backgroundColor: snapshot.isDraggingOver
                    ? "rgba(255, 165, 0, 0.1)"
                    : "transparent",
                }}
              >
                {availableResponses.map((response, index) => (
                  <Draggable
                    key={response.id}
                    draggableId={response.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="response-card"
                        style={{
                          ...provided.draggableProps.style,
                          cursor: snapshot.isDragging ? "grabbing" : "grab",
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          // width: snapshot.isDragging ? "150px" : "100%",
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} scale(0.95)`
                            : provided.draggableProps.style?.transform,
                        }}
                      >
                        <p className="mb-0 text-white fw-bold fs-5 tot-week-2-question-text">
                          {response.text}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Right Side - Ranking Slots */}
        <div className="col-12 col-md-6 bg-blue p-4 ranking-slots-panel">
          <div className="ranking-grid">
            {/* Top Row: 4 and 3 */}
            <div className="ranking-row">
              {[4, 3].map((rank) => (
                <Droppable key={rank} droppableId={`rank_${rank}`}>
                  {(provided, snapshot) => (
                    (() => {
                      const isActiveDrop = activeDropId
                        ? activeDropId === `rank_${rank}`
                        : snapshot.isDraggingOver;

                      return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`ranking-slot ${
                        isActiveDrop ? "ranking-slot-active" : ""
                      }`}
                      data-ranking-drop-id={`rank_${rank}`}
                      style={{
                        backgroundColor: isActiveDrop
                          ? "rgba(255, 255, 255, 0.81)"
                          : "rgb(255, 255, 255)",
                      }}
                    >
                      <div className="rank-number">{rank}</div>
                      {rankings[rank] && (
                        <Draggable
                          draggableId={rankings[rank]}
                          index={0}
                          key={rankings[rank]}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="response-card-small"
                              style={{
                                ...provided.draggableProps.style,
                                cursor: snapshot.isDragging
                                  ? "grabbing"
                                  : "grab",
                              }}
                            >
                              <p className="mb-0 text-white fw-bold fs-6 tot-week-2-question-text">
                                {getResponseById(rankings[rank])?.text}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      )}
                      {provided.placeholder}
                    </div>
                      );
                    })()
                  )}
                </Droppable>
              ))}
            </div>

            {/* Bottom Row: 2 and 1 */}
            <div className="ranking-row">
              {[2, 1].map((rank) => (
                <Droppable key={rank} droppableId={`rank_${rank}`}>
                  {(provided, snapshot) => (
                    (() => {
                      const isActiveDrop = activeDropId
                        ? activeDropId === `rank_${rank}`
                        : snapshot.isDraggingOver;

                      return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`ranking-slot ${
                        isActiveDrop ? "ranking-slot-active" : ""
                      }`}
                      data-ranking-drop-id={`rank_${rank}`}
                      style={{
                        backgroundColor: isActiveDrop
                          ? "rgba(255, 255, 255, 0.81)"
                          : "rgb(255, 255, 255)",
                      }}
                    >
                      <div className="rank-number">{rank}</div>
                      {rankings[rank] && (
                        <Draggable
                          draggableId={rankings[rank]}
                          index={0}
                          key={rankings[rank]}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="response-card-small"
                              style={{
                                ...provided.draggableProps.style,
                                cursor: snapshot.isDragging
                                  ? "grabbing"
                                  : "grab",
                              }}
                            >
                              <p className="mb-0 text-white fw-bold fs-6 tot-week-2-question-text">
                                {getResponseById(rankings[rank])?.text}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      )}
                      {provided.placeholder}
                    </div>
                      );
                    })()
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default RankingDragDrop;
