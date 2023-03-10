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
    }
]

startGame();