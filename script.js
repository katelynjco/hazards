const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');
const optionButtons = document.getElementsByClassName('btn');
const title = document.querySelector('.title');
const backButton = document.getElementById('back-btn');
const speechSwitch = document.querySelector('.speech-switch input[type="checkbox"]');
const musicSwitch = document.querySelector('.music-switch input[type="checkbox"]');
const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const audioElement = document.getElementById('audio');
const iframe = document.querySelector('iframe');


let state = {id: 1};
// requiredState: (currentState) => currentState.path;

function startGame() {
    showTextNode(state.id);
}

// Speech to Text
// VoiceRSS Javascript SDK
const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};


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
    // Pull and display text
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    let text = textNode.text;
    // Passing Text Node to VoiceRSS API
    function tellMe(text) {
        VoiceRSS.speech ({
            key: 'f028771698b8436887263ba25fa03ed9',
            src: text,
            hl: 'en-us',
            r: 0,
            c: 'mp3',
            f:'44khz_16bit_stereo',
            ssml: false
        });
        }
    // If toggle on, play speech to text
    if(speechSwitch.checked === true) {
            tellMe(text);
    }
    animateText(text);
    // Option Butons
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
    audioElement.pause();
    showTextNode(nextTextNodeId);
}

function hideMenu() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.style.visibility = 'hidden';
    
}
  
function showMenu() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.style.visibility = 'inherit';
}

function switchTheme(event) {
    if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}


// Youtube Api for background music
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: '-ae4GgctPaM',
          playerVars: {
            'playsinline': 1,
            playlist: 'i0sHgijeBNM',
            loop: 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        function playMusic (event) {
            if (musicSwitch.checked === true) {
                player.unMute();
            } else {
                player.mute();;
            }
        }
        musicSwitch.addEventListener('change', playMusic);
      }

      // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        player.seekTo(0);
        player.mute();
        event.target.setPlaybackRate(0.75);
        event.target.setVolume(20);
        event.target.playVideo(1);
     }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
    }

themeSwitch.addEventListener('change', switchTheme);
title.addEventListener('click', showMenu);
backButton.addEventListener('click', hideMenu);

