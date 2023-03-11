const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');
const optionButtons = document.getElementById('btn');

let state = {id: 1};
// requiredState: (currentState) => currentState.path;

function startGame() {
    showTextNode(state.id);
}


  // Typewriter Effect on Nodes
let isTypewriterRunning = false;
let timeoutId;
  
function animateText(txt) {
    isTypewriterRunning = true;
    let i = 0;
    let speed = 10;
    textElement.innerText = "";

    function typeWriter() {
      if (i < txt.length) {
        textElement.innerHTML += txt.charAt(i);
        i++;
        timeoutId = setTimeout(typeWriter, speed);
      } else {
        isTypewriterRunning = false;
      }
    }
  
    typeWriter();
    return timeoutId;
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    animateText(textNode.text);
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }

    textNode.options.forEach(option => {
        if(showOption(option)) {
                const button = document.createElement('button');
                button.innerText = option.text;
                button.classList.add('btn');
                button.addEventListener('click', () => selectOption(option));
                optionButtonsElement.appendChild(button);
        }
    });
}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
    clearTimeout(timeoutId);
    const nextTextNodeId = option.nextText;
    if (nextTextNodeId <= 0) {
        return startGame();
    }
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId);
}

const textNodes = [
    {
        // act: 1
        // CHECKPOINT
        id: 1,
        text: 'You wake up to the sound of roosters crowing and the smell of fresh hay. You sit up in bed and look around your small thatched-roof cottage, taking in the familiar sights of your humble home. As you stretch and rub the sleep from your eyes, you feel a pang of hunger in your stomach.',
        options: [
            {
                text: 'Stay in bed',
                nextText: 2
            },
            {
                text: 'Find food',
                nextText: 3
            }
        ]
    },
    {
        // act: 1
        // ENDING
        id: 2,
        text: 'As you lie in bed, you feel a sense of dread wash over you. You know you should get up and tend to your duties, but the thought of facing another day fills you with a deep sense of exhaustion. You give in to the temptation to stay in bed, reasoning that you can afford to rest for just a little while longer. However, as the hours turn into days and then weeks, you find yourself slipping further and further into a state of apathy. Your body weakens from lack of nutrition and exercise, and you begin to suffer from the effects of prolonged bed rest. Eventually, you become too weak to even get out of bed. As your life slowly fades away, you can\'t help but wonder what could have been if you had only found the strength to get out of bed and face the world.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: state.id
            }
        ]
    },
    {
        // act: 1
        id: 3,
        text: "As you step outside, a cool breeze brushes against your face, carrying the scent of freshly cut grass and blooming wildflowers. The sun is shining bright in the sky, promising a beautiful day ahead. You glance over at the nearby stream, the sparkling water inviting you to come and fish. Excited, you grab your fishing pole and take a moment to consider your options. You could head to the downstream where the water is deeper, or try your luck upstream where the fish might be more plentiful. What will you do?",
        options: [
            {
                text: 'Change your mind and go home',
                nextText: 4
            },
            {
                text: 'Head downstream',
                nextText: 5
            },
            {
                text: 'Head upstream',
                nextText: 6
            }
        ]
    },
    {
        // act: 1
        // ENDING
        id: 4,
        text: 'You take a deep breath and look out at the clear, blue sky. As much as you want to keep searching for food, you know it\'s time to cut your losses and enjoy the rest of your day off. The planting season will be here soon enough, and you\'ll need all your strength for that. But a few weeks later, everything changes. You wake up to find that the sky has turned gray and snow is falling in thick, heavy flakes. It\'s a blizzard, and a bad one at that. As the days turn into weeks, the storm shows no signs of letting up. The snow isn\'t melting like it should, and the sky remains dark and gray. You try to keep warm by huddling close to your fire, but the cold creeps in anyway. Your food supply dwindles rapidly, and you begin to suffer from the effects of exposure. You wonder how long you can keep going like this. The last thing you remember is the eerie silence outside your cabin, and the realization that your time has run out. With a heavy heart, you slip away into the quiet embrace of the snowstorm.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: state.id
            }
        ]
    },
    {
        // act: 1
        id: 5,
        text: 'You make your way downstream, feeling the rocks and pebbles crunching beneath your boots. Eventually, you find a promising spot to fish and settle in, casting your line out into the water. Time passes, but no fish seem to be biting. You can feel frustration building in your chest - should you give up, or try your luck upstream instead?',
        options: [
            {
                text: 'Change your mind and go home',
                nextText: 4
            },
            {
                text: 'Try upstream',
                nextText: 6
            }
        ]
    },
    {
        // act: 1
        id: 6,
        text: 'You trek down to the river, the sound of the rushing water growing louder with each step. As you walk along the bank, you scan the water for any signs of fish or other interesting things. Suddenly, you spot something glittering in the distance, caught between two large rocks. Curiosity piqued, you make your way over and examine the object more closely. It\'s lodged in tightly, but with some effort, you think you can dislodge it.',
        options: [
            {
                text: 'Pick up the object',
                nextText: 7
            },
            {
                text: 'Leave it and go home',
                nextText: 4
            }
        ]
    },
    {
        // act: 2
        id: 7,
        text: 'You extract it from the water and inspect it with some degree of awe. The object is about a foot tall, with an ovoid body and a deep, metallic blue surface that seems to shift and change in the light. The area encompassing the it\'s middle appears to be transparent, and you can see a gentle green glow emanating from within. You feel a sense of astonishment and curiosity as you hold the object in your hands. It looks expensive and valuable, and you can\'t help but wonder who it belongs to. Maybe you could return it to its rightful owner and receive a reward for your honesty. Or perhaps you could trade it in for some coin and use the money to make a better life for yourself.',
        options: [
            {
                text: 'Keep the object in your home, as décor',
                nextText: 8
            },
            {
                text: 'Try and trade the object in town',
                nextText: 9
            },
            {
                text: 'Take the object to the Capital to try and obtain a reward',
                nextText: 10
            }
        ]
    },
    {
        // act: 2
        // ENDING
        id: 8,
        text: 'As you bring the egg-shaped object home, you can\'t help but admire its beauty. It\'s unlike anything you\'ve ever seen before - the smooth surface glows with an otherworldly radiance that fills you with a sense of awe and wonder. You place it on display in your home, where it quickly becomes the talk of the village. People come from far and wide just to catch a glimpse of the mysterious object. But as time goes on, your health starts to decline, and no amount of medicine or remedies can ease the pain that wracks your body. Your family, too, begins to suffer - each generation growing weaker and frailer until the last of your bloodline sputters out of existence. Some would later raise the question if the egg itself was the cause of the familial curse.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: state.id
            }
        ]
    },
    {
        // act: 2
        id: 9,
        text: 'You find yourself growing more and more curious about the mysterious object. You wonder if it could be worth something, if only you could find the right buyer. So, you decide to take the egg-shaped object into town and see if you can get the general goods merchant to give you a good deal.',
        options: [
            {
                text: 'Continue',
                nextText: 12
            }
        ]
    },
    {
        // act: 2
        id: 10,
        text: 'You carefully examine the ornate object, turning it over in your hands and admiring its intricate design. Something this beautiful must have come from the capital, you think to yourself. If you could prove that you found it, surely there would be a reward waiting for you. You pause, considering your next move. Should you stop in town first?',
        options: [
            {
                text: 'Yes',
                nextText: 9
            },
            {
                text: 'No',
                setState: {yellowPath: true},
                nextText: 11
            }
        ]
    },
    {
        // act: 2
        id: 11,
        text: 'With your pack slung over your shoulder and your boots laced up tight, you set out on the long and winding road that leads to the capital.',
        options: [
            {
                text: 'Continue',
                setState: {greenPath: true},
                setState: {id: 20},
                nextText: 20 
            }
        ]
    },
    {
        // act: 2
        id: 12,
        text: 'As you make your way through the winding streets of the village, you take in the sights and sounds around you. The air is filled with the scent of fresh baked bread and the sound of horses\' hooves clattering against the cobblestone streets. The town itself is a bustling hub of activity, with vendors hawking their wares and children playing games in the square. When you finally reach the general goods merchant\'s shop, you find a plump, jolly-looking man behind the counter. He greets you with a friendly smile and a twinkle in his eye. "Well, well, well," he says, eyeing the egg-like object in your hands. "What have we here?"',
        options: [
            {
                text: 'Continue',
                nextText: 13 
            }
        ]
    },
    {
        // act: 2
        id: 13,
        text: 'You explain that it\'s a mysterious object that you found, and that you\'re hoping to get a good price for it. The merchant examines it carefully, turning it over in his hands and muttering to himself."Hmmm," he says finally. "It\'s certainly an interesting piece. I wish I could give you a fair price for it, but I\'m afraid it\'s not something that I could resell. It\'s just too... unusual. The traveling jeweler is in town, you may have better luck there." You nod, disappointed but not entirely surprised. You thank the merchant for his time and head back out into the bustling streets, still wondering what the object could be and what it might be worth.',
        options: [
            {
                text: 'Continue to Capital',
                nextText: 11 
            },
            {
                text: 'Continue to the Jeweler\'s tent',
                nextText: 14 
            },
            {
                text: 'Give up and go home',
                nextText: 8 
            }
        ]
    },
    {
        // act: 2
        id: 14,
        text: 'You venture towards the edge of the village, where the traveling merchants have set up their caravan in a large clearing. The air is thick with the scent of exotic spices and the sound of vendors haggling with potential customers. You make your way through the crowd of people, feeling the excitement of the bustling marketplace around you. As you approach the tent where the jewelers are displaying their wares, you notice a tall, thin man standing behind the counter. His eyes flicker over you as you approach, and he takes a closer look at the object in your hands. You explain that you found it and that you\'re hoping to sell it for a good price.',
        options: [
            {
                text: 'Continue',
                nextText: 15 
            }
        ]
    },
    {
        // act: 2
        id: 15,
        text: 'The jeweler examines the object with a practiced eye, turning it over in his hands and studying it from all angles. After a few moments, he looks up at you with a smirk. "You know, I\'ve never seen anything quite like this before. It\'s certainly an unusual piece. Unfortunately, I can\'t give you an accurate appraisal of its value. It could be worth a fortune, or it could be completely worthless. I can give you a few gold pieces for it. That\'s about what I\'ll probably be able to sell it for"',
        options: [
            {
                text: 'Attempt to haggle',
                nextText: 17
            },
            {
                text: 'Accept jeweler\'s deal',
                nextText: 16
            }
        ]
    },
    {
        // act: 2
        id: 16,
        text: 'You take a deep breath and look out at the clear, blue sky. As much as you want a better deal for the object, you know it\'s time to cut your losses and enjoy the rest of your day off. The planting season will be here soon enough, and you\'ll need all your strength for that. You pocket the gold and head home. But a few weeks later, everything changes. You wake up to find that the sky has turned gray and snow is falling in thick, heavy flakes. It\'s a blizzard, and a bad one at that. As the days turn into weeks, the storm shows no signs of letting up. The snow isn\'t melting like it should, and the sky remains dark and gray. You try to keep warm by huddling close to your fire, but the cold creeps in anyway. Your food supply dwindles rapidly, and you begin to suffer from the effects of exposure. You wonder how long you can keep going like this. The last thing you remember is the eerie silence outside your cabin, and the realization that your time has run out. With a heavy heart, you slip away into the quiet embrace of the snowstorm.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: state.id
            }
        ]
    },
    {
        // act: 2
        id: 17,
        text: 'The jeweler shakes his head, "I\'m serious, that\'s my best offer." As you look down in disappointment, the jeweler notices and adds, "But don\'t let that discourage you. There are other options to consider. You could take it to some collectors who might be interested in unusual pieces like this, but they\'re hard to come by." He takes a moment to think before continuing, "However, I do have another suggestion for you. Take it to the citadel of mages. They have a keen eye for these kinds of things and could probably give you a better idea of its worth."',
        options: [
            {
                text: 'Accept jeweler\'s deal',
                nextText: 16
            },
            {
                text: '"Do you think I could get a reward in the Capital?"',
                nextText: 18
            }, 
            {
                text: 'Journey to Capital',
                nextText: 11
            },
            {
                text: 'Journey to Citadel',
                nextText: 19
            }
        ]
    },
    {
        // act: 2
        id: 18,
        text: 'The jeweler\'s boisterous laugh bounces off the nearby tents, echoing through the clearing. "There are plenty of wealthy collectors who are always on the lookout for unique pieces like this. Of course, finding an honest fellow who will give you a fair price is another matter entirely."',
        options: [
            {
                text: 'Accept jeweler\'s deal',
                nextText: 16
            },
            {
                text: 'Journey to Capital',
                nextText: 11
            },
            {
                text: 'Journey to Citadel',
                nextText: 19
            }
        ]
    },
    {
        // act: 2
        id: 19,
        text: 'You embark on your journey towards the Citadel and as the village fades into the distance behind you, you feel a sense of excitement mixed with apprehension.',
        options: [
            {
                text: 'Continue',
                setState: {purplePath: true},
                setState: {id: 20},
                nextText: 20 
            }
        ]
    },
    {
        // act: 3
        id: 20,
        text: 'As the sun begins to dip below the horizon, casting an orange glow across the sky, you start to look for a suitable place to make camp. You scan the surrounding area, taking note of the terrain and the available resources. You see a clearing nearby with plenty of firewood, but it\'s also exposed and could be vulnerable to predators. Alternatively, you spot a cave in the distance that could provide sturdy shelter and protection, though you\'re unsure of what could be hiding inside. A third option is camping by the river, where the water acts as a natural barrier against attackers from at least one direction. You consider your choices.',
        options: [
            {
                 
            }
        ]
    },
]

startGame();