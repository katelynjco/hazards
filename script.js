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
        text: '"As a consequence of these forbidden experiments, the empire has cracked down on the citadel." the bard explains with a shake of his head. "Many mages were executed publicly, while a small number managed to escape. However, those who remained were imprisoned within the citadel and are now closely monitored by soldiers of the empire. The citadel\'s power and numbers have been greatly reduced, and its members live in fear of further retribution."',
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
        text: 'Sitting up again, the bard continues, "No one knows what happened to them, why they disappeared. Some say they were hunted to extinction, their scales and bones used for magical purposes. Others believe they simply grew tired of our world, seeking new realms to explore. But regardless of the reason, their absence is felt deeply. The Empire mourns the loss of their deities, and their once-great power has waned in the years since the dragons\' departure. Legends still persist, of course. Whispers of dragon sightings in the snow-capped mountains, tales of ancient treasures hoarded in their lairs. But these are mere rumors, fantasies spun by those who long for the days when the skies were ruled by the creatures."',
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
        text: 'Leaning forward, the bard continues, "But with great power comes great responsibility, as they say. The mages are constantly under scrutiny from the Empire, who closely monitor their activities to ensure that their magic is not used for nefarious purposes. The king even appointed the queen as the mage\'s govonor. The consequences of a rogue mage wielding the power of alchemy could be catastrophic. Despite this, the mages continue to push the boundaries of their craft, experimenting with new forms of alchemy and expanding their understanding of the magical forces that shape the world. It is a never-ending pursuit of knowledge and power."',
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
        text: 'The bard nods thoughtfully, "The empire\'s capital, known simply as The Capital, is a sight to behold. Positioned on a rocky hill overlooking the road that leads to it, it boasts massive fortified gates that see a constant stream of foot traffic. Inside the city walls stands a towering castle, the seat of the empire\'s power and the residence of the king. From there, he governs the empire with a strict hand, ensuring that his people are kept safe and that his rule is absolute."',
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
        text: 'Leaning forward, the bard continues, "The king\'s influence extends far beyond the castle walls, however. He has taken a keen interest in the mages of the citadel, recognizing their power and importance in the empire\'s defense and war efforts. In recent years, he even installed his queen as their governor. Despite the king\'s strict rule, The Capital remains a bustling hub of activity and trade. Merchants from all over the world come to ply their wares, and the its markets are a riot of color and noise."',
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
        text: 'As you press on, weariness creeps into your bones and the elements weigh heavily upon you. With the sky turning black and shadows deeping across the landscape, you scour your surroundings for a safe haven to rest for the night. A clearing in the distance catches your eye, rich with firewood for warmth. However, its exposed location raises the fear of lurking predators. A nearby cave entrance seems a promising refuge against the weather, but the dangers within are unknown and unsettling. Finally, an inn on the horizon comes into view, but you\'re unsure if it is even open. You weigh your options carefully.',
        options: [
            {
                text: 'Camp in the cave',
                setState: {id: 79},
                nextText: 81
            },
            {
                text: 'Camp in the clearing',
                setState: {id: 79},
                nextText: 80
            },
            {
                text: 'Stay at the Inn',
                setState: {id: 79},
                nextText: 82
            }
        ]
    },
    {
        // act: 5
        // ENDING
        id: 80,
        text: 'After carefully considering your options, you decide to take a chance and stay in the clearing. Despite finding plenty of wood, it is damp, making it difficult to start a fire. As darkness descends, you try in vain but ultimately give up. With no other option, you hastily construct a makeshift lean-to on the edge of the clearing. However, as the night wears on, and the temperature continues to drop. Without any source of warmth, you begin to feel the effects of hypothermia.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 79
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 4
        id: 81,
        text: 'The rest of the night passes without incident, and you are awakened by the first rays of sunlight peeking over the horizon. After stretching and taking a look around, you feel a familiar pang of hunger in your stomach.',
        options: [
            {
                text: 'Continue',
                nextText: 92,
                requiredState: (currentState) => currentState.yellowPath === true 
            },
            {
                text: 'Eat a small breakfast from your pack',
                nextText: 99,
                requiredState: (currentState) => currentState.yellowPath === false || currentState.yellowPath === undefined
            },
        ]
    },
    {
        // act: 5
        id: 82,
        text: 'Despite the uneasiness that had been creeping over you, you make the decision to head for the inn. As you step inside, the welcoming warmth of the hearth engulfs you and you feel a sense of relief wash over you. The beds are pricey, but you can afford a small bed in a shared room. Luckily the room appears to be otherwise unoccupied. You collapse onto the bed, exhausted from your journey, and before you know it, you\'re sound asleep.',
        options: [
            {
                text: 'Continue',
                nextText: 83
            },
        ]
    },
    {
        // act: 5
        id: 83,
        text: 'Suddenly, you awaken to find yourself being roughly pulled out of bed by a group of strangers. You try to resist, but their grip is strong. You realize with horror that you\'ve being kidnapped by those who you can only guess to be slavers. The room is dark and you can barely make out their faces, but you see the glint of steel in one of their hands. What do you do?',
        options: [
            {
                text: 'Drop supplies and run!',
                nextText: 85
            },
            {
                text: 'Defend yourself!',
                nextText: 84
            },
        ]
    },
    {
        // act: 5
        id: 84,
        text: 'As one of the abductors wraps rope around your ankles, you instinctively lash out with a fierce kick, catching him square in the temple. He crumples to the ground, stunned. Seizing the opportunity, you quickly free your arms from the other men\'s grasp and scramble for your pack. Your hand closes around the handle of your trusty hammer, and you swing it with all your might in a blind fury. The hammer connects with a resounding thud, and you hear one of your assailants yelp in pain. Encouraged, you keep swinging, driving them back with each blow. The would-be kidnappers quickly turn tail, fleeing into the night. Breathless and shaken, you sink to the ground, heart pounding.',
        options: [
            {
                text: 'Continue',
                nextText: 81
            },
        ]
    },
    {
        // act: 5
        id: 85,
        text: 'As one of the abductors wraps rope around your ankles, you try to wrench yourself away, but they\'re too strong. The men hold you firmly, preventing any chance of escape. Panic sets in as you realize you\'re helpless. Desperately, you try to wriggle free, but the ropes are too tight. You can feel the rough fibers cutting into your skin, and you start to feel lightheaded from the strain. As your captors begin to drag you away, you make one last attempt to escape, but it\'s futile. Your body is trapped, and there\'s no way out.',
        options: [
            {
                text: 'Continue',
                nextText: 86
            },
        ]
    },
    {
        // act: 5
        id: 86,
        text: 'A hood is roughly pulled over your head, obscuring your vision, and you feel yourself being lifted onto the back of a horse. The animal begins to move, its gait uneven and jarring. You try to steady yourself, but the constant motion soon makes you feel sick and disoriented. Time passes in a blur, and you have no idea how long you\'ve been riding.  As the horse continues on its path, the weather grows colder and the wind becomes harsher. Despite your best efforts, you can\'t stop shivering, and your fingers start to go numb.',
        options: [
            {
                text: 'Continue',
                nextText: 87
            },
        ]
    },
    {
        // act: 5
        id: 87,
        text: 'Finally, the horse comes to a stop, and you\'re yanked off its back. Your body protests as you\'re hoisted over someone\'s shoulder, the pressure on your stomach uncomfortable. The hood obscures your vision, but you can hear the crunch of snow underfoot and the wind howling through the trees. You\'re too disoriented to struggle, and you feel a twinge of admiration for the man\'s strength as he carries you along effortlessly.',
        options: [
            {
                text: 'Continue',
                nextText: 88
            },
        ]
    },
    {
        // act: 5
        id: 88,
        text: 'You are dropped onto a stone floor, the thud echoing throughout the room. You hear your captors muttering amongst themselves, their voices low and indistinguishable. Suddenly, footsteps approach and the men fall silent. A new voice addresses the room, "How went your hunt?" Your heart races as you strain to listen, but your abductors keep their voices inaudible as they reply. You hear the newcomer again, "The manner of its arrival is a sign!" Giddy laughter bounces off the walls and sends a shiver up your spine. "Come! We celebrate tonight and speak to the gods tomorrow!" The group walks off, leaving you to sit in your soiled clothes. You intermittently doze as the night passes, your body aching.',
        options: [
            {
                text: 'Continue',
                nextText: 89
            },
        ]
    },
    {
        // act: 5
        id: 89,
        text: 'You\'re roughly grabbed and placed on a familiar shoulder. The man carries you outside, and eventually drops you onto cold stone. The hood is ripped off your face, and you blink in the harsh sunlight, your eyes hurting. As your vision adjusts, you see a large group of people gathered before you, all clad in soft crimson robes, their faces gaunt and pale from the cold. You\'re still bound, lying on a waist-high slab of stone. A woman dressed in a more intricate, red robe looms over you and addresses the crowd.',
        options: [
            {
                text: 'Continue',
                nextText: 90
            },
        ]
    },
    {
        // act: 5
        id: 90,
        text: '"Brothers and sisters, our time has come!" she shouts, her voice echoing across the stone altar. "The dragons have abandoned us, but we will not let their legacy die! We will bring them back, and we will show them that we are worthy of their divine attention!" She holds up the glimmering, ornate egg-shaped object that was found in your possession. "Fate has delivered unto us a sign!" she declares. "This egg, this gift from the gods themselves, is proof that our cause is just! We must continue to sacrifice and appease the dragons, to show them that we are willing to spill blood and offer our lives for their return!" The cultists cheer, their faces twisted into wild grins. You try to struggle against your bonds, but it\'s no use.',
        options: [
            {
                text: 'Continue',
                nextText: 91
            },
        ]
    },
    {
        // act: 5
        // Ending
        id: 91,
        text: 'The woman\'s eyes meet yours, and she speaks directly to you. "You will not be the first to offer yourself to the dragons. But you will be the spark that ignites the flame of their blessed return." She raises his voice, "And when they come, they will see that we are their loyal servants, their faithful acolytes, and they will reward us with the power and glory that we so rightfully deserve!" With a final, crazed laugh, the woman brings a large ivory knife into view and plunges it into your heart. Your vision fades and and the gathering erupts into chaotic celebration.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 79
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 5
        id: 92,
        text: 'Without supplies, the journey ahead will be challenging. The road often presents obstacles that make survival difficult, particularly when it comes to food. How do you plan to sustain yourself along the way?',
        options: [
            {
                text: 'Eat the object',
                nextText: 93,
            },
            {
                text: 'Hunt for meat',
                nextText: 94,
            },
            {
                text: 'Forage for food',
                nextText: 97,
            }
        ]
    },
    {
        // act: 5
        // Ending
        id: 93,
        text: 'You examine the object, and note its shape resembles that of an egg, which could indicate it\'s edible. You reach into your pack and retrieve your trusty hammer. After a strong swing, the egg cracks open with a loud noise, and you peer inside. However, a sudden dizziness overtakes you, and your stomach churns, causing you to lose your appetite. In no time, you collapse, succumbing to unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 79
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 5
        id: 94,
        text: 'What method will you use to hunt with?',
        options: [
            {
                text: 'Fish',
                nextText: 95
            },
            {
                text: 'Set Traps',
                nextText: 96
            }
        ]
    },
    {
        // act: 5
        id: 95,
        text: 'With a satisfied burp, you lean back. Your hard work has paid off, and your hunger has been satiated.',
        options: [
            {
                text: 'Continue',
                nextText: 99
            },
        ]
    },
    {
        // act: 5
        id: 96,
        text: 'Cursing under your breath, you slump back in frustration, realizing that your efforts have been in vain. With no tangible results to show for your endeavors, you make the tough decision to cut your losses and push ahead with your journey, despite your gnawing hunger.',
        options: [
            {
                text: 'Continue',
                nextText: 99
            },
        ]
    },
    {
        // act: 5
        id: 97,
        text: 'You meander through the nearby woods and scavenge breakfast from the surrounding foliage. After some time, you assess your findings: a handful of round, vibrant red berries, and assorment of webbed brown mushrooms. What will you choose to eat?',
        options: [
            {
                text: 'Eat neither',
                nextText: 96
            },
            {
                text: 'Eat both',
                nextText: 98
            },
            {
                text: 'Eat the mushrooms',
                nextText: 98
            },
            {
                text: 'Eat the berries',
                nextText: 95
            }
        ]
    },
    {
        // act: 5
        // Ending
        id: 98,
        text: 'Following a satisfying belch, you lean back and feel a deep sense of satisfaction. Your hard work has paid off, and your appetite is finally appeased. You take a moment to relish the feeling before gathering your belongings and continuing your expedition. As you make steady strides, you start to feel unwell. Your head throbs, your stomach churns, and your heart rate becomes irregular. Eventually, you slip into unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 79
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 5
        id: 99,
        text: 'As you press on with your journey, you feel a sense of gratitude that the rain has finally subsided, although the sky remains gloomy and the wind relentless. With the prospect of better weather ahead, you begin to believe that you might reach your destination before nightfall.',
        options: [
            {
                text: 'Continue',
                nextText: 100
            },
        ]
    },
    {
        // act: 5
        id: 100,
        text: 'After a short while, you encounter a group of six men who have barricaded the road with an overturned wagon. Their appearance is menacing, and they may even be mercenaries. As you draw near, one of them greets you with a wave, "There\'s a toll to continue this way, there is." What do you do?',
        options: [
            {
                text: 'Pay toll',
                nextText: 103
            },
            {
                text: 'Fight!',
                nextText: 102
            },
            {
                text: 'Drop supplies and run!',
                nextText: 101
            },
            {
                text: 'Bluff',
                nextText: 105,
                requiredState: (currentState) => currentState.greenPath === false || currentState.greenPath === undefined
            },
            {
                text: 'Bluff',
                nextText: 104,
                requiredState: (currentState) => currentState.purplePath === false || currentState.purplePath === undefined
            },
        ]
    },
    {
        // act: 5
        // Ending
        id: 101,
        text: 'As you abandon your belongings and flee towards the safety of the trees, a dull thud echoes through the air, and suddenly, an arrow pierces through your chest. You crumple to the ground, succumbing to unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 79
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 5
        // Ending
        id: 102,
        text: 'As you reach into your pack, your fingers brush against the familiar heft of your hammer. With a burst of self-assurance, you draw it out and let out a battle cry as you charge towards the group of men. However, their laughter is deafening as they effortlessly overpower you. The odds of facing six opponents on your own are dismal, even under the most favorable circumstances.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 79
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 5
        id: 103,
        text: 'Resigned to the situation, you opt to pay the toll and retrieve your coin purse from your pocket. As you pour out the meager contents into your palm, the mercenaries snicker in contempt. "Is that all you\'ve got?" one of them taunts. "I suppose we\'ll have to take the rest out of your hide." The men advance and beat you savagely until you are bruised and bloodied, then fling you onto the other side of the overturned wagon. You lay there writhing in agony for a few moments before gathering the strength to rise and hobble away, battered and broken.',
        options: [
            {
                text: 'Continue on your Journey',
                nextText: 113
            }
        ]
    },
    {
        // act: 5
        id: 104,
        text: 'You approach the group of menacing-looking mercenaries blocking your path, feeling a mix of trepidation and resolve. With a steely gaze, you lock eyes with the apparent leader and speak up, "I couldn\'t help but overhear that the Empire is hiring mercenaries to do their dirty work. But, I wonder, do they know about the extra income you seem to be making from your little side hustle here?" The mercenaries exchange uneasy looks, realizing that they have been caught in their illicit scheme. After a tense moment, the leader grudgingly steps aside, allowing you to pass without further incident.',
        options: [
            {
                text: 'Continue',
                nextText: 106
            }
        ]
    },
    {
        // act: 5
        id: 105,
        text: 'Approaching the group of menacing-looking mercenaries blocking your path, you adopt an air of authority. With a confident tone, you declare, "I am a mage from the Citadel of Mages, and I have reason to believe that you are extorting travelers passing through this road. Such behavior is unacceptable and will not be tolerated." The mercenaries exchange uneasy looks, realizing that they have been caught in their illicit scheme. After a tense moment, the leader grudgingly steps aside, allowing you to pass without further incident.',
        options: [
            {
                text: 'Continue',
                nextText: 106
            }
        ]
    },
    {
        // act: 5
        id: 106,
        text: 'As you pass by the men you pause. They may have valuable information that could be useful to your journey. The decision weighs heavily on your mind: do you take the risk and try to extract information from them or continue on your journey without further delay?',
        options: [
            {
                text: 'Continue on your journey',
                nextText: 113
            },
            {
                text: 'Ask Questions',
                nextText: 107
            }
        ]
    },
    {
        // act: 5
        id: 107,
        text: 'You take a deep breath and summon your courage, determined to break the tense silence that has fallen over the group of mercenaries. With a careful eye, you gauge their reactions as you recount your journey so far. As you finish your story, the awkward tension in the air becomes even more pronounced, leaving you unsure of how to proceed.',
        options: [
            {
                text: 'Why are mages being displaced?',
                nextText: 108
            },
            {
                text: 'What can you tell me about dragons?',
                nextText: 110
            },
            {
                text: 'What can you tell me about the citadel?',
                nextText: 111,
                requiredState: (currentState) => currentState.greenPath === false || currentState.greenPath === undefined
            },
            {
                text: 'What can you tell me about the capital?',
                nextText: 112,
                requiredState: (currentState) => currentState.purplePath === false || currentState.purplePath === undefined
            },
            {
                text: 'Continue on your journey',
                nextText: 113
            }
        ]
    },
    {
        // act: 5
        id: 108,
        text: 'One of the men lets out a hearty laugh, his eyes glinting with amusement. "Looks like they made an enemy of the empire, eh?" he remarks with a smirk.',
        options: [
            {
                text: 'Continue',
                nextText: 109
            }
        ]
    },
    {
        // act: 5
        id: 109,
        text: 'An awkward silence fills the air once more, and you can feel the mercenaries\' hostile gazes fixed on you. Their expressions suggest that they are not pleased with your presence.',
        options: [
            {
                text: 'Why are mages being displaced?',
                nextText: 108
            },
            {
                text: 'What can you tell me about dragons?',
                nextText: 110
            },
            {
                text: 'What can you tell me about the citadel?',
                nextText: 111,
                requiredState: (currentState) => currentState.greenPath === false || currentState.greenPath === undefined
            },
            {
                text: 'What can you tell me about the capital?',
                nextText: 112,
                requiredState: (currentState) => currentState.purplePath === false || currentState.purplePath === undefined
            },
            {
                text: 'Continue on your journey',
                nextText: 113
            }
        ]
    },
    {
        // act: 5
        id: 110,
        text: 'The group bursts into laughter. "You want us to tell you a fairy tale while we\'re sitting here with weapons pointed your way?" one of them asks between fits of wheezing laughter.',
        options: [
            {
                text: 'Continue',
                nextText: 109
            }
        ]
    },
    {
        // act: 5
        id: 111,
        text: 'One of the men shrugs and says, "Spooky stuff goes on in that place. We refuse work anywhere around there anymore." The way they shift uncomfortably and avoid eye contact with you suggests that they\'re hiding something, but it\'s difficult to tell what. You decide to press them for more information, but their guarded demeanor makes it clear that they\'re not willing eloaborate.',
        options: [
            {
                text: 'Continue',
                nextText: 109
            }
        ]
    },
    {
        // act: 5
        id: 112,
        text: 'One of them simply shrugs and says, "It\'s big and they pay good." Their lack of enthusiasm for the topic is disappointing, but you sense that they may not have much experience or knowledge about the city.',
        options: [
            {
                text: 'Continue',
                nextText: 109
            }
        ]
    },
