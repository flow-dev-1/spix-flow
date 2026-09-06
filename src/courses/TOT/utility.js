export const calculateScore = (questions = [], answers = [], totalSteps = questions.length) => {
    const raw = questions.reduce((score, question) => {
        const answer = answers?.find((item) => item.id === question.id);
        return answer && question.correctOption === answer.value ? score + 1 : score;
    }, 0);
    const max = Number(totalSteps) || 0;
    const percentage = max ? parseFloat(((raw / max) * 100).toFixed(1)) : 0;

    return { raw, min: 0, max, scaled: percentage / 100, percentage };
};

export const calculateResult = (questions, answers, totalSteps) =>
    calculateScore(questions, answers, totalSteps).percentage;