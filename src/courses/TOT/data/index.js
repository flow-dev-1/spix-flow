// Import both our data sources
import { courseContent } from "./activity";
import { assessments } from "./assessment";
import { pre_assessments } from "./pre-assessment";

// Gets course content for specific week and page
const getPageContent = (weekNumber, pageNumber) => {
  try {
    // Get week key (e.g., "week1")
    const weekKey = `week${weekNumber}`;

    // Check if week exists
    if (!courseContent[weekKey]) {
      return null;
    }

    // Find page by ID
    const page = courseContent[weekKey].pages.find(
      (page) => page.id === pageNumber
    );

    return page || null;
  } catch (error) {
    console.error("Error getting page content:", error);
    return null;
  }
};

// Gets assessment data for specific week
const getWeekAssessment = (weekNumber) => {
  try {
    // Get week key (e.g., "week1")
    const weekKey = `week${weekNumber}`;

    // Check if week exists in assessments
    if (!assessments[weekKey]) {
      return null;
    }

    return {
      title: assessments[weekKey].title,
      subtitle: assessments[weekKey].subtitle,
      questions: assessments[weekKey].questions,
      totalQuestions: assessments[weekKey].questions.length,
    };
  } catch (error) {
    console.error("Error getting assessment data:", error);
    return null;
  }
};

// Gets assessment data for specific week
const getWeekPreAssessment = (weekNumber) => {
  try {
    // Get week key (e.g., "week1")
    const weekKey = `week${weekNumber}`;

    // Check if week exists in assessments
    if (!pre_assessments[weekKey]) {
      return null;
    }

    return {
      title: pre_assessments[weekKey].title,
      subtitle: pre_assessments[weekKey].subtitle,
      questions: pre_assessments[weekKey].questions,
      totalQuestions: pre_assessments[weekKey].questions.length,
    };
  } catch (error) {
    console.error("Error getting assessment data:", error);
    return null;
  }
};


// Gets total pages for a specific week
export const getTotalPagesForWeek = (weekNumber) => {
  const weekKey = `week${weekNumber}`;
  return courseContent[weekKey]?.pages?.length || 0;
};

// Gets content for a specific week excluding video pages
const getWeekContentExcludingVideos = (weekNumber) => {
  const weekKey = `week${weekNumber}`;
  const weekData = courseContent[weekKey];

  if (!weekData) {
    return null; // Week does not exist
  }

  // Filter out pages of type "video"
  const filteredPages = weekData.pages.filter((page) => page.type !== "video");

  return {
    pages: filteredPages,
  };
};

export { getPageContent, getWeekAssessment, getWeekContentExcludingVideos, getWeekPreAssessment };
export default getPageContent;
