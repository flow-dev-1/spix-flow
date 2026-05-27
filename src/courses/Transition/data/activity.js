export const courseContent = {
  week1: {
    title: "Introduction to Transition",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "What has your time in Primary school been like?",
              }
            ]
          },
          {
            stepId: 2,
            type: "scenario",
            questions: [

              {
                type: "Question",
                question: "What will be your favorite memory as you leave?",
              }]
          },
          {
            stepId: 3,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "What was the most challenging thing you overcame?",
              }
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "question",
        questionType: "text",
        question: "Why do you think a higher education is important for you?",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },



      {
        id: 5,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "listQuestion",
        questionType: "text",
        question: "What do you look forward to experiencing in secondary school?",
        inputCount: 5,
        inputType: "text",
        inputPlaceholder: "Type your answer here",
        navigation: {
          prev: true,
          next: true,
        },
      },

      {
        id: 7,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "question",
        questionType: "text",
        question: "What does the word ",
        hasImage: true,
        isbrokenQuestion: true,
        brokenCompletion: " mean to you?",
        imageSrc: "transition.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },

      // Love TextBox
      {
        id: 10,
        type: "question",
        questionType: "text",
        question: "What’s one thing you’re looking forward to?",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_6.mp4",
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
            type: "multiColoredQuestionBoxes",
            question:
              "List three (3) things you’re excited about for secondary school.",
            fields: [
              {
                number: "1",
                textFieldColor: "yellow",
                colorCode: "#FCF85D",
              },
              {
                number: "2",
                textFieldColor: "orange",
                colorCode: "#FAAA74",
              },
              {
                number: "3",
                textFieldColor: "pink",
                colorCode: "#ED3F93",
              }

            ]
          },
          {
            stepId: 2,
            type: "multiColoredQuestionBoxes",
            question:
              "List three (3) things that you feel nervous or afraid about.",
            fields: [
              {
                number: "1",
                textFieldColor: "yellow",
                colorCode: "#FCF85D",
              },
              {
                number: "2",
                textFieldColor: "orange",
                colorCode: "#FAAA74",
              },
              {
                number: "3",
                textFieldColor: "pink",
                colorCode: "#ED3F93",
              }


            ]
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+1/Week+1_7.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week2: {
    title: "Mindset",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+2/Week+2_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question: "What do you understand by the word",
        hasImage: true,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+2/Week+2_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "imageDragAndDrop",
        instruction:
          "Drag-and-drop the statements on the left into any of these bowls",
        images: [
          "Michael Jordan",
          "I can get better at this if I keep practicing.",
          "I haven’t figured it out yet, but I will.",
          "Mistakes help me learn and improve.",
          "With effort, I can improve my skills.",
          "If I don’t understand it immediately, it means I’m not smart enough.",

          "Serena Williams",
          "I’m either good at something or I’m not.",
          "I give up when things get too hard.",
          "I can’t change my abilities; I was born this way.",
          "I stick to what I’m good at and avoid new things.",
          "Hard work and effort lead to improvement.",

          "Michelle Obama",
          "If I fail, it just shows I’m not cut out for it. ",
          "Why try? Others are just naturally better than me.",
          "If I need help, it means I’m not capable enough.",
          "I’ll keep trying, even when it’s tough.",
          "Learning is a journey; I don’t have to be perfect right away.",

          "Justin Bieber",
          "If I don’t succeed on the first try, I’m not meant to do it.",
          "Mistakes help me learn and improve.",
          "My brain can grow with new information and practice",
          "I’m just not good at this, and I never will be.",
          "I ask for help because it helps me learn.",
        ],
        buckets: [
          {
            id: "green",
            label: "Growth Mindset",
            image: "Green Bucket.svg",
          },
          {
            id: "red",
            label: "Fixed Mindset",
            image: "Red Bucket.svg",
          },
        ],
        steps: 24,
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+2/Week+2_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week3: {
    title: "Secondary School",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+3/Week+3_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "progressBar",
        questionType: "text",
        question: "On a scale of 1 to 100, how ready do you feel for Secondary School?",
        hasImage: true,
        inputType: "progressBar",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+3/Week+3_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "imageDragAndDrop",
        instruction:
          "Drag-and-drop the statements on the left into any of these bowls",
        images: [
          "Past Mistakes",
          "How I Respond to Challenges",
          "Asking for Help",
          "Being Accountable",
          "Height",
          "Being Kind",
          "Doing My Chores",
          "Forgiveness from others",
          "Who Loves Me",
          "The Friends I Choose to Have",
          "Death",
          "Others expressing their emotions",
          "Skin Color",
          "Others being kind",
          "Someone else's decisions",
          "How I Spend my Free Time",
          "Responding Properly",
        ],
        buckets: [
          {
            id: "green",
            label: "In Your Control",
            count: 2,
          },
          {
            id: "red",
            label: "Out of Your Control",
            count: 2,
          },
        ],
        steps: 18,
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+3/Week+3_3.mp4",
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
            type: "scenario",
            title:
              "Your friends made plans without you.",
            questions: [
              {
                type: "circle",
                colorCode: "#50AA50",
                question: "Within your control:",
              },
              {
                type: "square",
                colorCode: "#FD483D",
                question: "Outside your control:",
              }

            ],
          },
          {
            stepId: 2,
            type: "scenario",
            title:
              "It started raining on the day you planned to play outside.",
            questions: [
              {
                type: "smallText",
                colorCode: null,
                question: "Within your control:",
              },
              {
                type: "smallText",
                colorCode: null,
                question: "Outside your control:",
              }
            ],
          },
          {
            stepId: 3,
            type: "scenario",
            title:
              "You didn’t get selected for the school team.",
            questions: [
              {
                type: "smallText",
                colorCode: null,
                question: "Within your control:",
              },
              {
                type: "smallText",
                colorCode: null,
                question: "Outside your control:",
              }
            ],
          },
          {
            stepId: 4,
            type: "scenario",
            title:
              "Your sibling borrowed your things without asking.",
            questions: [
              {
                type: "smallText",
                colorCode: null,
                question: "Within your control:",
              },
              {
                type: "smallText",
                colorCode: null,
                question: "Outside your control:",
              }
            ],
          },
          {
            stepId: 5,
            type: "scenario",
            title:
              "You feel nervous about giving a presentation.",
            questions: [
              {
                type: "smallText",
                colorCode: null,
                question: "Within your control:",
              },
              {
                type: "smallText",
                colorCode: null,
                question: "Outside your control:",
              }
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+3/Week+3_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week4: {
    title: "Compassion in Daily Life",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+4/Week+4_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question:
          "What do you understand by the word",
        inputType: "mediumTextBox",
        hasImage: true,
        imageSrc: "values.png",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+4/Week+4_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "multiStep",
        instruction:
          "Click each card to know more about the values. Tick the box on each card to pick the values you feel are a big part of who you are.",
        steps: [
          {
            stepId: 1,
            options: [
              {
                value: "Generosity",
                description: "Being willing to share and give to others.",
                eg: "Example: Donating to charity.",
                color: "maroon"
              },
              {
                value: "Respect",
                description: "Valuing and honoring others and their options.",
                eg: "Example: Listening carefully to an elder.",
                color: "green"
              },
              {
                value: "Leadership",
                description: "Guiding  and inspiring others.",
                eg: "Example: Leading a group project at school",
                color: "orange"
              },
              {
                value: "Responsibility",
                description: "Being accountable for your actions and duties.",
                eg: "Example: Completing your homework on time.",
                color: "purple"
              },
              {
                value: "Integrity",
                description: "Being honest and having strong moral principles.",
                eg: "Example:Returning a lost wallet you found.",
                color: "maroon"
              },
              {
                value: "Empathy",
                description: "Understanding and sharing the feelings of others.",
                eg: "Example: Comforting a friend who is sad.",
                color: "green"
              },
              {
                value: "Compassion",
                description: "Caring for others and helping them when they need it.",
                eg: "Example: Volunteering at a soup kitchen.",
                color: "orange"
              },
              {
                value: "Gratitude",
                description: "Being thankful and appreciating what you have.",
                eg: "Example: Writing a thank-you note to someone who helped you.",
                color: "purple"
              },
              {
                value: "Courage",
                description: "Facing your fears or challenges bravely.",
                eg: "Example: Speaking up for someone being bullied.",
                color: "maroon"
              },
              {
                value: "Forgiveness",
                description: "Letting go of anger or resentment towards someone who wronged you.",
                eg: "Example: Forgiving a friend who hurt your feelings.",
                color: "green"
              },
              {
                value: "Perseverance",
                description: "Continuing to try, even when things are tough.",
                eg: "Example: Practicig a sport even after losing a game.",
                color: "orange"
              },
              {
                value: "Cooperation",
                description: "Working well with others to achieve a common goal.",
                eg: "Example: Collaborating on a group project.",
                color: "purple"
              }
            ],
          },
          {
            stepId: 2,
            options: [
              {
                value: "Kindness",
                description: "Being friendly, generous, and considerate to others.",
                eg: "Example: Helping a neighbor carry their groceries.",
                color: "maroon"
              },
              {
                value: "Tolerance",
                description: "Accepting and respecting different opinions or behaviors.",
                eg: "Example: Respecting classmates' diverse backgrounds.",
                color: "green"
              },
              {
                value: "Patience",
                description: "Waiting calmly without getting frustrated.",
                eg: "Example: Waiting for your turn without complaining.",
                color: "orange"
              },
              {
                value: "Friendship",
                description: "Having a close and trusting relationship with someone.",
                eg: "Example: Spending time with a friend who needs support.",
                color: "purple"
              },
              {
                value: "Teamwork",
                description: "Working together with others to achieve a goal.",
                eg: "Example: Playing a team sport and supporting each other.",
                color: "maroon"
              },
              {
                value: "Organization",
                description: "Planning and arranging tasks and activities efficiently.",
                eg: "Example: Keeping a tidy desk and schedule.",
                color: "green"
              },
              {
                value: "Grit",
                description: "Having courage and determination to stick with something.",
                eg: "Example: Studying hard for a tough exam.",
                color: "orange"
              },
              {
                value: "Resilience",
                description: "Recovering quickly from difficulties.",
                eg: "Example: Bouncing back after a disappointing performance.",
                color: "purple"
              },
              {
                value: "Adaptability",
                description: "Adjusting to new conditions or changes.",
                eg: "Example: Getting used to a new school.",
                color: "maroon"
              },
              {
                value: "Contentment",
                description: "Being happy and satisfied with what you have.",
                eg: "Example: Enjoying time with family without wanting more.",
                color: "green"
              },
              {
                value: "Honour",
                description: "Doing what is right and keeping promises.",
                eg: "Example: Keeping a promise even when it's hard.",
                color: "orange"
              },
              {
                value: "Moderation",
                description: "Avoiding extremes and practicing self-control.",
                eg: "Example: Eating sweets occasionally rather than every day.",
                color: "purple"
              }
            ],
          },
          {
            stepId: 3,
            options: [
              {
                value: "Spirituality",
                description: "Feeling connected to something bigger than yourself.",
                eg: "Example: Practicing meditation or prayer.",
                color: "maroon"
              },
              {
                value: "Healthy Life",
                description: "Taking care of your physical, mental, and emotional well-being.",
                eg: "Example: Exercising and eating a balanced diet.",
                color: "green"
              },
              {
                value: "Family",
                description: "Valuing and maintaining strong bonds with family members.",
                eg: "Example: Spending quality time with your family.",
                color: "orange"
              },
              {
                value: "Resourcefulness",
                description: "Finding clever solutions to problems.",
                eg: "Example: Using household items creatively to solve a problem.",
                color: "purple"
              },
              {
                value: "Mindfulness",
                description: "Being fully present and aware of the moment.",
                eg: "Example: Practicing deep breathing to stay calm.",
                color: "maroon"
              },
              {
                value: "Creativity",
                description: "Using your imagination to create or solve problems.",
                eg: "Example: Painting a picture or writing a story.",
                color: "green"
              },
              {
                value: "Curiosity",
                description: "Wanting to know or learn something new.",
                eg: "Example: Asking questions about a topic you're interested in.",
                color: "orange"
              },
              {
                value: "Punctuality",
                description: "Being on time.",
                eg: "Example: Arriving at school before the bell rings.",
                color: "purple"
              },
              {
                value: "Courtsey",
                description: "Being polite and considerate.",
                eg: "Example: Saying please and thank you.",
                color: "maroon"
              },
              {
                value: "Self-control",
                description: "Managing your emotions and behavior.",
                eg: "Example:Staying calm when you're angry.",
                color: "green"
              },
              {
                value: "Self-discipline",
                description: "Sticking to what's right, even when it's tough.",
                eg: "Example: Following a study schedule despite wanting to play.",
                color: "orange"
              },
              {
                value: "Optimism",
                description: "Being hopeful and confident about the future.",
                eg: "Example: Believing you will do well on a test even if it seems hard.",
                color: "purple"
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+4/Week+4_3.mp4",
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
            type: "threeFieldsAnswers",
            question:
              "Identify three (3) important people in your life and list their names below.",
            answers: 3
          },
          {
            stepId: 2,
            type: "threeFieldsAnswers",
            question:
              "Write out what these people think about you.",
            answers: 3
          },
          {
            stepId: 3,
            type: "threeFieldsAnswers",
            question:
              "Are you happy with what these people think about you? If no, what would you like to change? If yes, type “YES” in the box.",
            answers: 3
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+4/Week+4_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week5: {
    title: "Compassion in Practice",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+5/Week+5_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "listQuestion",
        questionType: "text",
        question: "Give examples of emotions that you know of.",
        inputCount: 5,
        inputType: "text",
        inputPlaceholder: "Type your answer here",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+5/Week+5_2.mp4",
        hasNextButton: true,
      },
      {
        id: 4,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "scenario",
            title:
              "Jordan's friend was supposed to meet him at the library but canceled at the last minute. Jordan feels frustrated.",
            questions: [
              {
                type: "smallSelect",
                question: "Identify the Emotion:",

              },
              {
                type: "smallText",
                question: "Reason for the Emotion:",
              },
              {
                type: "smallText",
                question: "Respond with Emotional Intelligence:",
              }

            ],
          },
          {
            stepId: 2,
            type: "scenario",
            title:
              "Maria got her test results back and is disappointed because she didn’t score as high as she expected, even though she studied hard.",
            questions: [
              {
                type: "smallSelect",
                question: "Identify the Emotion:",
              },
              {
                type: "smallText",
                question: "Reason for the Emotion:",
              },
              {
                type: "smallText",
                question: "Respond with Emotional Intelligence:",
              }

            ],
          }, {
            stepId: 3,
            type: "scenario",
            title:
              "Alex’s friend just got chosen as the team captain, a position Alex also wanted. Alex feels left out and a little jealous.",
            questions: [
              {
                type: "smallSelect",
                colorCode: null,
                question: "Identify the Emotion:",
              },
              {
                type: "smallText",
                question: "Reason for the Emotion:",
              },
              {
                type: "smallText",
                question: "Respond with Emotional Intelligence:",
              }

            ],
          }, {
            stepId: 4,
            type: "scenario",
            title:
              "During group work, Mia notices that one team member, Sam, seems quiet and withdrawn. Mia suspects he might be feeling stressed..",
            questions: [
              {
                type: "smallSelect",
                question: "Identify the Emotion:",
              },
              {
                type: "smallText",
                question: "Reason for the Emotion:",
              },
              {
                type: "smallText",
                question: "Respond with Emotional Intelligence:",
              }

            ],
          }, {
            stepId: 5,
            type: "scenario",
            title:
              "Jamie helped organize a big event, but nobody thanked him for his hard work. Jamie feels unappreciated.",
            questions: [
              {
                type: "smallSelect",
                question: "Identify the Emotion:",
              },
              {
                type: "smallText",
                question: "Reason for the Emotion:",
              },
              {
                type: "smallText",
                question: "Respond with Emotional Intelligence:",
              }

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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+5/Week+5_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week6: {
    title: "Compassion in Practice",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+6/Week+6_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question: "What comes to your mind about the word  ",
        hasImage: true,
        imageSrc: "social_skills.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+6/Week+6_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "progressBar",
        question: "Do you think you have great social skills or poor social skills?",
        progressBarConfig: {
          low: 0,
          mid: 50,
          max: 100,
        },
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+6/Week+6_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "question",
        questionType: "text",
        question: "What comes to your mind about the word  ",
        hasImage: true,
        imageSrc: "communication.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+6/Week+6_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "question",
        questionType: "text",
        question: "What do you understand by the word ",
        hasImage: true,
        imageSrc: "boundaries.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+6/Week+6_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "imageDragAndDrop",
        instruction:
          "Drag-and-drop the statements on the left into any of these bowls",
        images: [
          "Listening actively and not interrupting.",
          "Clearly expressing your own comfort levels in a conversation.",
          "Being direct and respectful when you don’t agree.",
          "Politely explaining if something is outside your comfort zone.",
          "Respecting others’ personal space and values.",
        ],
        buckets: [
          {
            id: "green",
            label: "Effective communication",
            count: 2,
          },
          {
            id: "red",
            label: "Clear Boundaries",
            count: 2,
          },
        ],
        steps: 5,
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
              "Below are sentences with missing words related to communication and boundaries. Choose the best word from the list below to complete each sentence.",
              "\n Missing words are: "
            ],
            options: "Respect, Clarity, Comfort, Listen, Express"
          },

          {
            stepId: 2,
            type: "dropdownScenario",
            question: "When setting boundaries, it’s important to clearly ______ your needs.",
            options: [
              "Respect",
              "Clarity",
              "Comfort",
              "Listen",
              "Express",
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question: "In effective communication, you ______ to understand, not to respond immediately.",
            options: [
              "Respect",
              "Clarity",
              "Comfort",
              "Listen",
              "Express",
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question: "Boundaries help maintain ______ within relationships.",
            options: [
              "Respect",
              "Clarity",
              "Comfort",
              "Listen",
              "Express",
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question: "Good communication includes being able to speak with ______ and honesty.",
            options: [
              "Respect",
              "Clarity",
              "Comfort",
              "Listen",
              "Express",
            ],
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question: "Healthy relationships are built on ______ for each other’s space and ideas.",
            options: [
              "Respect",
              "Clarity",
              "Comfort",
              "Listen",
              "Express",
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+6/Week+6_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week7: {
    title: "Compassion in Practice",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+7/Week+7_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "radio",
        question: "Have you sat down to think about how you will balance all of these effectively? ",
        options: [
          { id: "A", text: "YES" },
          { id: "B", text: "NO" },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+7/Week+7_2.mp4",
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
            type: "listQuestion",
            questionType: "text",
            question: "List of all the assignments and activities you have this week.",
            inputCount: 5,
            inputType: "text",
            inputPlaceholder: "Type your answer here",

          },
          {
            stepId: 2,
            type: "multiColoredQuestionBoxes",
            question:
              "Choose three tasks from your planner and rank them by importance. Write down which task you’ll complete first, second, and third.",
            fields: [
              {
                number: "1",
                textFieldColor: "green",
                colorCode: "#89B92E",
              },
              {
                number: "2",
                textFieldColor: "yellow",
                colorCode: "#FCF85D",
              },
              {
                number: "3",
                textFieldColor: "red",
                colorCode: "#F46851",
              },
            ]
          },
          {
            stepId: 3,
            type: "bigTextBox",
            question:
              "Why did you select these tasks?",
            fieldCount: 1
          },
          {
            stepId: 4,
            type: "multiMultiColoredQuestionBoxes",
            question:
              "Decide when you’ll work on each task, starting with the top 3 you selected.",
            fields: [
              {
                number: "Monday",
                textFieldColor: "orange",
                colorCode: "#FCAF17",
              },
              {
                number: "Tuesday",
                textFieldColor: "yellow",
                colorCode: "#FCF85D",
              },
              {
                number: "Wednesday",
                textFieldColor: "lightOrange",
                colorCode: "#FAAA74",
              },
              {
                number: "Thursday",
                textFieldColor: "green",
                colorCode: "#2CCF4F",
              },
              {
                number: "Friday",
                textFieldColor: "pink",
                colorCode: "#FDD8B6",
              },
              {
                number: "Saturday",
                textFieldColor: "blue",
                colorCode: "#01A7FF",
              },
            ]
          },
          {
            stepId: 5,
            type: "checkBoxesWithImageAndTitle",
            question:
              "Identify the things you will need to limit to make more room for your tasks.",
            options: [
              {
                title: "Watching TV",
                image: "watchingTv.png",
                colorCode: "#FCF85D",
              },
              {
                title: "Spending time on phone",
                image: "timeWithPhone.png",
                colorCode: "#FFEEBB",
              },
              {
                title: "Gisting/Gossiping",
                image: "gistingAndGossiping",
                colorCode: "#C9FF61",
              },
              {
                title: "Playing Games",
                image: "playingGames.png",
                colorCode: "#FCCAA1",
              },
              {
                title: "Playing around",
                image: "playingAround.png",
                colorCode: "#ECEDF0",
              },
              {
                title: "Social Media",
                image: "socialMedia.png",
                colorCode: "#F7ABAA",
              },
            ]
          },
          {
            stepId: 6,
            type: "listQuestion",
            questionType: "text",
            question: "Write other time consumers you must limit, if you have.",
            inputCount: 5,
            inputType: "text",
            inputPlaceholder: "Type your answer here",

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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+7/Week+7_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },


    ],
  },
  week8: {
    title: "Compassion in Practice",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+8/Week+8_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "radio",
        question: " Do you watch or play football? ",
        imageSrc: "footballers.png",
        options: [
          { id: "A", text: "YES" },
          { id: "B", text: "NO" },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+8/Week+8_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "question",
        questionType: "text",
        question: "What do you understand by the word  ",
        hasImage: true,
        imageSrc: "resilience.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+8/Week+8_3.mp4",
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
            type: "star",
            question:
              "Write down the things you are good at doing.",
            answers: 5,
            config: [
              {
                title: "",
                color: "yellow",
                colorCode: "#FCF85D",
                bgColor: "#FCF85D"
              },
              {
                title: "",
                color: "blue",
                colorCode: "#01A7FF",
                bgColor: "#85D4FF"
              },
              {
                title: "",
                color: "pink",
                colorCode: "#FF2C92",
                bgColor: "#FF90C6"
              },
              {
                title: "",
                color: "orange",
                colorCode: "#2CCF4F",
                bgColor: "#FFCDAC"
              },
              {
                title: "",
                color: "green",
                colorCode: "#FDD8B6",
                bgColor: "#C9FF61"
              },
            ]
          },

          {
            stepId: 2,
            type: "hearts",
            question:
              "Write down the goals you want to achieve.",
            answers: 5,
            config: [
              {
                title: "",
                color: "yellow",
                colorCode: "#FCF85D",
                bgColor: "#FCF85D"
              },
              {
                title: "",
                color: "blue",
                colorCode: "#01A7FF",
                bgColor: "#85D4FF"
              },
              {
                title: "",
                color: "pink",
                colorCode: "#FF2C92",
                bgColor: "#FF90C6"
              },
              {
                title: "",
                color: "orange",
                colorCode: "#2CCF4F",
                bgColor: "#FFCDAC"
              },
              {
                title: "",
                color: "green",
                colorCode: "#FDD8B6",
                bgColor: "#C9FF61"
              },
            ]
          },
          {
            stepId: 3,
            type: "singleStar",
            question: "Write down your Wishing Star here.",
          },
          {
            stepId: 4,
            type: "smart",
            question: "Make your Wishing Star a SMART Goal.",
            answers: 5,
            config: [
              {
                title: "s",
              },
              {
                title: "m",
              },
              {
                title: "a",
              },
              {
                title: "r",

              },
              {
                title: "t",
              },
            ]
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+8/Week+8_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
    ],
  },
  week9: {
    title: "Compassion in Practice",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+9/Week+9_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question: "What do you understand by the word  ",
        hasImage: true,
        imageSrc: "resilience.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+9/Week+9_2.mp4",
        hasNextButton: true,
      },
      {
        id: 4,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "bigTextBox",
            question:
              "What do you understand by the word",
            hasImage: true,
            image: "copingSkils.png",
            fieldCount: 1,
          },
          {
            stepId: 2,
            type: "listQuestion",
            question:
              "Other words for coping could be: deal with, handle. Let me know if you have other words in mind.",
            fieldCount: 5
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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+9/Week+9_3.mp4",
        hasNextButton: true,
      },
      {
        id: 6,
        type: "multiStep",
        title: "Write a letter to yourself.",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            challenge: "Preparing for a big math test, and you don’t understand all the topics.",
            statement: "I don’t understand all the topics. yet., but I can keep studying and practicing until I do"
          },
          {
            stepId: 2,
            type: "scenario",
            challenge: "Trying to make new friends but feeling like I don’t fit in.",
          },
          {
            stepId: 3,
            type: "scenario",
            challenge: "Learning how to play a musical instrument, but I keep making mistakes.",
          },
          {
            stepId: 4,
            type: "scenario",
            challenge: "During class discussions, I don't feel confident speaking in front of others..",
          },
          {
            stepId: 5,
            type: "scenario",
            challenge: "I don't seem to know how to balance school work and home chores",
          },
          {
            stepId: 6,
            type: "imageDragAndDrop",
            instruction:
              "Drag-and-drop the statements on the left into any of these bowls.",
            steps: 9,
            buckets: [
              {
                id: "green",
                title: "Healthy Skills",
              },
              {
                id: "red",
                title: "Unhealthy Skills",
              }

            ],
            images: [
              "Write",
              "Walk away",
              "Belly Breathing",
              "Exercise",
              "Yell",
              "Talk to Someone",
              "Positive Self Talk",
              "Break things",
              "Bite nails"
            ]

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
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+9/Week+9_4.mp4",
        hasNextButton: true,
      }
    ],
  },
  week10: {
    title: "Compassion in Practice",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+10/Week+10_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "When I’m feeling overwhelmed with homework, I’ll remember to"
              }
            ]
          },
          {
            stepId: 2,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "If I’m nervous about giving a presentation, I’ll try to calm myself by..."
              }
            ]
          },
          {
            stepId: 3,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "If I find a subject difficult and start to struggle, I’ll remind myself to ..."
              }
            ]
          },
          {
            stepId: 4,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "When I get a lower grade than I expected, I’ll use resilience by..."
              }
            ]
          },
          {
            stepId: 5,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "If I feel left out at lunch or during group activities, I’ll remember to..."
              }
            ]
          },
          {
            stepId: 6,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "When I have a disagreement with a friend, I’ll handle it by..."
              }
            ]
          },
          {
            stepId: 7,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "If I feel too tired or stressed, I’ll take care of myself by ..."
              }
            ]
          },
          {
            stepId: 8,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "When I feel unsure about asking for help, I’ll remind myself that I can always talk to..."
              }
            ]
          },
          {
            stepId: 9,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "If I need to set a new goal, I’ll plan by..."
              }
            ]
          },
          {
            stepId: 10,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "When I need a break from studying, I’ll choose a healthy way to recharge like..."
              }
            ]
          },
          {
            stepId: 11,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "If I have a day where everything feels hard, I’ll show resilience by..."
              }
            ]
          },
          {
            stepId: 12,
            type: "scenario",
            questions: [
              {
                type: "Question",
                question: "When I need to manage my time for a big test, I’ll organize myself by..."
              }
            ]
          }
        ]

        ,
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc: "https://d3sc34m1n26ele.cloudfront.net/SPIX-Transition/Week+10/Week+10_2.mp4",
        hasNextButton: true,
      },
    ],
  },
};