// Act 6
    {
        // act: 6
        id: 113,
        text: 'As you make your way down the road, your thoughts drift to the mysterious object in your possession. Its value and purpose remain unknown, and the excitement of unraveling its secrets fuels your eagerness to reach your destination. You quicken your pace, hungry to learn more.',
        options: [
            {
                text: 'Continue',
                setState: {id: 113},
                nextText: 114,
                requiredState: (currentState) => currentState.greenPath === false || currentState.greenPath === undefined
            },
            {
                text: 'Continue',
                setState: {id: 113},
                nextText: 150,
                requiredState: (currentState) => currentState.purplePath === false || currentState.purplePath === undefined
            },
        ]
    },
// Act 6A
    {
        // act: 6A
        id: 114,
        text: 'As you make your way towards the Citadel, the dense trees gradually give way to reveal the imposing tower perched on the rocky cliff face. As you approach, you can feel the weight of its history and importance bearing down on you. The steeple itself is a magnificent sight to behold, rising up from the rocky cliff face and seeming to touch the sky. The winding path that leads up to it looks daunting, with steep inclines and sharp twists and turns. You can\'t help but wonder how the mages who reside within its walls manage to climb it every day. As you approach the path, you notice a boy with an ox standing nearby. He seems to be watching you intently, as though he\'s expecting something from you.',
        options: [
            {
                text: 'Talk to the boy',
                nextText: 116
            },
            {
                text: 'Continue up the path',
                nextText: 115
            }
        ]
    },
    {
        // act: 6A
        id: 115,
        text: 'As you start your ascent up the steep path towards the Citadel, you can feel the strain on your legs and the burning of your muscles. The path seems to go on endlessly, with each turn revealing another steep incline. Despite the challenge, your anticipation and excitement push you forward, determined to uncover the secrets and knowledge that lay within the walls of the tower. As you finally reach the top of the path, you\'re breathing heavily and your body is drenched in sweat. You take a moment to catch your breath and marvel at the stunning view from the top of the cliff. The beauty of the surrounding landscape is magnified from this height, and you can\'t help but feel a sense of awe and reverence.',
        options: [
            {
                text: 'Continue',
                nextText: 118
            }
        ]
    },
    {
        // act: 6A
        id: 116,
        text: 'You approach him cautiously, unsure of what to expect. The boy greets you warmly, his smile putting you at ease. He seems to sense your purpose and asks if you\'re here to see the mages within the Citadel. You nod, and the boy\'s eyes light up with excitement. He tells you that the governor regent is currently accepting visitors. He offers you a ride on his ox up the path, which at this point, seems like an appealing option after the tiring journey.',
        options: [
            {
                text: 'Accept offer',
                nextText: 117
            },
            {
                text: 'Refuse offer',
                nextText: 115
            }
        ]
    },
    {
        // act: 6A
        id: 117,
        text: 'You accept his kind offer and climb onto the ox\'s back, feeling its powerful muscles as it starts moving up the steep path. The boy seems to be a local, and you can\'t help but wonder what he knows about the Citadel and its residents. You ask him about the mages, and he tells you that they are some of the most powerful and skilled practitioners of alchemy in the land. He speaks with admiration and respect for their abilities, and you can sense his genuine awe for their magic. As you near the top, the boy expertly steers the the animal towards a small platform, and you dismount, feeling grateful for the ride. You thank the boy, and he waves goodbye with a big smile before returning down the path with the ox.',
        options: [
            {
                text: 'Continue',
                nextText: 118
            }
        ]
    },
    {
        // act: 6A
        id: 118,
        text: 'You approach the towering twin doors of the citadel, marveling at their size and sturdiness. The doors are made of solid oak and are elaborately decorated with an ornate iron knocker and a matching handle, sculpted to look like branches. You grasp the knocker firmly and strike the door, feeling the vibration echo through your hand and into your bones. After a few moments, one of the doors opens with a creak, revealing a glimpse of the citadel\'s interior. You\'re greeted by the warm smile of a woman wearing a thick, vibrant green robe. The robe\'s sleeves and hood are intricately woven with patterns that seem to shimmer in the light, lending an air of enchantment to her appearance. Her long, gray hair is tied back into a braid, which falls over her shoulder as she welcomes you inside.',
        options: [
            {
                text: 'Continue',
                nextText: 119
            }
        ]
    },
    {
        // act: 6A
        id: 119,
        text: 'As you step through the doors, you\'re immediately struck by the grandeur of the interior. The circular room is massive, with soaring ceilings and tall, arched windows that let in streams of sunlight. Multiple fireplaces line the walls, casting a warm glow that illuminates the overflowing bookcases and plush chairs and couches scattered throughout the room. The air is thick with the scent of old books and burning wood. The woman leads you to a cozy hearth with a small pot hanging over the flames. You settle into a comfortable armchair and she pours steaming tea into two delicate cups. The tea is fragrant and calming, and you feel yourself relax as you take a sip.',
        options: [
            {
                text: 'Continue',
                nextText: 120
            }
        ]
    },
    {
        // act: 6A
        id: 120,
        text: 'As you start to pull out the mysterious object from your bag, the woman\'s expression quickly changes. Her eyes widen with fear, and she frantically pushes it back into your bag before covering it with the flap. She urgently places a finger on her lips, gesturing for you to follow her out of the room. You can feel her grip tighten on your arm as she leads you up a a curved flight of stairs and through a labyrinth of hallways, before finally shoving you into a large room. "Stay here and don\'t move," she whispers before swiftly shutting the door behind her, leaving you alone once again.',
        options: [
            {
                text: 'Continue',
                nextText: 121
            }
        ]
    },
    {
        // act: 6A
        id: 121,
        text: 'As you take in the vast room, your attention is drawn to the magnificent view outside the windows overlooking the cliff face. The long wooden table in the center of the room is flanked by a few chairs and bookshelves, which match those in the hearth room below. Suddenly, the door bursts open, revealing a short and stocky man dressed in a long, more elaborately decorated green robe. The complex designs on his robe catch your eye, and he wastes no time in demanding that you tell him everything.',
        options: [
            {
                text: 'Tell your story',
                nextText: 123
            },
            {
                text: 'Ask Questions',
                nextText: 122
            },
        ]
    },
    {
        // act: 6A
        id: 122,
        text: 'After coming this far, you feel entitled to some answers before proceeding any further. They clearly know something about the egg-like object. You demand that he explain what they know before you reveal your own story. His face twists in anger as he responds, "Time is of the essence. We cannot waste it on trivialities. She will arrive shortly, and I need to know how you acquired the stone."',
        options: [
            {
                text: 'Tell your story',
                nextText: 123
            }
        ]
    },
    {
        // act: 6A
        id: 123,
        text: 'You quickly recount your tale, and pull out the mysterious object for the mage to inspect. His face contorts in shock and he mutters a curse under his breath. He promptly removes a rock from the wall, revealing a small cavity, and carefully places the object inside before replacing the rock. Turning to you, he grips your shoulders firmly and locks eyes with you. "You must not speak of this to the governor," he implores. "There will be dire consequences if she and the king become aware of its existence." Just then, the woman with the long braid enters the room, her face still visibly shaken. "The regent governor is here," she announces tremulously.',
        options: [
            {
                text: 'Continue',
                nextText: 124
            }
        ]
    },
    {
        // act: 6A
        id: 124,
        text: 'The two mages guide you through the labyrinthine corridors and down the stairs. Exiting through a side door, you find yourself in a courtyard that leads to a grand dining hall. Rows of long tables stretch across the room, with a raised platform at the center where the governoring regent\'s table sits. The male mage quickly ushers you to a table in the back of the room and advises you to keep a low profile, but before he can finish, a commotion at the entrance catches your attention. Turning to look, you see a tall, regal woman entering the room. Her golden hair cascades down her back, and she moves with a graceful air of authority. As she approaches, you can feel her eyes fixed upon you and the mage beside you.',
        options: [
            {
                text: 'Continue',
                nextText: 125
            }
        ]
    },
    {
        // act: 6A
        id: 125,
        text: 'As she draws closer, you can\'t help but feel intimidated by her regal presence. Her elegant demeanor and the crown on her head only serve to further emphasize her authority. She greets you with a warm smile and turns to the mage standing beside you, "Ah, I heard we had a mysterious visitor. Is this the one?" The mage chuckles half-heartedly, "Just a relative visiting, Your Highness, nothing mysterious." He places his hand on your shoulder. The regent\'s face lights up, "Even better! Perhaps you can assist me in dealing with this stubborn Archmage." She motions towards her table, "Please, join me. You will have a place of honor at my side."',
        options: [
            {
                text: 'Continue',
                nextText: 126
            }
        ]
    },
    {
        // act: 6A
        id: 126,
        text: 'As she invites you to join her at the head table, you can\'t help but feel a sense of unease. The male mage, apparently the archmage, seems tense, and there\'s a hint of worry in his eyes. You\'re seated between the regent governor and a visiting duchess, while the archmage is on the governor\'s other side and keeps shooting you worried glances. Despite the tension, the meal commences, and the conversation flows freely. Her Highness is a captivating storyteller, keeping you involved in the discussions going on around you. As the evening wears on, the archmage abruptly stands and exits the room, shooting you a significant look before disappearing from sight. You wait for the opportune moment to follow him.',
        options: [
            {
                text: 'Continue',
                nextText: 127
            }
        ]
    },
    {
        // act: 6A
        id: 127,
        text: 'The feast gradually comes to an end, leaving you feeling pleasantly sated but somewhat disoriented from the resplendent dinner. As you lean back in your seat, the afterglow of the mead and the warmth of the hearth combine to create a cozy haze in your mind. You gaze over at the governor, the queen, whose hair appears to glow in the soft firelight, and she catches your eye with a dazzling smile. "I can\'t help but wonder, what really brings you here?" she inquires, fixing her gaze intently upon you.',
        options: [
            {
                text: 'Tell her the truth',
                nextText: 128
            },
            {
                text: 'Lie to her',
                nextText: 142
            }
        ]
    },
    {
        // act: 6A
        id: 128,
        text: 'You find yourself lost in her captivating look, and the fog in your head prevents you from withholding the truth. You recount your journey in its entirety, including the egg, and she listens intently without any visible reaction. However, as you finish your story, a pang of guilt overcomes you, and you plead with her to keep the object a secret. She nods solemnly in agreement, assuring you that she won\'t tell a soul. You let out a sigh of relief.',
        options: [
            {
                text: 'Continue',
                nextText: 129
            }
        ]
    },
    {
        // act: 6A
        id: 129,
        text: 'The queen\'s beaming smile catches your attention once again, as she leans in closer and whispers in a hushed tone, "Did you know that the capital is hosting a grand festival in just a couple days?" You can feel her excitement as she continues, "I would be honored if you joined me for the festivities!" Your head is still spinning from the extravagant dinner and the mead, you consider her invitation, knowing that attending such a grand event with the queen herself would be an incredible experience.',
        options: [
            {
                text: 'Accept offer',
                nextText: 130
            },
            {
                text: 'Decline offer',
                nextText: 133
            }
        ]
    },
    {
        // act: 6A
        id: 130,
        text: 'As you accept the queen\'s invitation, a surge of excitement rushes through you, causing your heart to race. The regent cheers, her face flushed with enthusiasm, and exclaims, "Wonderful! We set off tonight!" You can\'t believe it\'s happening so soon, and you pause, looking at her with a hint of confusion. "Tonight?" you repeat, trying to keep up with her enthusiasm. Her smile remains as bright as ever as she confirms, "Yes, tonight! The journey takes about a day by carriage, and I need to be there early to attend to some important matters." Despite feeling a bit overwhelmed, you can\'t help but feel honored and privileged to be traveling alongside the queen. She notices your hesitation and reassures you, "My guards will escort you to my carriage, and I\'ll join you shortly after. Everything will be taken care of."',
        options: [
            {
                text: 'Continue',
                nextText: 131
            }
        ]
    },
    {
        // act: 6A
        id: 131,
        text: 'You can\'t help but feel a sense of disappointment as you realize there won\'t be a chance to speak to the archmage before departing. With a heavy heart, you allow yourself to be escorted outside and down the path. As you reach the bottom of the path, an elegant carriage awaits by the roadside, ready to transport you to the capital. You climb inside and wait for the queen, feeling a mix of excitement and nervousness. Eventually, she joins you, her warm smile putting you at ease. The two of you set off on the journey towards the capital, the carriage rolling along the winding roads. However, the weariness from your long journey catches up with you, causing you to drift off to sleep for much of the journey. You wake up intermittently, catching glimpses of the passing scenery and her majesty\'s regal form beside you.',
        options: [
            {
                text: 'Continue',
                nextText: 132
            }
        ]
    },
    {
        // act: 6A
        id: 132,
        text: 'As the carriage pulls through the castle gate, a full day has passed, and the sky has turned dark once again. You feel a sense of awe as you are escorted inside the castle, marveling at the grandeur of the place. Your escort leads you to a large, elaborate room, where you find a comfortable, oversized bed and a warm plate of food waiting on the table. Despite sleeping for most of the journey, you still feel drowsy, and the idea of sinking into the soft mattress and feasting on the delicious meal is irresistible. After satisfying your hunger, you drift off into a deep sleep, enveloped in the luxurious comforts of the room. In the morning, you are awoken by a gentle knock on your door, and a page invites you to take part in the opening festivities of the festival. He passes along the queen\'s condolences for not being able to accompany you this morning and her promise to join you later in the day.',
        options: [
            {
                text: 'Continue',
                nextText: 5000
                // TO 6B FESTIVAL
            }
        ]
    },
    {
        // act: 6A
        id: 133,
        text: 'Your head still foggy, you decline the governor\'s offer with a heavy heart. "What a shame," she says, a hint of sadness in her voice, indicating her genuine disappointment. Dabbing her mouth, she gracefully rises from her seat and says, "If you\'ll excuse me, I do have matters to attend to. My guards will escort you to your quarters." With that, she sweeps elegantly out of the room, leaving you to your thoughts. Soon enough, you are escorted to a cozy room higher up in the tower. You crawl into the large, clean bed, feeling grateful for the comfort it provides. The afterglow of the mead and the warmth of the hearth lull you to sleep, and you drift off into a peaceful slumber.',
        options: [
            {
                text: 'Continue',
                nextText: 134
            }
        ]
    },
    {
        // act: 6A
        id: 134,
        text: 'You awaken from a deep slumber that lasts for over a day, startled by the sound of your bedroom door crashing open. The archmage bursts in, his face red with fury as he scream uncontrollably, "You have doomed us! You fool! You have absolutely doomed us!" You sit up, rubbing the sleep from your eyes, attempting to understand what has caused the mage to act in such a frantic manner. "What\'s going on?" you ask, trying to make sense of the situation as the man rushes towards the small window in your room.',
        options: [
            {
                text: 'Continue',
                nextText: 135
            }
        ]
    },
    {
        // act: 6A
        id: 135,
        text: 'You join the archmage at the window and are met with a terrifying sight. The grand dining hall where you had enjoyed a lavish meal the previous night is now engulfed in flames, and a circle of fire seems to have encompassed the entire tower. Your heart races as you turn to the archmage, feeling a sense of panic rising within you. "What\'s happening?" you ask urgently. In response, the archmage lets out a deranged laugh and grabs you by the shoulders, shaking you slightly. "They\'re going to bury us with the stone in this blasted tower," he says in a voice filled with angst. The archmage suddenly releases his grip on your shoulders, his face growing pale. He stiffly walks out of the room leaving you to follow.',
        options: [
            {
                text: 'Follow the mage',
                nextText: 136
            },
            {
                text: 'Escape the tower',
                nextText: 141
            }
        ]
    },
    {
        // act: 6A
        id: 136,
        text: 'You notice the acrid smell of smoke hanging in the stairwell as you make your way down the stairs. You watch as the archmage walks into his office, seemingly in a daze. He picks up a large jug and pours himself a cup of mead, offering you one as well. You accept the cup, feeling a sense of numbness spreading throughout your body as you take a sip. As you turn towards the windows, your eyes widen in horror at the sight before you. A large trebuchet has been built at the bottom of the cliff, and a group of soldiers dressed in the empire\'s colors are loading it with a giant rock. Your heart feels like it has frozen in your chest as you realize what is about to happen.',
        options: [
            {
                text: 'Continue',
                nextText: 137
            }
        ]
    },
    {
        // act: 6A
        id: 137,
        text: 'The archmage drops heavily into a nearby chair, swirling the mead in his glass. "I warned that witless fool not to mess with these powers," he mutters to himself, shaking his head in disbelief. "And the peabrain goes ahead and does it twice." He lets out a bitter laugh before chugging the rest of his cup and pouring himself another. As he does, the tower suddenly shakes violently, causing you both to stumble. You look out the window and see the soldiers loading another massive rock into the trebuchet.',
        options: [
            {
                text: 'Continue',
                nextText: 138
            }
        ]
    },
    {
        // act: 6A
        id: 139,
        text: 'You turn to the archmage, feeling a sense of urgency rising within you. "What kind of power? Who has been meddling with it?" you ask, your voice tense. The man\'s eyes, bloodshot and wild, meet yours as he leans forward. "The power contained within that stone is beyond anything this world has ever seen. They have no idea what they will unleash when they knock this tower down," he says, gesturing towards the trebuchet outside. The tower shakes again, and you can hear the sound of stone breaking apart. "But, they are right to fear it," he mutters to himself, staring down at his cup.',
        options: [
            {
                text: 'Continue',
                nextText: 140
            }
        ]
    },
    {
        // act: 6A
        // ENDING
        id: 140,
        text: '"Fear what?!" You exclaim, on edge and desperate for answers. "What could possibly warrant burying people alive?!" Your voice rises with each word, your frustration palpable. The mage looks up at you again, his expression one of profound sadness. "The end of the world," he replies gravely. A loud explosion rocks the tower, and the room collapses in on itself, crushing everything inside.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 113
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 6A
        id: 141,
        text: 'As you descend the stairs, the acrid smell of smoke grows stronger and the air thickens with every step. You cover your nose with your shirt, but your eyes still sting from the fumes. Finally, you reach the large hearthroom at the tower\'s base, only to be met with an intense heat that nearly knocks you off your feet. Flames have broken the glass windows and engulfed the room. You spot the door and dash towards it, but as you pull the hot metal handle, you realize it\'s locked. Panic sets in as you try to pry the door open, but it won\'t budge, and the inferno closes in around you.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 113
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 6A
        id: 142,
        text: 'Despite the fog in your head, you manage to remember the archmage\'s lie. "I\'m visiting my mother\'s brother," you say with a smile, trying to distract her by telling the long story about your journey and all the encounters you had, omitting the strange egg. You linger on all the details, hoping to keep her from asking more questions.',
        options: [
            {
                text: 'Continue',
                nextText: 143
            }
        ]
    },
    {
        // act: 6A
        id: 143,
        text: 'As you finish telling your story, you notice that the governor\'s expression remains unchanged. Studying her face closely, you wait for her response. After a moment of silence, she smiles and says, "Interesting." There\'s a long silence before she speaks again, "Thank you for being my guest of honor. I enjoyed your company and hope to see you again soon." With those words, she rises gracefully from her seat. "If you\'ll excuse me, I have some matters to attend to," she says, turning to leave, as her guards follow closely behind.',
        options: [
            {
                text: 'Continue',
                nextText: 144
            }
        ]
    },
    {
        // act: 6A
        id: 144,
        text: 'Lost in thought, you\'re uncertain about what to do next. After a few minutes, the archmage appears in the doorway and signals for you to follow him. You silently comply and he leads you back to his office. After ushering you inside, he quietly shuts the door. The woman with the long braid is already present in the room, and both mages stare at you intently. "What did you reveal to her?" The man hisses after a moment, his voice low and urgent. You raise your hands in surrender and reply, "I swear I didn\'t say anything."',
        options: [
            {
                text: 'Continue',
                nextText: 145
            }
        ]
    },
    {
        // act: 6A
        id: 145,
        text: 'The two mages exchange a quick glance before letting out audible sighs of relief. "Good," the man says, patting you on the shoulder. You shrug off his hand and demand an explanation. "Now tell me what this is all about! What did I find? Why can\'t the queen and king know about it?" Your voice rises with every word, frustration evident. They quiet you down and there\'s a long silence before the man finally speaks. "The stone you brought is a curse, a sin of my predecessor. It\'s in everyone\'s best interest if it\'s never mentioned again." He finishes harshly, refusing to elaborate when you press him for more information.',
        options: [
            {
                text: 'Continue',
                nextText: 146
            }
        ]
    },
    {
        // act: 6A
        id: 145,
        text: '"I mean it, the less you know of it, the better. You\'re to go back to your village and forget you ever came here. Or better yet, there\'s a festival happening soon in the capital. You can attend and tell your village that\'s what you went to do in the first place." Disappointed, you sit silently, but the thought of a festival and seeing the capital cheers you up slightly. However, the woman with the braid steps in and suggests that you be allowed to rest from your long journey before setting out again. "It would be cruel to kick them out at this time of night," she stammers out. The archmage sighs and eventually agrees, but warns you sternly that if you mention the object again, you will no longer be welcome.',
        options: [
            {
                text: 'Continue',
                nextText: 146
            }
        ]
    },
    {
        // act: 6A
        id: 146,
        text: 'You are led to a cozy room at the top of the tower, where a large and clean bed awaits you. You sink into the soft bedding and feel grateful for the comfort it provides. The warmth of the hearth and the lingering effects of the mead have a soothing effect on you, lulling you into a deep and peaceful slumber that lasts for over a day. When you finally awaken, you stretch lazily, feeling renewed and invigorated. As you gather your pack and head for the door, you can\'t help but feel appreciative of the hospitality of your hosts.',
        options: [
            {
                text: 'Say goodbye',
                nextText: 147
            },
            {
                text: 'Journey to the festival',
                nextText: 148
            },
        ]
    },
    {
        // act: 6A
        id: 147,
        text: 'After a few wrong turns, you eventually make your way to the archmage\'s study. You pause to knock on the door before gently pushing it open. The mage glances up from his work, acknowledging your presence. You express your gratitude for the hospitality and inform him of your departure. He wishes you the best of luck and returns to his scattered parchments. You pause in the doorway, awkwardly, hoping he\'ll say something more. After a moment you leave and scan the area for the braided mage, but she\'s nowhere to be found. With a tinge of disappointment, you set out on your journey.',
        options: [
            {
                text: 'Journey to the festival',
                nextText: 148
            },
        ]
    },
    {
        // act: 6A
        id: 148,
        text: 'You make your way to the festival, still lost in thought as you travel the winding road. After making some decent progress, you\'re hopeful that you\'ll reach the capital the next day. As you walk, you notice a commotion in the sky, drawing your attention upward. A vast cloud looms ominously in the distance, covering much of the horizon. Its size and darkness leave you uneasy, you quicken your pace hoping to get a better view, and your heart sinks at the sight before you. The cloud is a massive, swirling mass of black and red, resembling a furious inferno. The edges are jagged and menacing, and the sound of an explosion reverberates through your bones. Your mind races as you try to make sense of what you\'re seeing.',
        options: [
            {
                text: 'Continue',
                nextText: 149
            },
        ]
    },
    {
        // act: 6A
        id: 149,
        text: 'The cloud is a fearsome sight to behold, stretching far and wide across the sky with an ominous presence that chills you to the bone. As you gaze up at it, you can see that the its top is rounded and massive, with a texture that seems to writhe and twist resembling flames of hellfire, like it\'s alive with some terrible force that threatens to consume everything in its path. You can tell that something catastrophic has happened in the capital and your mind races with worry for the safety of your loved ones back home. You feel torn between continuing on to investigate and hurrying back to your village to make sure they\'re okay. What will you decide to do?',
        options: [
            {
                text: 'Continue to the capital',
                nextText: 5000
                // TO ACT 7
            },
            {
                text: 'Journey home',
                nextText: 5000
                // TO ACT 7
            }
        ]
    },
