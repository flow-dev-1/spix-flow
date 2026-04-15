for videos

dispatch(updateVideoStatus({ week: 1, page: 1, isCompleted: true }));

For text input pages:
dispatch(updateTextInput({
  week: 1,
  page: 2,
  questions: [
    { id: 1, question: "...", response: "user's answer" }
  ]
}));



dnd

dispatch(updateDragAndDrop({
  week: 4,
  page: 6,
  items: [
    { draggedItem: "item1", droppedTo: "target1" }
  ]
}));


assesment 

dispatch(updateAssessment({
  week: 1,
  questions: [
    { id: 1, question: "...", selectedAnswer: "B" }
  ]
}));



