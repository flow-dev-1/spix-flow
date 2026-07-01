export const courseContent = {
  week1: {
    title: "Introduction to Resilience and Grit",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question: "What's next for you after year 12?",
        hasImage: false,
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
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "progressBar",
        question:
          "On a scale of 1-5, how nervous are you about your next step?",
        progressBarConfig: {
          low: 1,
          mid: 3,
          max: 5,
          step: 1,
        },
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_3.mp4",
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
            type: "checkbox",
            question: "Why do you want to go to the University/College?",
            options: [
              "Because it's expected of me",
              "To build a future career",
              "To discover who I am",
              "To gain independence",
              "Others",
            ],
          },
          {
            stepId: 2,
            type: "question",
            questionType: "text",
            question: "Type the other thing here.",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_4.mp4",
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
            type: "checkbox",
            question: "Choose 3-4 that best describe your future self.",
            options: [
              "Confident",
              "Independent",
              "Discplined",
              "Social",
              "Curious",
              "Resilent",
              "Creative",
              "Leader",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_5.mp4",
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
            type: "question",
            questionType: "text",
            question:
              "Now, in a structured sentence, I want you to write your reason for your next step after secondary school. Why are you making that particular decision?",
            inputType: "bigTextBox",
          },
          {
            stepId: 2,
            type: "sentenceCompletion",
            question:
              "Complete this sentence. I am choosing to pursue higher education/further training because ____________, and the person I want to become is someone who ____________.",
          },
          {
            stepId: 3,
            type: "visionBoard",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_6.mp4",
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
            type: "scenario",
            scenarioNumber: 1,
            scenarioText:
              "You got admission into university to study a particular course, maybe Computer Science, History, or Medicine. You knew it would be challenging, but the first required course turns out to be dull and painfully technical. You dread every lecture, struggle to stay focused, and your grades start to drop. You realise a big part of your first two years will be filled with similar courses.",
          },
          {
            stepId: 2,
            type: "question",
            questionType: "text",
            question:
              "Does your why give you enough motivation to push through these tough and boring classes so you can graduate with a good result?",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
          },
          {
            stepId: 3,
            type: "scenario",
            scenarioNumber: 2,
            scenarioText:
              "A few months into your first semester, you receive a once-in-a-lifetime offer, a fully paid, year-long volunteer or travel opportunity abroad. But it means taking a full year off school. Your friends and family encourage you to go, saying, \"School will always be there.\"",
          },
          {
            stepId: 4,
            type: "question",
            questionType: "text",
            question:
              "Is your why for going to university strong enough to keep you focused on your long-term goal, or would this exciting opportunity pull you away?",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
          },
          {
            stepId: 5,
            type: "scenario",
            scenarioNumber: 3,
            scenarioText:
              "You meet a well-respected lecturer who reviews your work and bluntly tells you that you do not have what it takes to succeed in your chosen field. They even suggest switching majors or leaving the program.",
          },
          {
            stepId: 6,
            type: "question",
            questionType: "text",
            question:
              "Is your why strong enough to help you rise above criticism and prove your abilities, or does this discouragement make you question your entire purpose?",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
          },
          {
            stepId: 7,
            type: "scenario",
            scenarioNumber: 4,
            scenarioText:
              "Your best friend gets admitted into a different school, and they try to convince you to transfer or move closer. They say your choice of university is hurting your friendship.",
          },
          {
            stepId: 8,
            type: "question",
            questionType: "text",
            question:
              "Does your why for attending this university and pursuing your goals matter more than the short-term comfort of staying close to your friend?",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+1/Week+1_7.mp4",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question: "What's your definition of Mindset and Values?",
        hasImage: false,
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
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_2.mp4",
        hasNextButton: true,
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "question",
        questionType: "text",
        question: "Does this make sense to you so far?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "imageDragAndDrop",
        instruction:
          "Drag-and-drop the statements on the left into any of these bowls",
        images: [
          "I failed once, so I'm probably not cut out for this.",
          "This is hard, but that means I'm learning something new.",
          "Smart people don't need to study as hard.",
          "I asked for feedback so I can do better next time.",
          "I can't do presentations, I've always been shy.",
          "I'm nervous about this, but I'll give it my best shot.",
          "There's no point trying again, I'll just fail anyway.",
          "I didn't get it right, but now I know what to work on."

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
        steps: 8,
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "singleChoice",
        questionType: "singleChoice",
        question: "What's the first thought that comes to your mind?",
        options: [
          "She's right. Maybe I'm not smart enough for this.",
          "That was embarrassing. I just want to disappear.",
          "Okay, that hurt. But I need to figure out what went wrong.",
          "This doesn't define me. I'll talk to the lecturer and make a plan.",
        ],
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "singleChoice",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "listQuestion",
        question: "List 3 values you think are important.",
        inputCount: 3,
        inputType: "text",
        inputPlaceholder: "Type your answer here",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 13,
        type: "multiStep",
        instruction:
          "Choose the top 5 Values that matter most to you right now.",
        rankInstruction:
          "Rank them from 1 to 5, with 1 being the most important. Type your answer in the box.",
        steps: [
          {
            stepId: 1,
            type: "singlePage",
          },
          {
            stepId: 2,
            type: "rankValues",
          },
        ],
        options: [
          {
            value: "Honesty",
            description:
              "Being truthful and doing the right thing, even when it is difficult.",
            eg: "Example: Admitting you made a mistake instead of blaming someone else.",
            color: "red",
          },
          {
            value: "Respect",
            description: "Valuing and honoring others and their options.",
            eg: "Example: Listening carefully to an elder.",
            color: "green",
          },
          {
            value: "Kindess",
            description: "Being friendly, generous, and considerate to others.",
            eg: "Example: Helping a neighbor carry their groceries.",
            color: "orange",
          },
          {
            value: "Responsibility",
            description: "Being accountable for your actions and duties.",
            eg: "Example: Completing your homework on time.",
            color: "purple",
          },
          {
            value: "Family",
            description:
              "Valuing and maintaining strong bonds with family members.",
            eg: "Example: Spending quality time with your family.",
            color: "red",
          },
          {
            value: "Faith",
            description:
              "Believing in something bigger than yourself and trusting that things will work out.",
            eg: "Example: Praying or staying hopeful during a difficult time.",
            color: "green",
          },
          {
            value: "Hardwork",
            description:
              "Putting in effort and not giving up, even when something is challenging.",
            eg: "Example: Studying regularly to improve your grades.",
            color: "orange",
          },
          {
            value: "Growth",
            description:
              "Learning from experiences and striving to become better every day.",
            eg: "Example: Practicing a skill until you improve.",
            color: "purple",
          },
          {
            value: "Justice",
            description:
              "Treating everyone fairly and standing up for what is right.",
            eg: "Example: Defending a classmate who is being treated unfairly.",
            color: "red",
          },
          {
            value: "Balance",
            description:
              "Managing different parts of life in a healthy and fair way.",
            eg: "Example: Making time for schoolwork, rest, and play.",
            color: "green",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_7.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 14,
        type: "singleChoice",
        questionType: "singleChoice",
        question:
          "Now look at your number 1 value, your most important one.\nAsk yourself: In a typical week at school or at home, does your behaviour actually reflect this value?\nBe honest.",
        options: [
          "Yes, consistently.",
          "Sometimes.",
          "Honestly, not really.",
        ],
        inputType: "singleChoice",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 15,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_8.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 16,
        type: "question",
        questionType: "text",
        question:
          "How would your value of responsibility influence your decision?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 17,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_9.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },

      // {
      //   id: 9,
      //   type: "video",
      //   videoSrc:
      //     "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+2/Week+2_5.mp4",
      //   navigation: {
      //     prev: true,
      //     next: true,
      //   },
      // },
    ],
  },
  week3: {
    title: "Understanding the Concept of Adaptability and Its Application",
    pages: [
      {
        id: 1,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "progressBar",
        question:
          "On a rating from 1 to 10, how important do you think relationships and money are to your university experience?",
        progressBarConfig: {
          low: 0,
          mid: 5,
          max: 10,
        },
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 3,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "question",
        questionType: "text",
        question:
          "If you spend time with people who always skip lectures or complain about everything, what’s going to happen?",
        options: [
          "I’ll probably start doing the same",
          "I’ll try to stay focused",
        ],
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_3.mp4",
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
              "Tola reminds you about your class project deadline and even offers to help you proofread your work before submission.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 2,
            type: "dropdownScenario",
            question:
              'Amarachi gets upset when you choose to study instead of hanging out and calls you "boring" for focusing on school.',
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 3,
            type: "dropdownScenario",
            question:
              "David celebrates your wins, no matter how small, and motivates you to keep going when things get hard.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 4,
            type: "dropdownScenario",
            question:
              "Sarah constantly compares your grades, clothes, and social media followers to hers and makes you feel like you're in competition.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 5,
            type: "dropdownScenario",
            question:
              "Jide checks in on you when you're stressed and listens without judging, even if he can't fix the problem.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 6,
            type: "dropdownScenario",
            question:
              "Lola only reaches out when she needs something: your notes, your data, or your help with an assignment, but disappears when you need her.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 7,
            type: "dropdownScenario",
            question:
              "Chika respects your boundaries when you say you can't stay out late or you need alone time to recharge.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 8,
            type: "dropdownScenario",
            question:
              "Ben spreads rumors or talks about people behind their backs, including you when you're not around.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 9,
            type: "dropdownScenario",
            question:
              "Ada encourages you to try new things, like joining a club or applying for a leadership role, even when you're unsure of yourself.",
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
              },
            ],
          },
          {
            stepId: 10,
            type: "dropdownScenario",
            question:
              'Kene teases you about your goals, saying things like, "You\'re trying too hard" or "That\'s impossible, just chill."',
            options: [
              {
                id: "A",
                text: "Supportive Friend",
              },
              {
                id: "B",
                text: "Draining Friend",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "question",
        questionType: "text",
        question:
          "Honestly, are YOU a supportive or draining friend right now?\nRate yourself.",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "singleChoice",
        questionType: "singleChoice",
        question:
          "Looking at Amy's spending so far, which bucket do you think most of her money went into?",
        options: ["Needs.", "Wants.", "Savings."],
        inputType: "singleChoice",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 12,
        type: "multiStep",
        title: "Write a letter to yourself.",
        steps: [
          {
            stepId: 1,
            type: "instruction",
            challenge: "Start by allocating your money. ",
            amount: "₦500,000",
            buckets: [
              {
                id: "orange",
                title: "NEEDS",
                amount: "₦250,000",
                percent: 50,
              },
              {
                id: "pink",
                title: "WANTS",
                amount: "₦150,000",
                percent: 30,
              },
              {
                id: "red",
                title: "SAVINGS",
                amount: "₦100,000",
                percent: 20,
              },
            ],
          },
          {
            stepId: 2,
            type: "imageDragAndDrop",
            instruction:
              "Drag-and-drop the statements on the left into any of these bowls.",
            steps: 4,
            buckets: [
              {
                id: "orange",
                title: "NEEDS",
                amount: "₦250,000",
              },
              {
                id: "pink",
                title: "WANTS",
                amount: "₦150,000",
              },
              {
                id: "red",
                title: "SAVINGS",
                amount: "₦100,000",
              },
            ],
            images: [
              "Hostel rent",
              "Netflix subscription",
              "Groceries",
              "New sneakers",
              "Data plan",
              "Weekend hangout",
              "Emergency fund",
              "Course textbook",
              "Birthday gift for a friend",
              "Savings for laptop plan",
            ],
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+3/Week+3_7.mp4",
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
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "question",
        questionType: "text",
        question:
          "Has that ever happened to you? Having so much freedom that you ended up making a choice you regretted?",
        hasImage: false,
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
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_2.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 4,
        type: "question",
        questionType: "text",
        question:
          "When you hear the word University, one word that definitely comes to your mind is Freedom, right?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_3.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 6,
        type: "question",
        questionType: "text",
        question:
          "What does freedom mean to you? Write one word that describes it best to you.",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 7,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_4.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 8,
        type: "question",
        questionType: "text",
        question:
          "What's one way you plan to organize your time each week in university?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 9,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_5.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 10,
        type: "question",
        questionType: "text",
        question:
          "Looking at this week, what went wrong, and what could have been done differently on Sunday before the week began?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 11,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_6.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 12,
        type: "question",
        questionType: "text",
        question: "What’s one financial mistake you think most students make?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 13,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_7.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 14,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "question",
            questionType: "text",
            question:
              "What kind of people would you like in your university circle?",
            inputType: "bigTextBox",
          },
          {
            stepId: 2,
            type: "socialSkillRating",
            question:
              "Rate how confident you feel about each of these social skills right now with 1 being (not confident) and 5 (very confident):",
            skills: [
              "Meeting new people",
              "Saying no to peer pressure",
              "Resolving disagreements calmly",
              "Keeping friendships balanced with academics",
            ],
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 15,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_8.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 16,
        type: "question",
        questionType: "choice",
        question:
          "You have an exam in four days. You've started studying\nbut you're not confident yet. What do you do?",
        options: [
          "Go, you need a social break and four days is still enough time.",
          "Decline, exams come first, full stop.",
          "Negotiate, ask if you can come for two hours maximum, then leave.",
          "Tell them you'll join virtually for a bit but stay home.",
        ],
        optionLabels: ["A", "B", "C", "D"],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 17,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_9.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 18,
        type: "question",
        questionType: "text",
        question: "Do you think you study better alone or in a group?",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 19,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_10.mp4",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 20,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "choice",
            question:
              "At which point could James have changed the outcome?\nChoose the earliest moment where one different decision\nwould have helped most.",
            options: ["Week 2.", "Week 3.", "Week 4.", "Week 5."],
          },
          {
            stepId: 2,
            type: "question",
            questionType: "text",
            question:
              "When I'm given freedom, how do I usually handle it? Do I manage it well? Or do I sometimes let it get out of control?",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
          },
          {
            stepId: 3,
            type: "checkbox",
            question:
              "Now do a quick self-audit. Choose the area you know you're most likely to struggle with",
            options: [
              "Attending classes consistently",
              "Balancing work and social life",
              "Managing time",
              "Getting enough rest",
            ],
          },
          {
            stepId: 4,
            type: "question",
            questionType: "text",
            question:
              "Write one thing you could do differently to handle this better.",
            inputType: "bigTextBox",
            conditionalOn: {
              stepId: 1,
              optionText: "Others",
              mustBeSelected: true,
            },
          },
        ],
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 21,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+4/Week+4_11.mp4",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+5/Week+5_1.mp4",
        hasNextButton: true,
      },
      {
        id: 2,
        type: "listQuestion",
        question:
          "What are some challenges you think you might deal with as a first year student?",
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
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+5/Week+5_2.mp4",
        hasNextButton: true,
      },
      {
        id: 4,
        type: "question",
        questionType: "text",
        question:
          "Which of these coping skills do you think would help you the most in University?",
        cheatSheet:
          "Journaling, Deep Breathing or Mindfulness, Creative Outlets, Reaching Out for Support, Reframing Setbacks.",
        hasImage: false,
        imageSrc: "mindset.png",
        inputType: "bigTextBox",
        navigation: {
          prev: true,
          next: true,
        },
      },
      {
        id: 5,
        type: "video",
        videoSrc:
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+5/Week+5_3.mp4",
        hasNextButton: true,
      },
      {
        id: 6,
        type: "smart",
        question: "Write down what each letter stands for",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+5/Week+5_4.mp4",
        hasNextButton: true,
      },
      {
        id: 8,
        type: "multiStep",
        steps: [
          {
            stepId: 1,
            type: "question",
            questionType: "text",
            question:
              "Write down a short-term goal for your first semester (e.g., join a club, maintain a 5.0 GPA, make three new friends).",
            hasImage: false,
            imageSrc: "mindset.png",
            inputType: "bigTextBox",
          },

          {
            stepId: 2,
            type: "smart",
            question: "Now make it SMART following the mean of each word. ",
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
          "https://d3sc34m1n26ele.cloudfront.net/Transition_2/Week+5/Week+5_5.mp4",
        hasNextButton: true,
      },
    ],
  },
};