// ACT 6B
    {
        // act: 6B
        id: 150,
        text: 'As you continue on your journey towards The Capital, the dense foliage gradually thins out, revealing massive fortified gates positioned on a rocky hill overlooking the road. Beyond the gates lies The Capital, a magnificent sight to behold. The towering castle stands proud and strong within the city walls, serving as both the seat of the empire\'s power and the king\'s residence. The line of people waiting to enter the city gates captures your attention, causing you to pause and contemplate your next move. It occurs to you that perhaps it would be wise to conceal the mysterious egg you possess before approaching the gates. After all, you don\'t want to attract any unnecessary attention or suspicion.',
        options: [
            {
                text: 'Hide the object',
                nextText: 153
            },
            {
                text: 'Don\'t hide the object',
                nextText: 151
            }
        ]
    },
    {
        // act: 6B
        id: 151,
        text: 'Despite your better judgment, you decide against hiding the egg and instead leave it exposed, simply covered by the flap of your pack as it rests atop your belongings. You approach the end of the line of people waiting to enter the capital and join the queue, eager to uncover the secrets that await you within the city walls. The line moves slowly, and the wait is tedious. A woman with a group of restless children falls in behind you, and you silently curse your luck.',
        options: [
            {
                text: 'Continue',
                nextText: 152
            },
        ]
    },
    {
        // act: 6B
        // ENDING
        id: 152,
        text: 'Suddenly, one of the children tugs on your pack with all their might and exclaims, "Is that a dragon egg?" You feel the straps give way, and your backpack hits the ground with a loud thud. The object rolls out of it, marred with a sickening crack. A wave of nausea washes over you, and your head spins as you try to comprehend the gravity of the situation. As you struggle to keep your balance, you feel a strange sensation wash over you. The world begins to spin faster and faster, and before you know it, you are consumed by unconsciousness.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 113
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 6B
        id: 153,
        text: 'You take great care in securing the object at the bottom of your pack, wrapping it in a cloth to ensure its safety. The weight of the mysterious item a constant reminder of the excitement and anticipation that fuels your journey. As you join the queue to enter the city, you can\'t help but feel a sense of nervousness creeping in. A woman and her children behind you are becoming increasingly restless, and you feel their eyes on your back as you wait. Finally, after what feels like an eternity, it\'s your turn to approach the colossal gates.',
        options: [
            {
                text: 'Continue',
                nextText: 154
            },
        ]
    },
    {
        // act: 6B
        id: 154,
        text: 'A bored-looking guard eyes you up and down before addressing you. "Just you then?" he says, his tone indicating that he\'s seen countless travelers like you before. You nod, doing your best to appear calm and collected. The guard looks at you skeptically, and you can feel your heart racing as he waits for you to provide more information.',
        options: [
            {
                text: 'I\'m here on buisness',
                nextText: 155
            },
            {
                text: 'I\'m just visiting',
                nextText: 157
            }
        ]
    },
    {
        // act: 6B
        id: 155,
        text: 'You step toward the guard with a sense of unease, aware that the object you carry may draw unwanted attention. You decide to keep your explanation brief, telling the guard that you\'re seeking a buyer for a rare item. The guard studies you for a moment before summoning another soldier and motioning for you to follow him into the guard tower. As you enter the sparsely furnished room, a chill runs down your spine.',
        options: [
            {
                text: 'Continue',
                nextText: 156
            },
        ]
    },
    {
        // act: 6B
        id: 156,
        text: 'You watch nervously as the guard removes each of your belongings from your pack, including the wrapped object. With a sharp intake of breath, he carefully unwraps it, revealing the mysterious item within. "This is the object you\'re looking to sell?" he asks incredulously. You nod, but before you can react, a sudden blow to the back of your head sends you tumbling into darkness.',
        options: [
            {
                text: 'Continue',
                nextText: 159
            },
        ]
    },
    {
        // act: 6B
        id: 157,
        text: 'You approach the guard with caution, knowing that the object you carry may raise suspicion. You choose your words carefully, stating that you\'re a family member here to visit. The guard looks at you skeptically, and you feel a cold sweat forming on your brow. "What part of the city do they live in?" he asks, his tone uninterested. Panic rises within you as you realize you\'re not familiar with the city. "Um, the market," you stammer out, hoping it\'s a common enough answer. The guard studies you for a moment before summoning another soldier and motioning for you to follow him into the guard tower.',
        options: [
            {
                text: 'Continue',
                nextText: 158
            },
        ]
    },
    {
        // act: 6B
        id: 158,
        text: 'As you enter the sparsely furnished room, a chill runs down your spine. You watch nervously as the guard removes each of your belongings from your pack, including the wrapped object. With a sharp intake of breath, he carefully unwraps it, revealing the mysterious item within. "What is this?" he asks incredulously, staring at it in disbelief. Before you can respond, a sudden blow to the back of your head sends you tumbling into darkness.',
        options: [
            {
                text: 'Continue',
                nextText: 159
            },
        ]
    },
    {
        // act: 6B
        id: 159,
        text: 'As you slowly regain consciousness, the realization of your situation sets in. You find yourself in a small, dimly-lit cell, with rough stone walls and a cold floor. A small bed of hay in the corner and a chamberpot at the far end are the only furnishings. The flickering light of a torch on the other side of the iron bars casts eerie shadows across the room. You wince as you touch the back of your head, feeling a dull ache from the blow that knocked you out.',
        options: [
            {
                text: 'Continue',
                nextText: 160
            },
        ]
    },
    {
        // act: 6B
        id: 160,
        text: 'You wait in silence, feeling the weight of the cold stone against your back. Suddenly, you hear a loud clanging noise echoing down the hallway. As the sound grows louder, you realize that it\'s the jangling of metal keys. Within moments, a portly, sad-looking man appears carrying a tray of food. He slides the tray under the bars and into your cell with a snide comment, "Dinner is ready!" without waiting for a response, he turns and heads back down the hallway, the sound of his footsteps echoing in the distance.',
        options: [
            {
                text: 'Continue',
                nextText: 161
            },
        ]
    },
    {
        // act: 6B
        id: 161,
        text: 'As you inspect the tray, you find a meager meal consisting of a cup of water and a loaf of stale bread. You can feel your stomach grumbling with hunger as you take a sip of water and break off a piece of bread. Your mind races with questions while you eat. Time seems to crawl by, but eventually, the clanging of metal returns, this time louder and echoing. A small squad of guards appears before your cell and begins to escort you through the maze of cells. The sound of their footsteps bounces off the walls, and the flickering torches cast eerie shadows around you. You can\'t help but wonder where they\'re taking you and what fate awaits you.',
        options: [
            {
                text: 'Continue',
                nextText: 162
            },
        ]
    },
    {
        // act: 6B
        id: 162,
        text: 'You step into a room through the grand entrance of the ornate wooden doors, admiring the intricate carvings etched into their surface. The chamber you enter is breathtaking, with towering vaulted ceilings. Sunlight streams in through large stained glass windows, casting colorful patterns on the plush crimson carpet. Your gaze is drawn towards the end of the room, where a majestic couple sits upon a raised platform, surrounded by a retinue of guards. The man is regal, with piercing dark eyes and jet black hair, adorned with a sizable crown. Beside him, the woman exudes a serene beauty, her hair cascading like spun gold, wearing a smaller yet still impressive headpiece.',
        options: [
            {
                text: 'Continue',
                nextText: 163
            },
        ]
    },
    {
        // act: 6B
        id: 163,
        text: 'Before you can take in more of your surroundings, you\'re shoved from behind by a brutish guard, causing you to stumble and fall to your knees. Your eyes flicker up to the royal couple as the king speaks with a commanding tone, his gaze fixed on you."You were caught in possession of a forbidden and highly dangerous item. Explain how you obtained it and what your purpose is for being here."',
        options: [
            {
                text: 'Tell your story',
                nextText: 166
            },
            {
                text: 'Demand your own answers',
                nextText: 164
            }
        ]
    },
    {
        // act: 6B
        id: 164,
        text: 'You glare back at the king, mustering all the courage you have left. "I won\'t tell you anything until you give me some answers of my own," you say firmly, trying to keep the fear out of your voice. "Where is my pack? What is the item I found? Why is it so dangerous?" But before you can say more, one of the guards delivers a swift kick to your ribcage, knocking the breath out of you. The king\'s cruel laughter echoes in your ears. "Very well," he says. "If that\'s the way you want it."',
        options: [
            {
                text: 'Continue',
                nextText: 165
            }
        ]
    },
    {
        // act: 6B
        // ENDING
        id: 165,
        text: 'The guards haul you off the ground and drag you deeper into the dungeon. The torches grow dimmer and farther apart as you descend, and a musty smell fills the air. The sound of your footsteps is joined by the drip-drip of water echoing off the damp walls. After what feels like an eternity, you are shoved into a dank, empty cell and left alone with a small sack of hard moldy bread. Darkness engulfs you as the guards slam the door shut, leaving you to contemplate your fate. You wait for hours, then days, then weeks, but no one ever comes to your cell. Your bread runs out, and hunger gnaws at your insides. The only sound you can hear is the scurrying of rodents in the darkness. Eventually, your strength gives out, and you succumb to malnutrition, consumed by the darkness and despair of your prison.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 113
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 6B
        id: 166,
        text: 'As you recount your tale, the words spill out of your mouth in a torrent, fueled by your desperation to explain your situation. However, the king\'s face remains impassive as he listens to your words. You continue until you finish, and the king nods slowly, acknowledging your story with a measured response. "You\'ve given me much to ponder," he says, before dismissing you with a wave of his hand. Despite your protests, the guards haul you out of the room, leaving you to ponder your fate as you\'re taken back to your cell. Sitting on the hay in silence, you become lost in thought.',
        options: [
            {
                text: 'Try to escape',
                nextText: 167
            },
            {
                text: 'Wait',
                nextText: 184
            }
        ]
    },
    {
        // act: 6B
        id: 167,
        text: 'You gaze at the coarse, prickly hay that makes up your bed, a plan slowly taking shape in your mind. You pluck some of the hay and begin weaving it together, your fingers deftly manipulating the strands into a dense stick. After some effort, you manage to extend your arm through the bars of your cell and use the improvised tool to pick the lock. The door creaks open, and you slip out, tucking the hay-stick into your pocket. Now free, you make your way through the maze-like corridors of the prison, the musty air clinging to your skin as you move quietly through the dimly-lit passageways.',
        options: [
            {
                text: 'Continue',
                nextText: 168
            }
        ]
    },
    {
        // act: 6B
        // maze room 1
        id: 168,
        text: 'You step into a dimly lit room, the silence is almost palpable. The space seems deserted, and you feel a sense of unease as you look around. To your right, you see a door set into the southern wall, while on the opposite side of the room, another door stands at the eastern wall. You pause for a moment, considering your options.',
        options: [
            {
                text: 'Southern door',
                // to room 2
                nextText: 169
            },
            {
                text: 'Eastern door',
                // to room 6
                nextText: 173
            }
        ]
    },
    {
        // act: 6B
        // maze room 2
        id: 169,
        text: 'As you step into the dimly lit room, you notice that there are three doors, including the one you just came through. The southern wall has a door, as does the eastern wall, and a third door stands on the northern wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Northern door',
                // to room 1
                nextText: 177
            },
            {
                text: 'Eastern door',
                // to room 5
                nextText: 172
            },
            {
                text: 'Southern door',
                // to room 3
                nextText: 170
            }
        ]
    },
    {
        // act: 6B
        // maze room 3
        id: 170,
        text: 'As you step into the dimly lit room, you notice that there are two doors, including the one you just came through. The northern wall has a door, as does the eastern wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Northern door',
                // to room 2
                nextText: 169
            },
            {
                text: 'Eastern door',
                // to room 4
                nextText: 171
            }
        ]
    },
    {
        // act: 6B
        // maze room 4
        id: 171,
        text: 'As you step into the dimly lit room, you notice that there are four doors, including the one you just came through, one in each wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Northern door',
                // to room 5
                nextText: 172
            },
            {
                text: 'Eastern door',
                // to room 9
                nextText: 169
            },
            {
                text: 'Southern door',
                // exit
                nextText: 180
            },
            {
                text: 'Western door',
                // to room 3
                nextText: 170
            }
        ]
    },
    {
        // act: 6B
        // maze room 5
        id: 172,
        text: 'As you step into the dimly lit room, you notice that there are four doors, including the one you just came through, one in each wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Northern door',
                // to room 6
                nextText: 173
            },
            {
                text: 'Eastern door',
                // to room 8
                nextText: 175
            },
            {
                text: 'Southern door',
                // to room 4
                nextText: 171
            },
            {
                text: 'Western door',
                // to room 2
                nextText: 169
            }
        ]
    },
    {
        // act: 6B
        // maze room 6
        id: 173,
        text: 'As you step into the dimly lit room, you notice that there are three doors, including the one you just came through. The southern wall has a door, as does the eastern wall, and a third door stands on the western wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Eastern door',
                // to room 7
                nextText: 174
            },
            {
                text: 'Southern door',
                // to room 5
                nextText: 172
            },
            {
                text: 'Western door',
                // to room 1
                nextText: 177
            }
        ]
    },
    {
        // act: 6B
        // maze room 7
        id: 174,
        text: 'As you step into the dimly lit room, you notice that there are two doors, including the one you just came through. The southern wall has a door, as does the western wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Southern door',
                // to room 8
                nextText: 175
            },
            {
                text: 'Western door',
                // to room 6
                nextText: 173
            }
        ]
    },
    {
        // act: 6B
        // maze room 8
        id: 175,
        text: 'As you step into the dimly lit room, you notice that there are three doors, including the one you just came through. The southern wall has a door, as does the western wall, and a third door stands on the northern wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Northern door',
                // to room 7
                nextText: 174
            },
            {
                text: 'Southern door',
                // to room 9
                nextText: 176
            },
            {
                text: 'Western door',
                // to room 5
                nextText: 172
            }
        ]
    },
    {
        // act: 6B
        // maze room 9
        id: 176,
        text: 'As you step into the dimly lit room, you notice that there are two doors, including the one you just came through. The northern wall has a door, as does the western wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Northern door',
                // to room 8
                nextText: 175
            },
            {
                text: 'Western door',
                // to room 4
                nextText: 171
            }
        ]
    },
    {
        // act: 6B
        // maze room 1B
        id: 177,
        text: 'As you step into the dimly lit room, you notice that there are three doors, including the one you just came through. The southern wall has a door, as does the eastern wall, and a third door stands on the western wall. You take a moment to survey the room and consider your options.',
        options: [
            {
                text: 'Eastern door',
                // to room 6
                nextText: 173
            },
            {
                text: 'Southern door',
                // to room 2
                nextText: 169
            },
            {
                text: 'Western door',
                // Bad Exit
                nextText: 178
            }
        ]
    },
    {
        // act: 6B
        // bad exit
        id: 178,
        text: 'As you continue to wander through the dimly lit rooms, you become increasingly disoriented. The lack of food and water has taken its toll, and your limbs feel heavy and sluggish. Your stomach grumbles with hunger, and your mouth is dry and parched. Despite your best efforts, you can\'t seem to find a way out, and the gloom around you seems to be closing in. Desperation sets in as you try to push on, but your strength is fading rapidly. Your movements become slower and more labored, and you begin to feel a creeping sense of hopelessness. The walls and floors of the dungeon seem to be mocking you.',
        options: [
            {
                text: 'Continue',
                nextText: 179
            }
        ]
    },
    {
        // act: 6B
        // ENDING
        id: 179,
        text: 'Finally, your body gives out, and you collapse to the ground, too weak to move. Your breathing is shallow and ragged, and your vision blurs as the darkness creeps in. With a heavy heart, you realize that your journey has come to an end, and you succumb to the ravages of malnutrition.',
        options: [
            {
                text: 'RESTART FROM LAST CHECKPOINT',
                nextText: 166
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    },
    {
        // act: 6B
        // good exit
        id: 180,
        text: 'You stand at the top of a dark, winding staircase and begin to make your way down. The air grows thick and putrid with each step, filling your nostrils with the unmistakable stench of sewage. Finally, you reach the bottom and find yourself standing in a large sewer tunnel. A pool of thick, smelly water dominates the center of the tunnel, and you pick your way along the edge, trying to avoid getting your boots wet.',
        options: [
            {
                text: 'Continue',
                nextText: 181
            }
        ]
    },
    {
        // act: 6B
        id: 181,
        text: 'Despite your efforts, the water gradually seeps into your boots, soaking your feet and making every step a squelching, unpleasant experience. You continue on, the tunnel stretching out before you seemingly without end. Finally, after what feels like hours, you emerge from the dank, fetid sewer and breathe in the fresh air gratefully. Taking a moment to catch your breath, you carefully make your way through the trees, keeping a watchful eye out for any signs of danger. Eventually, you reach a road and begin to walk down it, weighing your options and trying to decide what to do next.',
        options: [
            {
                text: 'Continue',
                nextText: 182
            }
        ]
    },
    {
        // act: 6B
        id: 182,
        text: 'You trudge down the road, lost in thought and barely aware of your surroundings. Suddenly, a commotion in the sky catches your attention, and you look up to see a vast cloud looming ominously in the distance. It stretches across much of the horizon, and its size and darkness make you feel uneasy. You quicken your pace, hoping to get a better view, and as you draw closer, your heart sinks at the sight before you. The cloud is a massive, swirling mass of black and red, resembling a furious inferno. The edges are jagged and menacing, and an explosion-like sound reverberates through your bones.',
        options: [
            {
                text: 'Continue',
                nextText: 183
            },
        ]
    },
    {
        // act: 6B
        id: 183,
        text: 'The cloud is a fearsome sight, stretching far and wide across the sky with an ominous presence that chills you to the bone. As you gaze up at it, you can see that the top is rounded and massive, with a texture that seems to writhe and twist like flames of hellfire, giving it an otherworldly, almost alive quality. Your heart races as you realize that something catastrophic has happened, and you can\'t shake the worry for the safety of your loved ones back home. You feel torn between investigating the source of the cloud and hurrying back to your village to make sure they\'re okay. What will you decide to do?',
        options: [
            {
                text: 'Investigate the cloud',
                nextText: 5000
                // TO ACT 7
            },
            {
                text: 'Journey home',
                nextText: 5000
                // TO ACT 7
            }
        ]
    },
    {
        // act: 6B
        id: 184,
        text: 'As the pangs of hunger begin to gnaw at your stomach, you hear the distant clanging of metal, and you instinctively look up, anticipating the arrival of the portly jailor once more. However, to your surprise, you are greeted by the sight of the queen herself, flanked by two imposing guards. Despite feeling stunned, you can\'t help but notice the warmth in her smile as she approaches your cell. "I thought you could join me for dinner?" she says, her voice carrying a gentle and inviting tone. Your heart racing, you eagerly accept, rising to your feet.',
        options: [
            {
                text: 'Continue',
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
                nextText: 113
            },
            {
                text: 'RESTART FROM BEGINNING',
                nextText: 1
            }
        ]
    }
]

startGame();