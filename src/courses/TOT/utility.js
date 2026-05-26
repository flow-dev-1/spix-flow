export const calculateResult = (questions, answers,totalSteps) => {
    let score = 0;
    questions.forEach((q) => {
        const answer = answers?.find((a) => a.id === q.id);
        if (answer && q.correctOption === answer.value) {
            score += 1;
        }
    });
    // Calculate percentage score
    const percentageScore = ((score / totalSteps) * 100).toFixed(1);
    return parseFloat(percentageScore);

}