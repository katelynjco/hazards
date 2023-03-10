const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');

let state = {};
// requiredState: (currentState) => currentState.path;

function startGame() {
    state = {};
    showTextNode(1);
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    textElement.innerText = textNode.text;
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
        text: 'You wake up with the sunlight streaming in through your window. As you look outside to admire the beautiful day, your stomach growls.',
        options: [
            {
                text: 'Stay in bed',
                nextText: 2
            },
            {
                text: 'Go look for food',
                nextText: 3
            }
        ]
    },
    {
        // act: 1
        // ENDING
        id: 2,
        text: 'You sit there in protest as your body slowly withers away. After some time you subcumb to malnutrition.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: -1
            }
        ]
    },
    {
        // act: 1
        id: 3,
        text: 'The weather outside looks promising so you decide to go fishing. You grab your pole and consider your options.',
        options: [
            {
                text: 'Change your mind and go home',
                nextText: 4
            },
            {
                text: 'Try the local pond',
                nextText: 5
            },
            {
                text: 'Try the river',
                nextText: 6
            }
        ]
    },
    {
        // act: 1
        // ENDING
        id: 4,
        text: 'You decide to cut your losses and enjoy the rest of your day. It is nice out and you might as well enjoy a day off before planting season sets in. A couple of weeks later an unexpected blizzard hits your area, impacting your ability to fish, hunt, and grow food. Unfortunately, you do not survive the mysterious late winter storm.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: -1
            }
        ]
    },
    {
        // act: 1
        id: 5,
        text: 'You venture over to the local pond and settle into a spot close to the water. Some time passes and no fish have bitten your line.',
        options: [
            {
                text: 'Change your mind and go home',
                nextText: 4
            },
            {
                text: 'Try the river',
                nextText: 6
            }
        ]
    },
    {
        // act: 1
        id: 6,
        text: 'You trek down to the river and walk along the bank. In the distance you spot an object glittering in the water.',
        options: [
            {
                text: 'Take the object home with you',
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
        text: 'You pick up the object from the water and inspect it with some degree of awe. It is about a foot tall with an ovoid body a deep, metallic gold surface. The area encompassing the object*s middle appears to be transparent and glowing a gentle green. Overall, it looks expensive and will surely be missed. Maybe you could get some kind of reward for finding it? Or maybe you can trade it in for some coin?',
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
        text: 'You bring the egg-like object home and and put it on dispaly for it*s beauty. Life goes on and your family grows. Slowly you grow older, weaker, and sickness creeps in. Pain wracks your body, and even the leeches used to bleed you become weak. Finally, you subcumb. The ornate object is passed down as an heirloom. But the weakness persists in your bloodline. Each generation growing frailer until the last of your family tree sputters out of existence. Some would later raise the question if the heirloom itself was the cause of the familial curse.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: -1
            }
        ]
    },
    {
        // act: 2
        id: 9,
        text: 'You decide to take the object into town and see if you can get the general goods merchant to give you a good deal',
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
        text: 'You figure that something so ornate would likely have come from the capital. You decide to venture out and try and obtain a reward for your find. You pause. Should you stop in town first?',
        options: [
            {
                text: 'Yes',
                nextText: 9
            },
            {
                text: 'No',
                nextText: 11
            }
        ]
    },
    {
        // act: 2
        id: 11,
        text: 'You set out on the long journey to the capital',
        options: [
            {
                text: 'Continue',
                nextText: 11 
                // MOVE TO ACT3
            }
        ]
    },
]

startGame();