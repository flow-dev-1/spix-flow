export const courseContent = {
  week1: {
    title: "Introduction to Resilience and Grit",
    pages: [
      {
        id: 1,
        type: "multiStep",
        title: "Write a letter to yourself.",
        steps: [
          {
            stepId: 1,
          },
          {
            stepId: 2,
          },
          {
            stepId: 3,
          },
          {
            stepId: 4,
          },
          {
            stepId: 5,
          },
          {
            stepId: 6,
          },
          {
            stepId: 7,
          },
          {
            stepId: 8,
          },
          {
            stepId: 9,
          },
          {
            stepId: 10,
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 2,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_1.mp4",
        hasNextButton: true,
      },
      {
        id: 3,
        type: "question",
        questionType: "text",
        question:
          "As a teacher, what would you say you think this course is all about?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "question",
        questionType: "text",
        question: `Type one word that comes to mind when you hear “Inclusive Classroom.”`,
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "question",
        question:
          "As a teacher, I’d love to hear your definition of these three words.",
        questions: [
          {
            type: "Inclusion",
          },
          {
            type: "Integration",
          },
          {
            type: "Segregation",
          },
        ],
        inputType: "text",
        inputPlaceholder: "Type your answer here",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            text: "Just to confirm that you really understand these three terms, you will be directed to an activity where you drag different statements into the correct category.",
          },
          {
            stepId: 2,
            type: "imageDragAndDrop",
            instruction:
              "Drag-and-drop the statements on the left into any of these boxes.",
            buckets: [
              {
                id: "green",
                title: "Integration",
              },
              {
                id: "red",
                title: "Segregation",
              },
              {
                id: "orange",
                title: "Inclusion",
              },
            ],
            images: [
              "Students with disabilities learn in separate classrooms",
              "Students with learning difficulties are placed in lower ability classes",
              "Students are separated based on academic ability",
              " Learners with disabilities attend special schools only",
              "Students with special needs sit in the same classroom but receive no additional support",
              "Students with learning difficulties must adapt to the normal teaching style",
              " All learners follow the same lesson without adjustments",
              "Students with disabilities attend the same school but rarely participate in activities",
              "All students learn together with the right support",
              "Teachers adjust lessons to meet different learning needs",
              "Students receive different resources to help them succeed",
              "Every learner participates in classroom activities",
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question:
              "Now, take a moment to reflect. Which model best describes your current classroom or school system?",
            options: [
              {
                id: "1",
                text: "Segregation",
              },
              {
                id: "2",
                text: "Integration",
              },
              {
                id: "3",
                text: "Inclusion",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "Based on your current understanding, do you think you have any learners with SEND (Special Educational Needs and Disabilities) in your classroom?",
            options: [
              {
                id: "1",
                text: "Yes.",
              },
              {
                id: "2",
                text: "No",
              },
              {
                id: "3",
                text: "I'm not sure",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 12,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 13,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Take a moment to look at these two profiles. For each learner, consider the 'Challenge' they face, and then choose the specific 'Supports' that will unlock their potential in your classroom.",
            ],
            options:
              "Competence, Confidence, Coping, Control, Character, Connections, and Contribution.",
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A student avoids reading out loud and struggles to follow written instructions. What might be the possible barrier?",
            options: [
              {
                id: "1",
                text: "Dyslexia",
              },
              {
                id: "2",
                text: "Visual Impairment",
              },
              {
                id: "3",
                text: "Hearing Impairment",
              },
              {
                id: "4",
                text: "Anxiety",
              },
            ],
            correctOption: "1",
            feedback:
              "Dyslexia affects how a learner processes written language, which can make reading tasks challenging.",
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question:
              "A student frequently leaves their seat, interrupts others, and struggles to stay focused during lessons. What might be the possible barrier?",
            options: [
              {
                id: "1",
                text: "ADHD",
              },
              {
                id: "2",
                text: "Dyslexia",
              },
              {
                id: "3",
                text: "Hearing Impairment",
              },
              {
                id: "4",
                text: "Physical Disability",
              },
            ],
            correctOption: "1",
            feedback:
              "ADHD can affect attention, impulse control, and activity levels, making it difficult for learners to remain focused during lessons.",
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `A student often misunderstands spoken instructions and frequently asks classmates what the teacher said. What might be the possible barrier?`,
            options: [
              {
                id: "1",
                text: "Hearing Impairment",
              },
              {
                id: "2",
                text: "Dyslexia",
              },
              {
                id: "3",
                text: "ADHD",
              },
              {
                id: "4",
                text: "Physical Disability",
              },
            ],
            correctOption: "1",
            feedback:
              "Hearing impairments can make it difficult for learners to clearly understand spoken instructions in the classroom.",
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question:
              "A student struggles to see what is written on the board and often squints or moves closer to read. What might be the possible barrier?",
            options: [
              {
                id: "1",
                text: "Visual Impairment",
              },
              {
                id: "2",
                text: "ADHD",
              },
              {
                id: "3",
                text: "Dyslexia",
              },
              {
                id: "4",
                text: "Anxiety",
              },
            ],
            correctOption: "1",
            feedback:
              "Visual impairments can affect a student’s ability to see written materials clearly.",
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question:
              "A student understands concepts when explained verbally but struggles significantly with writing tasks. What might be the possible barrier?",
            options: [
              {
                id: "1",
                text: "Dysgraphia",
              },
              {
                id: "2",
                text: "ADHD",
              },
              {
                id: "3",
                text: "Visual Impairment",
              },
              {
                id: "4",
                text: "Hearing Impairment",
              },
            ],
            correctOption: "1",
            feedback:
              "Dysgraphia affects a learner’s ability to write clearly and organize written expression.",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 14,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_7.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 15,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            text: "Read the sentence and answer the question that follows.",
          },
          {
            stepId: 2,
            type: "image",
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "How easy was this sentence to read?",
            options: [
              {
                id: "1",
                text: "Very easy.",
              },
              {
                id: "2",
                text: "A bit difficult",
              },
              {
                id: "3",
                text: "Difficult",
              },
              {
                id: "4",
                text: "Very Difficult",
              },
            ],
            feedback:
              "Many learners with dyslexia experience reading in this way every day. This is why inclusive teaching strategies are important. They help remove barriers so that every learner has a fair opportunity to succeed.",
          },

          {
            stepId: 4,
            type: "instruction",
            title: "Instruction",
            text: "Listen carefully and try to identify the correct instruction.",
          },
          {
            stepId: 5,
            type: "video",
            videoSrc:
              "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Cognitive+Overload.mp4",
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question: "What was the correct instruction?",
            options: [
              {
                id: "1",
                text: "Click the green button after the bell.",
              },
              {
                id: "2",
                text: "Select the blue icon immediately.",
              },
              {
                id: "3",
                text: "Wait five seconds then press red.",
              },
              {
                id: "4",
                text: "Press the red button twice immediately.",
              },
            ],
          },
          {
            stepId: 7,
            type: "dropdownScenario",
            question: "How easy was it to understand the instructions?",
            options: [
              {
                id: "1",
                text: "Very easy.",
              },
              {
                id: "2",
                text: "A bit difficult",
              },
              {
                id: "3",
                text: "Difficult",
              },
              {
                id: "4",
                text: "Very Difficult",
              },
            ],
            feedback:
              "For many learners, especially those with auditory processing difficulties or attention challenges, classrooms can feel like this every day. Clear instructions, visual supports, and calm learning environments can make a huge difference in helping every learner succeed.",
          },
          {
            stepId: 8,
            type: "instruction",
            title: "Instruction",
            text: "Below is a sequence of numbers required to solve the problem below. Click the  “PLAY” button to reveal the numbers.  \nNote: This is a view once sequence and visible for 5 seconds.",
            number: [7, 3, 9, 2, 6],
          },
          {
            stepId: 9,
            type: "dropdownScenario",
            question: "What was the number sequence shown earlier?",
            options: [
              {
                id: "1",
                text: "7 - 3 - 9 - 2 - 6",
              },
              {
                id: "2",
                text: "7 - 9 - 3 - 2 - 6",
              },
              {
                id: "3",
                text: "3 - 7 - 9 - 2 - 6",
              },
              {
                id: "4",
                text: "9 - 3 - 7 - 2 - 6",
              },
            ],
            feedback:
              "Many learners struggle with working memory, the ability to hold and process information at the same time. Breaking instructions into smaller steps and using visual reminders can support learners who find tasks like this challenging.",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 16,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_8.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 17,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            text: "Drag each statement into the correct category.",
          },
          {
            stepId: 2,
            type: "imageDragAndDrop",
            instruction:
              "Drag-and-drop the statements on the left into any of these boxes.",
            buckets: [
              {
                id: "green",
                title: "Equality",
              },
              {
                id: "orange",
                title: "Equity",
              },
            ],
            images: [
              "All students receive the same worksheet",
              "All students take the same test with identical instructions",
              "All learners are given the same amount of time to complete tasks",
              "Every student receives the same textbook",
              "All students follow the same teaching method",
              "Every learner completes the same assignment in the same way",
              "A dyslexic learner receives an audiobook version of a text",
              "A student with mobility challenges sits closer to the classroom door",
              "A learner receives extra time to complete an assessment",
              "A student uses visual aids to support understanding",
              "A learner receives simplified instructions for a task",
              "A student uses assistive technology to complete their work",
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 18,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+1/Week+1_9.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week2: {
    title: "Developing Resilience",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+2/Week+2_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "multiStep",
        title: "Write a letter to yourself.",
        steps: [
          {
            stepId: 1,
            type: "question",
            questionType: "text",
            question:
              "In one word, describe how you want your SEND learners to feel when they walk through your classroom door.",
            hasImage: false,
            imageSrc: "mindset.png",
            inputType: "bigTextBox",
            feedback: [
              "Every child deserves to feel safe, valued, and capable. ",
              "Creating that environment begins with the mindset teachers bring into the classroom.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "Think about your classroom for a moment. When a learner struggles or behaves in a challenging way, what is usually your first reaction?",
            options: [
              {
                id: "1",
                text: "I try to understand what the learner might be experiencing",
              },
              {
                id: "2",
                text: "I focus on correcting the behaviour quickly",
              },
              {
                id: "3",
                text: "I feel unsure about how to respond",
              },
              {
                id: "4",
                text: "I try to support the learner but sometimes feel frustrated",
              },
            ],
            feedback: [
              "Segregation refers to the physical separation of learners with disabilities from mainstream classrooms, often placing them in separate schools or units.",
              "Integration involves placing learners with disabilities in mainstream classrooms without necessarily adapting the curriculum or teaching methods to meet their specific needs.",
              "Inclusion is an approach that ensures all learners, regardless of ability, are fully integrated into the classroom with appropriate support and accommodations to enable their participation and success.",
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+2/Week+2_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },

      {
        id: 4,
        type: "multiStep",
        title: "Write a letter to yourself.",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            challenge:
              "As teachers, we sometimes make quick judgments about learners before fully understanding what they are experiencing. Think about the situations below. Which of these reactions have you noticed in yourself at least once?",
          },
          {
            stepId: 2,
            type: "checkbox",
            question:
              "Which of these reactions have you noticed in yourself at least once?",
            options: [
              "I have assumed a learner was being lazy when they struggled to complete work.",
              "I have thought a learner was being disrespectful when they avoided participating.",
              "I have assumed a quiet learner was doing fine without checking in.",
              "I have felt frustrated when a learner repeatedly interrupted the lesson.",
              "I have focused more attention on confident learners than quieter ones.",
              "I try to pause and understand what might be happening before reacting.",
            ],
            feedback:
              "Quick judgments are a natural human response, especially in busy classrooms. Inclusive teaching begins when we become aware of these reactions and choose to pause before responding. When teachers shift from judging behaviour to understanding behaviour, they create a classroom where learners feel safer and more supported.",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+2/Week+2_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Let’s practice shifting our lens. You will see short scenarios involving SEND learners. Your task is to look beyond the challenge and identify the underlying strength being displayed.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A learner with ADHD asks many detailed questions about a topic during class.",
            options: [
              {
                id: "1",
                text: "Deep Curiosity and engagement.",
              },
              {
                id: "2",
                text: "Disruptive behaviour",
              },
              {
                id: "3",
                text: "Lack of focus",
              },
              {
                id: "4",
                text: "Attention seeking",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question:
              "A learner who struggles with writing spends time building detailed structures with classroom materials.",
            options: [
              {
                id: "1",
                text: "Creativity and spatial thinking",
              },
              {
                id: "2",
                text: "Avoiding work",
              },
              {
                id: "3",
                text: "Lack of interest in class",
              },
              {
                id: "4",
                text: "Poor organization",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `A learner who struggles with sitting still frequently helps classmates pick up materials.`,
            options: [
              {
                id: "1",
                text: "Empathy and helping behaviour",
              },
              {
                id: "2",
                text: "Avoiding tasks",
              },
              {
                id: "3",
                text: "Seeking attention",
              },
              {
                id: "4",
                text: "Lack of discipline",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question:
              "A learner who finds writing difficult continues working long after others have finished.",
            options: [
              {
                id: "1",
                text: "Persistence and determination",
              },
              {
                id: "2",
                text: "Slow learning",
              },
              {
                id: "3",
                text: "Poor time management",
              },
              {
                id: "4",
                text: "Low confidence",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+2/Week+2_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Identify whether the teacher response demonstrates Empathy or Compassion.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A teacher pauses to understand why a learner is overwhelmed before responding.",
            options: [
              {
                id: "1",
                text: "Empathy",
              },
              {
                id: "2",
                text: "Compassion",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question:
              "A teacher allows a learner to move to a quiet space when they feel overwhelmed.",
            options: [
              {
                id: "1",
                text: "Empathy",
              },
              {
                id: "2",
                text: "Compassion",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `A teacher recognizes that a learner’s frustration may come from difficulty understanding instructions.`,
            options: [
              {
                id: "1",
                text: "Empathy",
              },
              {
                id: "2",
                text: "Compassion",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question:
              "A teacher offers simplified instructions and additional guidance.",
            options: [
              {
                id: "1",
                text: "Empathy",
              },
              {
                id: "2",
                text: "Compassion",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+2/Week+2_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "A learner covers their ears during noisy group work. What might the learner need?",
            options: [
              {
                id: "1",
                text: "Sensory sensitivity",
              },
              {
                id: "2",
                text: "A quieter learning space",
              },
              {
                id: "3",
                text: "Lack of interest in the activity",
              },
              {
                id: "4",
                text: "Poor behaviour",
              },
              {
                id: "5",
                text: "Attention seeking",
              },
            ],
            correctOption: "1",
            feedback:
              "Some learners experience sensory sensitivity to noise or busy environments. Providing a quieter space or reducing sensory overload can help them participate more comfortably.",
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A learner suddenly refuses to begin a difficult assignment. What might the learner need?",
            options: [
              {
                id: "1",
                text: "Cognitive overload",
              },
              {
                id: "2",
                text: "The task may feel too difficult",
              },
              {
                id: "3",
                text: "Disobedience",
              },
              {
                id: "4",
                text: "Laziness",
              },
              {
                id: "5",
                text: "Distraction",
              },
            ],
            correctOption: "1",
            feedback:
              "When tasks feel overwhelming, some learners may shut down or avoid starting. Breaking the task into smaller steps or offering support can help reduce cognitive overload.",
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: `A learner becomes upset when the classroom routine changes. What might the learner need?`,
            options: [
              {
                id: "1",
                text: "Need for predictability or structure",
              },
              {
                id: "2",
                text: "Advance warning about changes",
              },
              {
                id: "3",
                text: "Lack of discipline",
              },
              {
                id: "4",
                text: "Disinterest in the lesson",
              },
              {
                id: "5",
                text: "Peer conflict",
              },
            ],
            correctOption: "1",
            feedback:
              "Many learners feel safer and more comfortable when routines are predictable. Giving advance notice about changes can help them adjust more easily.",
          },
          {
            stepId: 4,
            type: "question",
            questionType: "text",
            question:
              "What is one change you will make in how you respond to challenging behaviour in your classroom?",
            hasImage: false,
            imageSrc: "mindset.png",
            inputType: "bigTextBox",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+2/Week+2_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week3: {
    title: "Understanding the Concept of Adaptability and Its Application",
    pages: [
      {
        id: 1,
        type: "question",
        question:
          "Quick question, when you plan a lesson, what usually comes first for you?",
        options: [
          {
            id: "A",
            text: "The content to cover",
          },
          {
            id: "B",
            text: "The learners",
          },
          {
            id: "C",
            text: "The assessment",
          },
          {
            id: "D",
            text: "The time available ",
          },
        ],
        correctOption: "B",
      },
      {
        id: 2,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+3/Week+3_1.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            text: "Drag each statement into the correct category.",
          },
          {
            stepId: 2,
            type: "imageDragAndDrop",
            instruction:
              "Drag-and-drop the statements on the left into any of these boxes.",
            buckets: [
              {
                id: "green",
                title: "Learning Barrier",
              },
              {
                id: "orange",
                title: "Learner Variability",
              },
            ],
            images: [
              "A lesson relies only on long written texts",
              "A learner needs extra time to process information",
              "A test only allows written answers",
              "A student prefers visual diagrams to understand concepts",
              "Instructions are given only verbally",
              "A learner needs short learning breaks to stay focused",
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+3/Week+3_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question: "Based on your knowledge, what does UDL stand for?",
            options: [
              {
                id: "1",
                text: "Universal Design for Learning",
              },
              {
                id: "2",
                text: "Unified Development Learning",
              },
              {
                id: "3",
                text: "Understanding Diverse Learners",
              },
              {
                id: "4",
                text: "Universal Development Lessons",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+3/Week+3_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Select the most preferable solution to the scenario challenges displayed.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A learner with ADHD begins to lose focus during a long lecture.",
            options: [
              {
                id: "1",
                text: "Continue teaching and expect the learner to adapt",
              },
              {
                id: "2",
                text: "Add short activities or movement breaks",
              },
              {
                id: "3",
                text: "Ask the learner to copy more notes",
              },
              {
                id: "4",
                text: "Ignore the behaviour",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question:
              "A learner becomes anxious when classroom routines suddenly change.",
            options: [
              {
                id: "1",
                text: "Provide advance notice of changes",
              },
              {
                id: "2",
                text: "Tell the learner to calm down",
              },
              {
                id: "3",
                text: "Ignore the anxiety",
              },
              {
                id: "4",
                text: "Remove the learner from the class",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `A learner struggles to stay motivated during long individual tasks.`,
            options: [
              {
                id: "1",
                text: "Introduce small task checkpoints",
              },
              {
                id: "2",
                text: "Extend the task time",
              },
              {
                id: "3",
                text: "Remove the learner from the activity",
              },
              {
                id: "4",
                text: "Ask the learner to complete extra work",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question: "A learner loses attention during teacher explanations.",
            options: [
              {
                id: "1",
                text: "Use visuals or interactive discussion",
              },
              {
                id: "2",
                text: "Repeat the lecture",
              },
              {
                id: "3",
                text: "Assign more notes",
              },
              {
                id: "4",
                text: "Move the learner to the back",
              },
            ],
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question: "A learner works better when collaborating with others.",
            options: [
              {
                id: "1",
                text: "Offer group work options",
              },
              {
                id: "2",
                text: " Force independent work",
              },
              {
                id: "3",
                text: "Reduce the difficulty of the task",
              },
              {
                id: "4",
                text: "Remove collaboration entirely",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+3/Week+3_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Select the teaching method to the learner who may benefit most.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question: "Audio explanation",
            options: [
              {
                id: "1",
                text: "Dyslexia",
              },
              {
                id: "2",
                text: "ADHD",
              },
              {
                id: "3",
                text: "Intellectual disability",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "Visual diagrams",
            options: [
              {
                id: "1",
                text: "Dyslexia",
              },
              {
                id: "2",
                text: "ADHD",
              },
              {
                id: "3",
                text: "Intellectual disability",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `Short learning chunks`,
            options: [
              {
                id: "1",
                text: "Dyslexia",
              },
              {
                id: "2",
                text: "ADHD",
              },
              {
                id: "3",
                text: "Intellectual disability",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+3/Week+3_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Select the most preferable solution to the scenario challenges displayed.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A student understands a science concept but struggles with writing.",
            options: [
              {
                id: "1",
                text: "A long written essay",
              },
              {
                id: "2",
                text: "An oral explanation",
              },
              {
                id: "3",
                text: "A silent timed test",
              },
              {
                id: "4",
                text: "Copying from the board",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "A learner with anxiety struggles during timed tests.",
            options: [
              {
                id: "1",
                text: "Allow flexible timing",
              },
              {
                id: "2",
                text: "Increase test pressure",
              },
              {
                id: "3",
                text: "Remove the assessment",
              },
              {
                id: "4",
                text: "Ignore the anxiety",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `A learner understands a concept but struggles with written explanations.`,
            options: [
              {
                id: "1",
                text: "Allow visual diagrams or models",
              },
              {
                id: "2",
                text: "Require longer written responses",
              },
              {
                id: "3",
                text: "Reduce the learning objective",
              },
              {
                id: "4",
                text: "Remove the learner from the task",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question:
              "A learner finds written instructions difficult to understand.",
            options: [
              {
                id: "1",
                text: "Provide verbal explanation and examples",
              },
              {
                id: "2",
                text: "Repeat the written instructions",
              },
              {
                id: "3",
                text: "Reduce the task difficulty",
              },
              {
                id: "4",
                text: "Remove the learner from the lesson",
              },
            ],
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question:
              "A learner shows strong understanding when speaking but struggles with writing.",
            options: [
              {
                id: "1",
                text: "Allow oral presentations",
              },
              {
                id: "2",
                text: "Force written responses",
              },
              {
                id: "3",
                text: "Lower expectations",
              },
              {
                id: "4",
                text: "Skip the assessment",
              },
            ],
          },
          {
            stepId: 7,
            type: "instruction",
            title: "Instruction",
            instructions: ["Match each principle to its meaning."],
          },
          {
            stepId: 8,
            type: "dropdownScenario",
            question: "How learners stay motivated",
            options: [
              {
                id: "1",
                text: "Engagement",
              },
              {
                id: "2",
                text: "Representation",
              },
              {
                id: "3",
                text: "Action and Expression",
              },
            ],
          },
          {
            stepId: 9,
            type: "dropdownScenario",
            question: "How information is presented",
            options: [
              {
                id: "1",
                text: "Engagement",
              },
              {
                id: "2",
                text: "Representation",
              },
              {
                id: "3",
                text: "Action and Expression",
              },
            ],
          },
          {
            stepId: 10,
            type: "dropdownScenario",
            question: "How learners show what they know",
            options: [
              {
                id: "1",
                text: "Engagement",
              },
              {
                id: "2",
                text: "Representation",
              },
              {
                id: "3",
                text: "Action and Expression",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 12,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+3/Week+3_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week4: {
    title: "The Role of Support Systems",
    pages: [
      {
        id: 1,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "When a learner displays challenging behaviour, what is your first instinct?",
            options: [
              {
                id: "1",
                text: "Correct the behaviour immediately",
              },
              {
                id: "2",
                text: "Ask the learner what might be wrong",
              },
              {
                id: "3",
                text: "Ignore the behaviour",
              },
              {
                id: "4",
                text: "Feel unsure how to respond",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 2,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+4/Week+4_1.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Match the behaviour to the most likely underlying need.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question: "Learner refuses to read aloud",
            options: [
              {
                id: "1",
                text: "Reading difficulty",
              },
              {
                id: "2",
                text: "Attention regulation difficulty",
              },
              {
                id: "3",
                text: "Cognitive overload",
              },
              {
                id: "4",
                text: "Difficulty with transitions",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "Learner constantly leaves their seat",
            options: [
              {
                id: "1",
                text: "Reading difficulty",
              },
              {
                id: "2",
                text: "Attention regulation difficulty",
              },
              {
                id: "3",
                text: "Cognitive overload",
              },
              {
                id: "4",
                text: "Difficulty with transitions",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `Learner shuts down during complex tasks`,
            options: [
              {
                id: "1",
                text: "Reading difficulty",
              },
              {
                id: "2",
                text: "Attention regulation difficulty",
              },
              {
                id: "3",
                text: "Cognitive overload",
              },
              {
                id: "4",
                text: "Difficulty with transitions",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question: `Learner becomes distressed when routines change`,
            options: [
              {
                id: "1",
                text: "Reading difficulty",
              },
              {
                id: "2",
                text: "Attention regulation difficulty",
              },
              {
                id: "3",
                text: "Cognitive overload",
              },
              {
                id: "4",
                text: "Difficulty with transitions",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+4/Week+4_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "A learner becomes overwhelmed during a difficult maths task and refuses to continue working. What is the most supportive teacher response?",
            options: [
              {
                id: "1",
                text: "Tell the learner to finish the task immediately",
              },
              {
                id: "2",
                text: "Break the task into smaller steps",
              },
              {
                id: "3",
                text: "Send the learner out of class",
              },
              {
                id: "4",
                text: "Ignore the situation",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },

      {
        id: 6,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+4/Week+4_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "A learner becomes very distressed when the classroom routine suddenly changes. What is the most helpful teacher response?",
            options: [
              {
                id: "1",
                text: "Provide advance warning before schedule changes",
              },
              {
                id: "2",
                text: "Tell the learner to stop reacting",
              },
              {
                id: "3",
                text: "Ignore the distress",
              },
              {
                id: "4",
                text: "Remove the learner from the classroom",
              },
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A learner with autism becomes overwhelmed during a noisy group activity. What should the teacher do first?",
            options: [
              {
                id: "1",
                text: "Reduce noise and speak calmly",
              },
              {
                id: "2",
                text: "Raise their voice to regain control",
              },
              {
                id: "3",
                text: "Punish the behaviour",
              },
              {
                id: "4",
                text: "Ignore the learner",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+4/Week+4_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "A student with ADHD frequently leaves their seat during lessons. Which strategy is most supportive?",
            options: [
              {
                id: "1",
                text: "Punish the student",
              },
              {
                id: "2",
                text: "Allow structured movement breaks",
              },
              {
                id: "3",
                text: "Ignore the behaviour",
              },
              {
                id: "4",
                text: "Remove the student from class",
              },
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question: `A teacher says to a learner with ADHD: "Why can't you just sit still like everyone else?" What is the problem with this response?`,
            options: [
              {
                id: "1",
                text: "It ignores the learner's regulation difficulty",
              },
              {
                id: "2",
                text: "The learner should try harder",
              },
              {
                id: "3",
                text: "The class should wait longer",
              },
              {
                id: "4",
                text: "The teacher should assign extra homework",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+4/Week+4_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "A learner understands the lesson but struggles to read the worksheet. What is the most supportive response?",
            options: [
              {
                id: "1",
                text: "Offer an audio version of the text",
              },
              {
                id: "2",
                text: "Ask the learner to read faster",
              },
              {
                id: "3",
                text: "Reduce the learning objective",
              },
              {
                id: "4",
                text: "Remove the learner from the task",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 12,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+4/Week+4_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 13,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question: "Reduce handwriting strain",
            options: [
              {
                id: "1",
                text: "Allow typing",
              },
              {
                id: "2",
                text: "Oral responses",
              },
              {
                id: "3",
                text: "Graphic organisers",
              },
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question: "Allow expression of understanding",
            options: [
              {
                id: "1",
                text: "Allow typing",
              },
              {
                id: "2",
                text: "Oral responses",
              },
              {
                id: "3",
                text: "Graphic organisers",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "Support idea organisation",
            options: [
              {
                id: "1",
                text: "Allow typing",
              },
              {
                id: "2",
                text: "Oral responses",
              },
              {
                id: "3",
                text: "Graphic organisers",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question:
              "A learner becomes frustrated during a writing task and refuses to continue. What is the most inclusive response?",
            options: [
              {
                id: "1",
                text: "Allow an alternative way to show understanding",
              },
              {
                id: "2",
                text: "Force the learner to finish writing",
              },
              {
                id: "3",
                text: "Remove the learner from the lesson",
              },
              {
                id: "4",
                text: "Ignore the behaviour",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week5: {
    title: "Coping Skills",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "Who plays the most important role in supporting a learner with special needs?",
            options: [
              {
                id: "1",
                text: "The teacher",
              },
              {
                id: "2",
                text: "The parents or caregivers",
              },
              {
                id: "3",
                text: "School leadership",
              },
              {
                id: "4",
                text: "A team effort between all of them",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Match the less effective statement with the more supportive alternative.",
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "Let's think together about how we can support your child.",
            options: [
              {
                id: "1",
                text: "Your child needs to behave better.",
              },
              {
                id: "2",
                text: "Your child struggles with everything.",
              },
              {
                id: "3",
                text: "You need to help your child more.",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "I’ve noticed a few areas where we can support learning.",
            options: [
              {
                id: "1",
                text: "Your child needs to behave better.",
              },
              {
                id: "2",
                text: "Your child struggles with everything.",
              },
              {
                id: "3",
                text: "You need to help your child more.",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `We can work together to support learning at home and school.`,
            options: [
              {
                id: "1",
                text: "Your child needs to behave better.",
              },
              {
                id: "2",
                text: "Your child struggles with everything.",
              },
              {
                id: "3",
                text: "You need to help your child more.",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "A student keeps interrupting the class while you are teaching. What is the most effective response?",
            options: [
              {
                id: "1",
                text: "Stop talking right now or you’ll be sent out.",
              },
              {
                id: "2",
                text: "Ignore the student completely and continue teaching.",
              },
              {
                id: "3",
                text: "Why are you always disrupting the class?",
              },
              {
                id: "4",
                text: "Pause and calmly say, “Let’s remember our class agreement about listening while others speak.",
              },
              {
                id: "5",
                text: "Tell the student they are being disrespectful in front of everyone.",
              },
            ],
            feedback:
              "Referring back to classroom agreements or shared expectations helps guide behavior without shaming the student. This supports a respectful and positive classroom culture.",
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "You notice a student who rarely participates in class discussions. What is the best way to support them?",
            options: [
              {
                id: "1",
                text: "Call on them unexpectedly to force participation.",
              },
              {
                id: "2",
                text: "Ignore them and focus on more active students.",
              },
              {
                id: "3",
                text: "Ask them privately if they would feel comfortable sharing their ideas in smaller groups.",
              },
              {
                id: "4",
                text: "Tell them they need to speak more in class.",
              },
              {
                id: "5",
                text: "Compare them with other students who participate more.",
              },
            ],
            feedback:
              "Some students need psychological safety before speaking in class. Offering smaller group discussions or private encouragement can help build confidence gradually.",
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: ` A student gives an incorrect answer during a class discussion. What is the best response?`,
            options: [
              {
                id: "1",
                text: "That’s wrong. Does anyone else know the answer?",
              },
              {
                id: "2",
                text: "Ignore the answer and move to another student.",
              },
              {
                id: "3",
                text: "That’s not correct. Please pay more attention.",
              },
              {
                id: "4",
                text: "That’s an interesting idea. Let’s explore it together and see how we might adjust it.",
              },
              {
                id: "5",
                text: "Tell the student they should have studied more.",
              },
            ],
            feedback:
              "Responding positively to mistakes encourages a growth mindset. Students learn that mistakes are part of the learning process, which increases participation and confidence.",
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question:
              "During group work, one student is doing all the work while others remain passive. What is the most effective teacher response?",
            options: [
              {
                id: "1",
                text: "Let the group continue since the work is getting done.",
              },
              {
                id: "2",
                text: "Tell the stronger student to continue since they understand the task.",
              },
              {
                id: "3",
                text: "Remind the group that everyone should contribute and assign each student a role.",
              },
              {
                id: "4",
                text: "Move the weaker students to another group.",
              },
              {
                id: "5",
                text: "Ask the hardworking student to complete the task alone.",
              },
            ],
            feedback:
              "Assigning clear roles within group activities helps ensure all students participate and develop collaboration skills.",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: [
              "Teachers should describe what they observe rather than applying labels.",
              "Match the observation to the label.",
            ],
            options:
              "Competence, Confidence, Coping, Control, Character, Connections, and Contribution.",
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question: "Struggles to stay focused during long tasks.",
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "Often calls out during lessons.",
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `Takes more time to complete tasks.`,
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question: "Avoids starting difficult tasks and gives up quickly.",
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question: "Frequently makes mistakes when copying from the board.",
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
          },
          {
            stepId: 7,
            type: "dropdownScenario",
            question: "Appears disengaged during long written activities.",
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
            feedback:
              "Observations are factual and help identify support strategies. Labels can feel judgmental and may cause parents to become defensive.",
          },
          {
            stepId: 8,
            type: "dropdownScenario",
            question: "Becomes frustrated when tasks feel overwhelming.",
            options: [
              {
                id: "1",
                text: "Lazy",
              },
              {
                id: "2",
                text: "Disruptive",
              },
              {
                id: "3",
                text: "Slow Learner",
              },
              {
                id: "4",
                text: "Not trying",
              },
              {
                id: "5",
                text: "Careless",
              },
              {
                id: "6",
                text: "Unmotivated",
              },
              {
                id: "7",
                text: "Difficult child",
              },
            ],
            feedback:
              "Observations are factual and help identify support strategies. Labels can feel judgmental and may cause parents to become defensive.",
          },
          {
            stepId: 9,
            type: "dropdownScenario",
            question:
              "A parent becomes defensive when you raise concerns about their child. What is the best response?",
            options: [
              {
                id: "1",
                text: "Insist that you are correct.",
              },
              {
                id: "2",
                text: "End the conversation immediately.",
              },
              {
                id: "3",
                text: "Listen calmly and ask about their observations at home.",
              },
              {
                id: "4",
                text: "Blame the parent.",
              },
            ],
            feedback:
              "Parents often become defensive when they feel their child is being judged. Listening calmly and inviting their perspective helps build trust and collaboration.",
          },
          {
            stepId: 10,
            type: "dropdownScenario",
            question: `You share classroom observations with a parent, but they respond: "My child doesn't behave like that at home." What is the most effective response?`,
            options: [
              {
                id: "1",
                text: "Tell the parent they are wrong.",
              },
              {
                id: "2",
                text: " Explain calmly what you have observed and ask if they notice anything similar at home.",
              },
              {
                id: "3",
                text: "End the conversation.",
              },
              {
                id: "4",
                text: "Tell the parent the school will handle it alone.",
              },
            ],
            feedback:
              "Parents and teachers may see different behaviours because children behave differently in different environments. Sharing observations calmly encourages collaboration rather than conflict.",
          },
          {
            stepId: 11,
            type: "dropdownScenario",
            question:
              "You want to involve a parent in supporting their child's learning. Which statement encourages collaboration?",
            options: [
              {
                id: "1",
                text: "You need to work harder with your child at home.",
              },
              {
                id: "2",
                text: "I think we should both try different strategies to support learning.",
              },
              {
                id: "3",
                text: "This is mainly a home problem.",
              },
              {
                id: "4",
                text: "Your child needs to try harder.",
              },
            ],
            feedback:
              "Collaborative language helps parents feel included in the process and encourages teamwork between home and school.",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            title: "Instruction",
            instructions: ["Match the element of an IEP with its purpose."],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question: "Who will implement support.",
            options: [
              {
                id: "1",
                text: "Learner strengths.",
              },
              {
                id: "2",
                text: "Barriers.",
              },
              {
                id: "3",
                text: "Adjustments.",
              },
              {
                id: "4",
                text: "Accountability.",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "Strategies to support learning.",
            options: [
              {
                id: "1",
                text: "Learner strengths.",
              },
              {
                id: "2",
                text: "Barriers.",
              },
              {
                id: "3",
                text: "Adjustments.",
              },
              {
                id: "4",
                text: "Accountability.",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: `Challenges affecting participation.`,
            options: [
              {
                id: "1",
                text: "Learner strengths.",
              },
              {
                id: "2",
                text: "Barriers.",
              },
              {
                id: "3",
                text: "Adjustments.",
              },
              {
                id: "4",
                text: "Accountability.",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question: `What the learner does well.`,
            options: [
              {
                id: "1",
                text: "Learner strengths.",
              },
              {
                id: "2",
                text: "Barriers.",
              },
              {
                id: "3",
                text: "Adjustments.",
              },
              {
                id: "4",
                text: "Accountability.",
              },
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 12,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "dropdownScenario",
            question:
              "Which of the following are common signs of teacher burnout?",
            options: [
              {
                id: "1",
                text: "Emotional exhaustion",
              },
              {
                id: "2",
                text: "Increased impatience with students",
              },
              {
                id: "3",
                text: "Loss of empathy toward learners",
              },
              {
                id: "4",
                text: "Chronic fatigue",
              },
              {
                id: "5",
                text: "All of the above",
              },
            ],
            correctOption: "1",
            feedback:
              "Burnout often shows up as emotional exhaustion, irritability, fatigue, and reduced empathy. Recognising these signs early allows teachers to seek support before stress becomes overwhelming.",
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              "A teacher begins feeling emotionally drained and notices they are becoming impatient with students more often than usual. What might this indicate?",
            options: [
              {
                id: "1",
                text: "A lack of classroom discipline",
              },
              {
                id: "2",
                text: "DyslexA normal teaching experience that requires no attentionia",
              },
              {
                id: "3",
                text: "A possible early sign of burnout",
              },
              {
                id: "4",
                text: "That the teacher should lower expectations",
              },
            ],
            correctOption: "3",
            feedback:
              "Emotional exhaustion and increased impatience are early warning signs that a teacher may be experiencing burnout.",
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: `Which strategy best helps teachers manage stress in inclusive classrooms?`,
            options: [
              {
                id: "1",
                text: "Taking full responsibility for every learner's progress",
              },
              {
                id: "2",
                text: " Ignoring stress and pushing through",
              },
              {
                id: "3",
                text: "Collaborating with colleagues and sharing challenges",
              },
              {
                id: "4",
                text: "Avoiding communication with parents",
              },
            ],
            correctOption: "3",
            feedback:
              "Collaboration helps reduce emotional pressure and allows teachers to share strategies and support one another.",
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question:
              "Why is setting emotional boundaries important for teachers?",
            options: [
              {
                id: "1",
                text: "It prevents teachers from caring about student",
              },
              {
                id: "2",
                text: "It helps teachers protect their wellbeing while still supporting learners",
              },
              {
                id: "3",
                text: "It reduces teacher responsibility",
              },
              {
                id: "4",
                text: "It allows teachers to avoid difficult situations",
              },
            ],
            correctOption: "2",
            feedback:
              "Emotional boundaries allow teachers to care deeply without becoming emotionally overwhelmed.",
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question:
              "Which statement best reflects a healthy mindset for teachers working in inclusive classrooms?",
            options: [
              {
                id: "1",
                text: "I must solve every challenge myself",
              },
              {
                id: "2",
                text: "If a learner struggles, I have failed",
              },
              {
                id: "3",
                text: "Small progress is meaningful and worth celebrating",
              },
              {
                id: "4",
                text: "Inclusion should eliminate all classroom challenges",
              },
              {
                id: "5",
                text: "Ask the hardworking student to complete the task alone.",
              },
            ],
            correctOption: "3",
            feedback:
              "Inclusive teaching focuses on gradual progress rather than perfection.",
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 13,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/tot2_videos/Week+5/Week+5_7.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
};