const textNodes = [
    // ACT 1
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
                nextText: 3,
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
        text: "As you step outside, a cool breeze brushes against your face, carrying the scent of early blooming wildflowers. The sun is shining bright in the sky, promising a beautiful day ahead. You glance over at the nearby stream, the sparkling water inviting you to come and fish. Excited, you grab your fishing pole and take a moment to consider your options. You could head downstream where the water is deeper, or try your luck upstream where the fish might be more plentiful. What will you do?",
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
        text: 'You trek down river, the sound of the rushing water growing louder with each step. As you walk along the bank, you scan the water for any signs of fish or other interesting things. Suddenly, you spot something glittering in the distance, caught between two large rocks. Curiosity piqued, you make your way over and examine the object more closely. It\'s lodged in tightly, but with some effort, you think you can dislodge it.',
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
    // ACT 2
    {
        // act: 2
        id: 7,
        text: 'You extract it from the water and inspect it with some degree of awe. The object is about a foot tall, with an ovoid body and a deep, metallic blue surface that seems to shift and change in the light. The area encompassing it\'s middle appears to be transparent, and you can see a gentle green glow emanating from within. You feel a sense of astonishment as you hold the object in your hands. It looks valuable and you can\'t help but wonder who it belongs to. Maybe you could return it to its rightful owner and receive a reward for your honesty. Or perhaps you could trade it in for some coin and use the money to make a better life for yourself.',
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
        text: 'As you bring the egg-shaped object home, you can\'t help but admire its beauty. It\'s unlike anything you\'ve ever seen before - the smooth surface glows with an otherworldly radiance that fills you with a sense of awe and wonder. You place it on display in your home, where it quickly becomes the talk of the village. People come from far and wide just to catch a glimpse of the mysterious object. But as time goes on, your health starts to decline, and no amount of medicine or remedies can ease the pain that wracks your body. Your family, too, begins to suffer - each generation growing weaker and frailer until the last of your bloodline sputters out of existence. Some would later raise the question if the strange egg itself was the cause of the ancestral curse.',
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
                setState: {yellowPath: false},
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
                setState: {
                    purplePath: false,
                    greenPath: true,
                    id: 20
                },
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
        text: 'You explain that it\'s a mysterious object that you found, and that you\'re hoping to get a good price for it. The merchant examines it carefully, turning it over in his hands and muttering to himself. "Hmmm," he says finally. "It\'s certainly an interesting piece. I wish I could give you a fair price for it, but I\'m afraid it\'s not something that I could resell. It\'s just too... unusual. The traveling jeweler is in town, you may have better luck there." You nod, disappointed but not entirely surprised. You thank the merchant for his time and head back out into the bustling streets, still wondering what the object could be and what it might be worth.',
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
        text: 'The jeweler examines the object with a practiced eye, turning it over in his hands and studying it from all angles. After a few moments, he looks up at you with a smirk. "You know, I\'ve never seen anything quite like this before. It\'s certainly an unusual piece. Unfortunately, I can\'t give you an accurate appraisal of its value. It could be worth a fortune, or it could be completely worthless. I can give you a few gold pieces for it. That\'s about what I\'ll probably be able to sell it for."',
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
                setState: {
                    purplePath: true,
                    greenPath: false,
                    id: 20
                },
                nextText: 20 
            }
        ]
    },
    // ACT 3
    {
        // act: 3
        id: 20,
        text: 'As the sun begins to dip below the horizon, casting an orange glow across the sky, you start to look for a suitable place to make camp. You scan the surrounding area, taking note of the terrain and the available resources. You see a clearing nearby with plenty of firewood, but it\'s also exposed and could be vulnerable to predators. Alternatively, you spot a cave in the distance that could provide sturdy shelter and protection, though you\'re unsure of what could be hiding inside. A third option is camping by the river, where the water acts as a natural barrier against attackers from at least one direction. You consider your choices.',
        options: [
            {
                text: 'Camp in the clearing',
                nextText: 24
            },
            {
                text: 'Camp in the cave',
                nextText: 21
            },
            {
                text: 'Camp by the river',
                nextText: 22
            }
        ]
    },
    {
        // act: 3
        // ENDING
        id: 21,
        text: 'After much deliberation, you decide to take your chances with the cave. You cautiously make your way to the cave, navigating the treacherous ground. Inside, the cool and damp space is musty, with rocky walls and an uneven floor. Despite finding no signs of recent occupancy, an unsettling feeling creeps over you. As night falls, you light a fire and settle in. Every creak and rustle makes you jump, and your imagination runs wild. Just as you start to drift off, a deep growl shatters the silence. You reach for the hammer in your pack, but it\'s too late. The bear charges and attacks, tearing into your flesh. You make a fine meal.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 22,
        text: 'After careful consideration, you opt to camp by the river. You set up your tent and build a fire, feeling secure with the water behind you. As the night wears on, you drift off to sleep. You\'re abruptly awoken by the sound of rustling and footsteps. Your heart races as you sit up, ready to defend yourself. In the flickering light of the dying fire, you see several shadowy figures approaching your campsite. As they emerge from the darkness, you realize with a sinking feeling that they\'re bandits, armed and dangerous. They eye you suspiciously, weapons at the ready. What do you do?',
        options: [
            {
                text: 'Drop supplies and run!',
                setState: {yellowPath: true},
                nextText: 24
            },
            {
                text: 'Defend yourself!',
                nextText: 23
            }
        ]
    },
    {
        // act: 3
        id: 23,
        text: 'As you stand with your back against the river, you grip your trusty hammer tightly, taking comfort in its weight and familiarity. "I don\'t want any trouble," you say, trying to edge around the men who are blocking your path. But they only laugh and begin to advance towards you. With no other options, you raise your hammer in defense. The bandits rush forward, swinging their weapons at you. You manage to fend off their attacks, striking back with calculated blows of your own. However, the fight is not without consequence. Despite your best efforts, you sustain several injuries in the scuffle. But in the end, your determination and skill with the hammer prove too much for the men, and they retreat into the darkness, leaving you alone with your wounds and the realization that you must remain vigilant.',
        options: [
            {
                text: 'Continue',
                nextText: 24
            }
        ]
    },
    {
        // act: 3
        id: 24,
        text: 'The rest of the night passes without incident, and the first rays of sunlight breaking the horizon wake you from your slumber. As you stretch and take in your surroundings, you feel a familiar pang of hunger in your stomach.',
        options: [
            {
                text: 'Continue',
                nextText: 25,
                requiredState: (currentState) => currentState.yellowPath === true 
            },
            {
                text: 'Eat a small breakfast from your pack',
                nextText: 32,
                requiredState: (currentState) => currentState.yellowPath === false || currentState.yellowPath === undefined
            },
        ]
    },
    {
        // act: 3
        id: 25,
        text: 'Without supplies, the journey ahead will be challenging. The road often presents obstacles that make survival difficult, particularly when it comes to food. How do you plan to sustain yourself along the way?',
        options: [
            {
                text: 'Eat the object',
                nextText: 26,
            },
            {
                text: 'Hunt for meat',
                nextText: 27,
            },
            {
                text: 'Forage for food',
                nextText: 30,
            }
        ]
    },
    {
        // act: 3
        // Ending
        id: 26,
        text: 'You examine the object, and note its shape resembles that of an egg, which could indicate it\'s edible. You reach into your pack and retrieve your trusty hammer. After a strong swing, the egg cracks open with a loud noise, and you peer inside. However, a sudden dizziness overtakes you, and your stomach churns, causing you to lose your appetite. In no time, you collapse, succumbing to unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 27,
        text: 'What method will you use to hunt with?',
        options: [
            {
                text: 'Fish',
                nextText: 28
            },
            {
                text: 'Set Traps',
                nextText: 29
            }
        ]
    },
    {
        // act: 3
        id: 28,
        text: 'With a satisfied burp, you lean back. Your hard work has paid off, and your hunger has been satiated.',
        options: [
            {
                text: 'Continue',
                nextText: 32
            },
        ]
    },
    {
        // act: 3
        id: 29,
        text: 'Cursing under your breath, you slump back in frustration, realizing that your efforts have been in vain. With no tangible results to show for your endeavors, you make the tough decision to cut your losses and push ahead with your journey, despite your gnawing hunger.',
        options: [
            {
                text: 'Continue',
                nextText: 32
            },
        ]
    },
    {
        // act: 3
        id: 30,
        text: 'You meander through the nearby woods and scavenge breakfast from the surrounding foliage. After some time, you assess your findings: a handful of plump, dark, round berries and some peculiar-looking pale mushrooms. What will you choose to eat?',
        options: [
            {
                text: 'Eat neither',
                nextText: 29
            },
            {
                text: 'Eat both',
                nextText: 31
            },
            {
                text: 'Eat the mushrooms',
                nextText: 31
            },
            {
                text: 'Eat the berries',
                nextText: 28
            }
        ]
    },
    {
        // act: 3
        // Ending
        id: 31,
        text: 'After a satisfying belch, you lean back, feeling content. Your efforts have paid off, and your hunger has been satiated. You take a moment to bask in the feeling before packing up your campsite and resuming your journey. As you trek on and make good headway, an unpleasant sensation begins to build in your gut. Cramps wrack your body, and your stomach empties itself in violent spasms. The pain becomes unbearable, and you gradually slip into unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 32,
        text: 'As you continue your journey, you cover some distance before stumbling upon three men gathered around a campfire just off the road. They\'re clad in ratty, faded robes, and their haggard appearance hints at a hard life. Upon noticing your approach, they acknowledge you with a friendly greeting and extend an invitation to join them by the fire.',
        options: [
            {
                text: 'Refuse their offer',
                nextText: 36
            },
            {
                text: 'Join them by the fire',
                nextText: 33
            },
        ]
    },
    {
        // act: 3
        id: 33,
        text: 'Grateful for their generosity, you express your appreciation and accept their kind offer. You take a place by the fire, relishing in the warmth that chases away the chill of the crisp breeze accompanying looming grey clouds. As you take a closer look at the men, you notice that they are all wearing the same faded mage robes made of mottled velvet, with intricate patterns woven around the sleeves and hoods. Despite the wear, you can tell that these garments were once a lush, vibrant green. The strangers strike up a conversation with you, and you recount the details of your journey thus far. You reach into your pack and retrieve the object, holding it up for the men to see. Their eyes widen with greed as they gaze upon it.',
        options: [
            {
                text: 'Continue',
                nextText: 45,
                requiredState: (currentState) => currentState.purplePath === true
            },
            {
                text: 'Continue',
                nextText: 34,
                requiredState: (currentState) => currentState.greenPath === true 
            }
        ]
    },
    {
        // act: 3
        id: 34,
        text: 'The expression on one of the men\'s faces begins to sour, and his tone takes on a menacing edge. "Headed to the capital, are you?" he sneers. "Well, you won\'t find what you\'re looking for there." He spits on the ground for emphasis. "Maybe it\'s best if you just hand over that egg and your pack, and turn back while you still can." As you look at the other two strangers, you notice that they seem uncomfortable and avoid eye contact with you. It dawns on you that these men are trying to rob you.',
        options: [
            {
                text: 'Continue',
                nextText: 35,
            },
        ]
    },
    {
        // act: 3
        id: 35,
        text: 'One of the other men steps forward and addresses you. His voice is tinged with bitterness as he speaks, "Look, we\'re not bad people. We\'re just down on our luck, same as you. The only difference is that the empire caused our misfortune. We were forced to leave our home." He shrugs apologetically, "We\'re just trying to survive however we can." Despite the situation, you can\'t help but feel a pang of empathy for the strangers. You understand all too well how difficult life can be, and the King\'s unjust rule has made things even harder for everyone. Still, you can\'t just let them rob you. What do you do?',
        options: [
            {
                text: 'Drop supplies and run!',
                setState: {yellowPath: true},
                nextText: 36
            },
            {
                text: 'Defend yourself!',
                nextText: 37
            }
        ]
    },
    {
        // act: 3
        id: 36,
        text: 'The men start to stalk towards you, and you realize that you wouldn\'t be able to take all three of them at once. With that thought in mind, you quickly drop your supplies and turn to run up the road as fast as you can.',
        options: [
            {
                text: 'Continue',
                nextText: 50
            },
        ]
    },
    {
        // act: 3
        id: 37,
        text: 'What is your game plan?',
        options: [
            {
                text: 'Use a distraction',
                nextText: 40
            },
            {
                text: 'Hit them with a haymaker',
                nextText: 38
            },
            {
                text: 'Go in swinging with your hammer',
                nextText: 39
            },
        ]
    },
    {
        // act: 3
        // Ending
        id: 38,
        text: 'The men move closer to you, their hostile intent clear. You steel yourself for a fight, bracing for impact. With a burst of adrenaline, you charge forward and scream nonsense, hoping to intimidate the mages. "LEEEERRROOOYYY JEEEENNNKKKIIINNS!!!" you cry out. You land a solid punch on the first man, but as you turn to face the others, you realize they are more powerful than you thought. Despite your best efforts, they overpower you, dealing blow after blow until you feel your body giving in. Your vision blurs, and you feel yourself slipping away into unconsciousness."',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 39,
        text: 'You reach into your pack and feel the reassuring weight of your trusty hammer. With a confident flourish, you pull it out and let out a fierce battle cry as you charge toward the men. Your hammer comes down with a powerful swing, connecting with the closest man and sending him crumpling to the ground. The other two men turn and run toward the treeline, but not before one of them throws a fireball at you. You manage to jump out of the way but are badly singed by the blast.',
        options: [
            {
                text: 'Continue',
                nextText: 50
            }
        ]
    },
    {
        // act: 3
        id: 40,
        text: 'How will you distract the men?',
        options: [
            {
                text: 'Throw the egg at them!',
                nextText: 41
            },
            {
                text: 'Rob them first!',
                nextText: 38
            },
            {
                text: 'Threaten to destroy the egg!',
                nextText: 42
            },
        ]
    },
    {
        // act: 3
        // Ending
        id: 41,
        text: 'You tightly grip the object in your hand and heave it at the men. Their faces pale as they scramble backwards, but it\'s too late. The egg crashes to the ground, landing on a nearby stone with a loud cracking sound. It splits open down the middle, and the gentle green glow from within intensifies. The mages look even more terrified now, and a sudden wave of nausea hits you like a ton of bricks. You collapse, slipping out of consciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 42,
        text: 'You draw your hammer from your pack and hold the head against the object. "What if I smash it?" you demand, putting as much malice into your voice as you can muster. One of the men turns pale at the suggestion, but another laughs mockingly. "After coming all this way? I doubt you\'d be so quick to destroy something of such potential value," he sneers, taking a step closer. "Just hand it over, and we\'ll let you go on your way."',
        options: [
            {
                text: 'Bluff harder',
                nextText: 44
            },
            {
                text: 'I wasn\'t bluffing...',
                nextText: 43
            }
        ]
    },
    {
        // act: 3
        // Ending
        id: 43,
        text: 'You let out a crazed laugh as you raise your hammer high above your head and bring it down with all your might onto the egg. It shatters into pieces with a deafening crack, and the green glow emanating from it intensifies. The men recoil in horror. Suddenly, a powerful wave of nausea washes over you, and you collapse to the ground, consciousness slipping away.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 44,
        text: 'As you grip the handle of your hammer tightly and begin to swing it down towards the egg, the mages\' faces turn ashen as they realize what you\'re about to do. The air is thick with tension and the sound of your breathing. Just as you\'re about to strike, the one who has remained silent suddenly springs into action. He grabs the other two by the back of their robes and begins to drag them away towards the trees, his movements quick and fluid like a panther. You watch them disappear into the darkness, and a sense of relief washes over you. You lower your hammer, feeling satisfied.',
        options: [
            {
                text: 'Continue',
                nextText: 50
            }
        ]
    },
    {
        // act: 3
        id: 45,
        text: '"You know, we\'re mages," one of the men says enthusiastically, his gaze fixed on the object. "We could take the egg to the citadel for you and save you the trouble. We\'d be happy to deliver the payment directly to your village." The man\'s words sound too good to be true, and a sense of unease washes over you.',
        options: [
            {
                text: 'Accept',
                nextText: 46
            },
            {
                text: 'Reject',
                nextText: 47
            }
        ]
    },
    {
        // act: 3
        // Ending
        id: 46,
        text: 'As you walk back to your village, you can\'t help but feel a sense of unease. You begin to second-guess your decision to trust those strangers with the precious object. What if they were lying about delivering it to the citadel? What if they were planning to keep it for themselves? You try to shake off the feeling and focus on getting home. The journey back is uneventful, and you arrive in your village exhausted but relieved. However, as you try to catch up on some sleep, you can\'t help but feel that something is off. The village seems quieter than usual, and the weather takes a turn for the worse. Thick snowflakes fall from the sky, quickly turning into a blizzard. As the days turn into weeks, the storm shows no signs of letting up. The snow isn\'t melting like it should, and the sky remains dark and gray. You try to keep warm by huddling close to your fire, but the cold creeps in anyway. Your food supply dwindles rapidly, and you begin to suffer from the effects of exposure. You wonder how long you can keep going like this. The last thing you remember is the eerie silence outside your cabin, and the realization that your time has run out. With a heavy heart, you slip away into the quiet embrace of the snowstorm.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 3
        id: 47,
        text: 'You give a polite but firm refusal, taking a step back towards the road. However, the men move to block your path, and one of them speaks up with a menacing tone. "For your own good, I\'m going to recommend dropping the pack and egg, and turning back the way you came." As you observe the other two strangers, you notice their discomfort and avoidance of eye contact. It becomes clear to you that these men are not merely offering help, but rather attempting to rob you.',
        options: [
            {
                text: 'Continue',
                nextText: 35
            }
        ]
    },
    // Act 4
    {
        // act: 4
        id: 50,
        text: 'You continue on your journey. As the day wears on, fatigue sets in and you feel the weight of exhaustion bearing down on you. With the sun casting long shadows across the ground, you begin to search for a suitable place to make camp. Your eyes scan the surroundings, looking for any signs of shelter or resources. In the distance, you spot a clearing that catches your attention, with an abundance of firewood. However, its exposed location raises concerns about potential predator attacks. As you continue your search, you notice a cave entrance nearby, which offers a promising option for sturdy shelter and protection from the elements. But uncertainty about what may lurk inside gives you pause. Finally, you come across an abandoned shack, but you\'re unsure about its structural integrity. You carefully consider your options.',
        options: [
            {
                text: 'Camp in the clearing',
                setState: {id: 50},
                nextText: 53
            },
            {
                text: 'Camp in the shack',
                setState: {id: 50},
                nextText: 52
            },
            {
                text: 'Camp by the cave',
                setState: {id: 50},
                nextText: 51
            }
        ]
    },
    {
        // act: 4
        // ENDING
        id: 51,
        text: 'After much consideration, you make the decision to take a chance with the cave. You carefully make your way through the hazardous terrain and enter the cave, which is cool and damp, with rough walls and an uneven floor. Despite not finding any indications of recent human activity, an uneasy feeling starts to creep up on you. As night falls, you build a fire and settle down. Every noise and movement makes you startle, and your mind begins to race. Just as you begin to doze off, a low growl breaks the silence. You reach for the hammer in your backpack, but it\'s too late. The bear charges at you, attacking and ripping your flesh. You make a fine meal.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 50
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 4
        id: 52,
        text: 'The remainder of the night goes by uneventfully, and the initial beams of sunlight peeking over the horizon rouse you from your sleep. You stretch and observe your surroundings, experiencing a recognizable twinge of hunger in your belly.',
        options: [
            {
                text: 'Continue',
                nextText: 57,
                requiredState: (currentState) => currentState.yellowPath === true 
            },
            {
                text: 'Eat a small breakfast from your pack',
                nextText: 64,
                requiredState: (currentState) => currentState.yellowPath === false || currentState.yellowPath === undefined
            },
        ]
    },
    {
        // act: 4
        id: 53,
        text: 'You opt to take your chances in the clearing, and with an abundance of wood, you successfully build a roaring fire. You settle beside the flames and gradually drift off to sleep. However, the rustling of leaves abruptly awakens you. As you look up, you notice a large grey wolf at the edge of the clearing, intently staring at you. A shiver runs down your spine, and you quickly scan the tree line behind it, spotting numerous pairs of eyes glaring at you from the darkness. What do you do?',
        options: [
            {
                text: 'Defend yourself!',
                nextText: 56
            },
            {
                text: 'Drop supplies and run!',
                setState: {yellowPath: true},
                nextText: 55
            },
            {
                text: 'Try to placate the wolf',
                nextText: 54,
                requiredState: (currentState) => currentState.yellowPath === false || currentState.yellowPath === undefined
            }
        ]
    },
    {
        // act: 4
        id: 54,
        text: 'You begin to speak in a soft tone to the wolf, complimenting its beauty while maintaining a safe distance. Carefully, you reach into your pack, taking out some jerky you had packed for your journey, and toss it to the animal. The wolf carefully sniffs the offering before devouring it. After finishing the snack, it sniffs towards your direction and seems content. Gradually, the pack of wolves retreat from the firelight, and you release a sigh of relief.',
        options: [
            {
                text: 'Continue',
                setState: {wolfFren: true},
                nextText: 52
            },
        ]
    },
    {
        // act: 4
        id: 55,
        text: 'As you gaze at the wolf, a sense of impending doom washes over you, and you realize that you wouldn\'t survive this encounter. In a moment of panic, you hastily grab your pack and sprint in the opposite direction, nimbly hurdling over branches and rocks in your path. As you navigate your way out of the clearing, you hear a coughing sound that almost resembles laughter emanating from behind you.',
        options: [
            {
                text: 'Continue',
                nextText: 52
            },
        ]
    },
    {
        // act: 4
        id: 56,
        text: 'You swiftly scramble towards your pack, retrieving your trusty hammer. The wolf\'s ears flatten against its head as it bares its teeth, emitting a menacing snarl. Without hesitation, you raise your hammer, and the animal lunges towards you, sinking its teeth into your leg. With a forceful blow, you bring the hammer down, dislodging the creature. It limps away, retreating towards the treeline, and the menacing eyes lurking in the darkness vanish. Though you were successful in fending off the animals, you sustained severe injuries in the process.',
        options: [
            {
                text: 'Continue',
                nextText: 52
            },
        ]
    },

    {
        // act: 4
        id: 57,
        text: 'Without supplies, the journey ahead will be challenging. The road often presents obstacles that make survival difficult, particularly when it comes to food. How do you plan to sustain yourself along the way?',
        options: [
            {
                text: 'Eat the object',
                nextText: 58,
            },
            {
                text: 'Forage for food',
                nextText: 62,
            },
            {
                text: 'Hunt for meat',
                nextText: 59,
            }
        ]
    },
    {
        // act: 4
        // Ending
        id: 58,
        text: 'You examine the object, and note its shape resembles that of an egg, which could indicate it\'s edible. You reach into your pack and retrieve your trusty hammer. After a strong swing, the egg cracks open with a loud noise, and you peer inside. However, a sudden dizziness overtakes you, and your stomach churns, causing you to lose your appetite. In no time, you collapse, succumbing to unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 50
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 4
        id: 59,
        text: 'What method will you use to hunt with?',
        options: [
            {
                text: 'Fish',
                nextText: 61
            },
            {
                text: 'Set Traps',
                nextText: 60
            }
        ]
    },
    {
        // act: 4
        id: 60,
        text: 'With a satisfied burp, you lean back. Your hard work has paid off, and your hunger has been satiated.',
        options: [
            {
                text: 'Continue',
                nextText: 64
            },
        ]
    },
    {
        // act: 4
        id: 61,
        text: 'Cursing under your breath, you slump back in frustration, realizing that your efforts have been in vain. With no tangible results to show for your endeavors, you make the tough decision to cut your losses and push ahead with your journey, despite your gnawing hunger.',
        options: [
            {
                text: 'Continue',
                nextText: 64
            },
        ]
    },
    {
        // act: 4
        id: 62,
        text: 'You meander through the nearby woods and scavenge breakfast from the surrounding foliage. After some time, you assess your findings: a handful of wide, bright orange mushrooms, and branch of hard, purple berries. What will you choose to eat?',
        options: [
            {
                text: 'Eat neither',
                nextText: 61
            },
            {
                text: 'Eat both',
                nextText: 63
            },
            {
                text: 'Eat the mushrooms',
                nextText: 60
            },
            {
                text: 'Eat the berries',
                nextText: 63
            }
        ]
    },
    {
        // act: 4
        // Ending
        id: 63,
        text: 'Following a satisfying belch, you lean back and feel a deep sense of satisfaction. Your efforts have paid off, and your hunger has finally been satiated. You take a moment to savor the feeling before packing up your campsite and resuming your journey. As you continue to trek, you make steady progress, but soon notice something is amiss. Your vision blurs, and your skin starts to itch. Breathing becomes laborious, and you feel like you\'re losing control over your body. Despite your best efforts, you gradually slip into unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 50
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 4
        id: 64,
        text: 'As you press on with your journey, the sky gradually darkens and turns a dismal shade of grey. The wind begins to pick up, howling fiercely and tearing through your clothes, leaving you shivering to the bone. Soon, raindrops start to pour down from the heavens, drenching you to your very core. Your heart sinks at the thought of carrying on in these treacherous conditions.',
        options: [
            {
                text: 'Continue',
                nextText: 65
            },
        ]
    },
    {
        // act: 4
        id: 65,
        text: 'Just as you\'re about to lose hope, you stumble upon a lone traveling bard taking refuge from the elements under a makeshift lean-to, constructed against some nearby trees. Drapped over his body is a flowing red cloak, adorned with white trimmings. The hood is drawn down low, concealing his eyes from view, but you can make out a bushy beard sprouting from his cheeks and chin.  As the man strums his lute, a haunting melody fills the air, soothing your weary soul. The bard seems just as tired as you are from his own journey, but the warmth of his roaring campfire and the shelter of his lean-to beckon to you, making you long for a moment\'s respite to dry off your sodden clothes and warm your chilled bones.',
        options: [
            {
                text: 'Rob the bard',
                nextText: 66
            },
            {
                text: 'Ask to share the fire',
                nextText: 67
            },
            {
                text: 'Continue on your journey',
                nextText: 79
            },
        ]
    },
    {
        // act: 4
        // Ending
        id: 66,
        text: 'You move closer, reaching for your hammer and holding it steadily at the man\'s throat. "I don\'t want any trouble," you say firmly, "just give me your supplies and I\'ll be on my way." The bard\'s looks up at you, gaze meeting yours and revealing bloodshot eyes ringed with dark circles. Before you can react, he deftly grabs your hammer, pulling you in close as he plunges a long, curved dagger into your side. You gasp in shock and pain, falling to the ground as your vision fades. The stranger goes back to strumming his lute, and you feel your life slipping away as darkness overtakes you.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 50
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 4
        id: 67,
        text: 'Upon hearing your request to warm yourself by the fire, the man gestures to the open space opposite him, inviting you to take a seat. You offer your gratitude and gratefully settle down by the fire, relieved to find shelter from the harsh weather. As you steal a glance at the man across from you, you notice a friendly smile playing at the corners of his mouth, although his eyes remain obscured by the hood of his cloak. The sound of his lute playing provides a peaceful backdrop to your thoughts. It occurs to you that, as a traveling bard, the man might have interesting stories from his journey that could offer clarity for your own path.',
        options: [
            {
                text: 'Ask questions',
                nextText: 68
            },
            {
                text: 'Continue on your journey',
                nextText: 78
            },
        ]
    },
    {
        // act: 4
        id: 68,
        text: 'You take a deep breath and gingerly break the silence, carefully gauging the man\'s reaction as you recount your journey so far. The bard listens intently, nodding thoughtfully as you speak, though you leave out the details about the egg. When you finish, you turn to him and ask if he might have any insight to offer. "Depends what you\'re seeking clarity on," he replies, his voice warm and inviting.',
        options: [
            {
                text: 'Why are mages being displaced?',
                nextText: 69
            },
            {
                text: 'What can you tell me about dragons?',
                nextText: 72
            },
            {
                text: 'What can you tell me about the citadel?',
                nextText: 74,
                requiredState: (currentState) => currentState.greenPath === false || currentState.greenPath === undefined
            },
            {
                text: 'What can you tell me about the capital?',
                nextText: 76,
                requiredState: (currentState) => currentState.purplePath === false || currentState.purplePath === undefined
            },
            {
                text: 'Continue on your journey',
                nextText: 78
            }
        ]
    },
    {
        // act: 4
        id: 69,
        text: '"The mages of the citadel practice a form of magic known as alchemy," the bard explains, leaning forward slightly as he speaks. "It\'s a powerful craft, but also quite dangerous in the wrong hands." He pauses for a moment, considering his next words carefully. "There are whispers of a group of mages who delved into forbidden magics, straying beyond the boundaries of what was acceptable. The empire discovered their activities and dealt with them harshly."',
        options: [
            {
                text: 'Continue',
                nextText: 70
            }
        ]
    },
    {
        // act: 4
        id: 70,
        text: '"As a consequence of these forbidden experiments, the empire has cracked down on the citadel, punishing its members severely," the bard explains with a shake of his head. "Many mages were executed publicly, while others managed to escape. However, those who remained were imprisoned within the citadel and are now closely monitored by soldiers of the empire. The citadel\'s power and numbers have been greatly reduced, and its members live in fear of further retribution."',
        options: [
            {
                text: 'Continue',
                nextText: 71
            }
        ]
    },
    {
        // act: 4
        id: 71,
        text: 'The fire crackles in the background, casting flickering shadows across the small clearing. You sit in silence, lost in thought as you contemplate the information that has been shared. The bard strums his lute once more, the haunting melody providing a backdrop to your introspection.',
        options: [
            {
                text: 'Why are mages being displaced?',
                nextText: 69
            },
            {
                text: 'What can you tell me about dragons?',
                nextText: 72
            },
            {
                text: 'What can you tell me about the citadel?',
                nextText: 74,
                requiredState: (currentState) => currentState.greenPath === false || currentState.greenPath === undefined
            },
            {
                text: 'What can you tell me about the capital?',
                nextText: 76,
                requiredState: (currentState) => currentState.purplePath === false || currentState.purplePath === undefined
            },
            {
                text: 'Continue on your journey',
                nextText: 78
            }
        ]
    },
    {
        // act: 4
        id: 72,
        text: 'The bard leans back and smiles, "Ah, dragons... majestic beasts, feared and revered by all who knew of them. Once, they ruled the skies, their wings casting shadows across the lands. In the early days of civilization, the dragons were worshipped by the people of the empire. They were seen as divine beings, with the power to bless the land with bountiful harvests and protect the people from harm. The Empire built grand temples and shrines in their honor, and it was believed that the dragons would answer the prayers of the faithful. But now, they are no more."',
        options: [
            {
                text: 'Continue',
                nextText: 73
            }
        ]
    },
    {
        // act: 4
        id: 73,
        text: 'Sitting up again, the bard continues, "No one knows what happened to them, why they disappeared from our world. Some say they were hunted to extinction, their scales and bones used for magical purposes. Others believe they simply grew tired of our world, seeking new realms to explore. But regardless of the reason, their absence is felt deeply. The Empire mourns the loss of their deities, and their once-great power has waned in the years since the dragons\' departure. Legends still persist, of course. Whispers of dragon sightings in the mountains, tales of ancient treasures hoarded in their lairs. But these are mere rumors, fantasies spun by those who long for the days when the skies were ruled by the creatures."',
        options: [
            {
                text: 'Continue',
                nextText: 71
            }
        ]
    },
    {
        // act: 4
        id: 74,
        text: 'The bard nods thoughtfully, "The Citadel of Mages, one of the greatest bastions of magic in all the land. The tower itself is a sight to behold, perched high on a rocky cliff face, with a winding path leading up to it that seems almost impossible to climb. The mages who reside within its walls are some of the most powerful and skilled practitioners of alchemy you will ever encounter. The importance of the mages to the Empire cannot be overstated. Their knowledge and skill in the magical arts are essential for the defense and prosperity of the realm. The Empire has long recognized the value of magic in both war and peace, and the mages of the Citadel are the guardians of that knowledge."',
        options: [
            {
                text: 'Continue',
                nextText: 75
            }
        ]
    },
    {
        // act: 4
        id: 75,
        text: 'Leaning forward, the bard continues, "But with great power comes great responsibility, as they say. The mages are constantly under scrutiny from the Empire, who closely monitor their activities to ensure that their magic is not used for nefarious purposes. The consequences of a rogue mage wielding the power of alchemy could be catastrophic. Despite this, the mages continue to push the boundaries of their craft, experimenting with new forms of alchemy and expanding their understanding of the magical forces that shape the world. It is a never-ending pursuit of knowledge and power."',
        options: [
            {
                text: 'Continue',
                nextText: 71
            }
        ]
    },
    {
        // act: 4
        id: 76,
        text: 'The bard nods thoughtfully, "The empire\'s capital, known simply as The Capital, is a sight to behold. Positioned on a rocky hill overlooking the river and the road that leads to it, it boasts massive fortified gates that see a constant stream of foot traffic. Inside the city walls stands a towering castle, the seat of the empire\'s power and the residence of the king. From there, he governs the empire with a strict hand, ensuring that his people are kept safe and that his rule is absolute."',
        options: [
            {
                text: 'Continue',
                nextText: 77
            }
        ]
    },
    {
        // act: 4
        id: 77,
        text: 'Leaning forward, the bard continues, "The king\'s influence extends far beyond the castle walls, however. He has taken a keen interest in the mages of the citadel, recognizing their power and importance in the empire\'s defense and war efforts. In recent years, he even installed his brother-in-law as their governor. Despite the king\'s strict rule, The Capital remains a bustling hub of activity and trade. Merchants from all over the world come to ply their wares, and the its markets are a riot of color and noise."',
        options: [
            {
                text: 'Continue',
                nextText: 71
            }
        ]
    },
    {
        // act: 4
        id: 78,
        text: 'After some time of resting and regaining your strength, you feel a renewed sense of energy pulsing through your veins. With a deep breath, you prepare to brave the harsh winds and biting cold once more, but not before bidding the bard farewell. You express your gratitude again before heading down the road, the haunting melody of the lute lingering in your mind. It\'s as though the music is playing you off.',
        options: [
            {
                text: 'Continue',
                nextText: 79
            }
        ]
    },
// Act 5
    {
        // act: 5
        id: 79,
        text: 'As you press on, weariness creeps into your bones and the elements weigh heavily upon you. With the sky turning black and shadows deeping across the landscape, you scour your surroundings for a safe haven to rest for the night. A clearing in the distance catches your eye, rich with firewood for warmth. However, its exposed location raises the fear of lurking predators. A nearby cave entrance seems a promising refuge against the weather, but the dangers within are unknown and unsettling. Finally, an Inn on the horizon comes into view, but the sight of its questionable patrons gives you pause. You weigh your options carefully.',
        options: [
            {
                text: 'Camp in the cave',
                setState: {id: 79},
                nextText: 5000
            },
            {
                text: 'Camp in the clearing',
                setState: {id: 79},
                nextText: 5000
            },
            {
                text: 'Stay at the Inn',
                setState: {id: 79},
                nextText: 5000
            }
        ]
    },

// END DEMO
    {
        // END DEMO
        id: 5000,
        text: 'To be continued...',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 20
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    }
]

startGame();