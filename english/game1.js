const timeoutSign = document.querySelector(".timeoutSign");

// IDLE TIMEOUT - na nabidku, jestli bude pokracovat
(function() {
  const idleDurationSecs = 110;
  let redirectUrl = '../index.html';  // Redirect idle users to this URL
  let idleTimeout;
  let resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function(){
      // location.href = redirectUrl
      overlay2.classList.remove("hideOverlay2");
      timeoutSign.classList.remove("hideTimeoutSign");
      let timeleft = 9;
      let downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.querySelector(".timer").innerHTML = "";
        } else {
        document.querySelector(".timer").innerHTML = timeleft;
        }
        timeleft -= 1;
      }, 1000);
    }, idleDurationSecs * 1000);
  };
  resetIdleTimeout();
  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();

// IDLE TIMEOUT - na presmerovani na zacatek
(function() {
  const idleDurationSecs = 120;
  let redirectUrl = '../index.html';  // Redirect idle users to this URL
  let idleTimeout;
  let resetIdleTimeout = function() {
    if(idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function(){
      location.href = redirectUrl
      // timeoutSign.classList.remove("hideTimeoutSign");
    }, idleDurationSecs * 1000);
  };
  resetIdleTimeout();
  ['click', 'touchstart', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdleTimeout, false)
  });
})();


let strany = 0;
const allDivs = document.querySelectorAll(".parties-container div");


//CONSTANTS
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const party = document.querySelectorAll(".parties-text");
const questionContainer = document.querySelector(".question-container");
const containerIntro = document.querySelector(".container-intro");
const explanation1 = document.querySelector("#explanation1");
const explanation2 = document.querySelector("#explanation2");
const explanation1Flex = document.getElementById("explanation1-flex");
const explanation2Flex = document.getElementById('explanation2-flex');
const MAX_QUESTIONS = 12;
const progressBarFull = document.getElementById('progressBarFull');
const overlay = document.getElementById("overlay");
const overlay2 = document.getElementById("overlay2");
const restartDiv = document.querySelector(".restartDiv");
const continueDiv = document.querySelector(".continue");
const changingPartiesDiv = document.querySelector(".changingTextParties");
const partiesContainerDiv = document.querySelector(".parties-container");
const lastResetButtonDiv = document.querySelector(".lastResetButtonDiv");
const chosenAnswer = document.querySelectorAll(".choice-container");
const answerContainer = document.querySelector(".answer-container")
const hiddenLast = document.querySelectorAll(".hiddenLast");


// VARIABLES
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questionIndex = 0;

// PARTIES
let agr = 0;
let csl = 0;
let csns = 0;
let cssd = 0;
let ksc = 0;
let nof = 0;
let ns = 0;
let sdp = 0;

// OTAZKY - TEXT
let questions = [
{
  question: "The National Front allows you to choose one of the four parties included in it. The opposition is practically non-existent. <br>Do you agree with this setting?",
  choice1: "Yes",
  choice2: "No",
  answer: 1,
},
{
  question: "A new phase of land reforms is taking place. The state of Czechoslovakia confiscates property and redistributes it to its people. Any land larger than 50 hectares must be confiscated. <br>Do you agree?",
  choice1: "Yes",
  choice2: "No",
  answer: 2,
},
{
  question:
    "The state is looking for various means to deal with the economic crisis. ONo of the possibilities is the so-called millionaire tax, that is, higher taxation of the rich. <br>Are you in favour of its introduction?",
  choice1: "Yes",
  choice2: "No",
  answer: 3,
},
{
  question:
    "The post-war situation in Czechoslovakia is bad. Our foreign allies in the East as well as in the West are offering help. <br>Will you accept the help of one of them, even though it means antagonizing the other?",
  choice1: "Yes",
  choice2: "No",
  answer: 4,
},
{
  question:
    "On one side there is the West, which betrayed us in the past, on the other the Soviet Union, perceived by many as a liberator. Czechoslovakia is considering who to join in international politics. <br>Are you in favour of staying in the middle?",
  choice1: "Yes",
  choice2: "No",
  answer: 5,
},
{
  question:
    "In May 1946, the troops of one of the armies crossed our territory. This was approved by the Prime Minister and the Minister of Defence without the knowledge of the Parliament and other government officials. <br>Is it all right that no one else was informed about this move?",
  choice1: "Yes",
  choice2: "No",
  answer: 6,
},
{
  question:
    "Do you agree with the post-war expulsion of Germans?",
  choice1: "Yes",
  choice2: "No",
  answer: 7,
},
{
  question:
    "After the elections, it is necessary to let the churches keep their property and support their independence.",
  choice1: "Yes",
  choice2: "No",
  answer: 8,
},
{
  question:
    "During the First Republic period, members of the armed forces couldn’t vote. <br>Is it right to allow them to do so now?",
  choice1: "Yes",
  choice2: "No",
  answer: 9,
},
{
  question:
    "Some aristocratic families declared their German nationality before the war while others did not. <br>Should their property be confiscated without distinction?",
  choice1: "Yes",
  choice2: "No",
  answer: 10,
},
{
  question: "Which campaign slogan do you like best?",
  choice1: "Vote for a party that has never gone astray!",
  choice2: "United youth is a guarantee of a united state!",
  choice3: "We will not give up our freedom!  ",
  choice4: "Join us, non-socialists! ",
  answer: 11,
},
{
  question: "Které volební heslo je vám nejbližší?",
  choice1: "Volte stranu, jež nikdy nebloudila!",
  choice2: "Jednotná mládež zárukou státní jednoty!",
  choice3: "Od svobody neustoupíme!",
  choice4: "Nesocialisté do našich řad!",
  answer: 11,
},
];

// RESETBUTTON vpravo nahore
const resetButton = document.createElement("button")
resetButton.className = "resetButton";
resetButton.innerText = "< RESTART";
questionContainer.appendChild(resetButton);
resetButton.addEventListener("click", function() {
    return window.location.assign("../index.html");
});

// RESETBUTTONDIV v oznamovacim okne
const resetButtonDiv = document.createElement("button")
resetButtonDiv.className = "resetButtonDiv";
resetButtonDiv.innerText = " < RESTART";
restartDiv.appendChild(resetButtonDiv);
resetButtonDiv.addEventListener("click", function() {
    return window.location.assign("../index.html");
});

// RESETBUTTON na posledni strance
const resetButtonLast = document.createElement("button")
resetButtonLast.className = "lastResetButton";
resetButtonLast.innerText = "< RESTART";
lastResetButtonDiv.appendChild(resetButtonLast);
lastResetButtonDiv.addEventListener("click", function() {
    return window.location.assign("../index.html");
});

// TLACITKO "ANO", PRO POKRACOVANI PO NECINNOSTI
const continueButton = document.createElement("button")
continueButton.className = "continueButton";
continueButton.innerText = "YES";
continueDiv.appendChild(continueButton);
continueButton.addEventListener("click", function() {
  timeoutSign.classList.add("hideTimeoutSign");
  overlay2.classList.add("hideOverlay2");
});



// FUNKCE STARTGAME
startGame = () => {
questionCounter = 1;
availableQuestions = [...questions];

// zobrazit prvni vysvetlivku na prvni otazce
// function createButton1 (){
//   let button1 = document.createElement("button")
//   button1.className = "button1";
//   button1.innerText = "ZJISTIT VÍC"
//   questionContainer.appendChild(button1)
//   button1.addEventListener("click", function(){
//     // add class hidden na overlay element, takze kliknutim se tam ten overlay element zobrazi a udela vsechno ostatni tmavym
//     overlay.classList.remove("hidden11");
//     explanation1Flex.classList.add("translate");
//   })
// }
// createButton1();

// // zobrazi tlacitko zpet na vysvetlivce
// function createButton2 (){
//   const button2 = document.createElement("button")
//   button2.className = "button2";
//   button2.innerText = "ZPĚT"
//   explanation1Flex.appendChild(button2)
//   button2.addEventListener("click", function(){
//     overlay.classList.add("hidden11");
//     explanation1Flex.classList.remove("translate");
//   })
// }
// createButton2();

// FUNKCE GETNEWQUESTION:
getNewQuestion();
};

//FUNKCE getNewQuestion
getNewQuestion = () => {
//  if (availableQuestions.length === 0) {
// }

questionCounter++
// Update the progress bar
progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

question.classList.add("slide");
// question.classList.remove("goAway");

// prida tridu slide, diky ktere text otazek slidne doleva
function slideAway(){
  answerContainer.addEventListener("mousedown", function(){
    question.classList.remove("slide");
  })
}
slideAway();

currentQuestion = availableQuestions[0];
question.innerHTML = currentQuestion.question; //ta question na leve strane znaci ten div s tou otazkou. priradim k ni innerText, ktery si js najde tak, ze pujde podle currentQuestion a vezme si property question z te currentQuestion.
choices.forEach((choice) => {
  const number = choice.dataset["number"]; //tohle vezme to cislo z toho datasetu v html
  choice.innerHTML = currentQuestion["choice" + number]; //tomu parametru choice to priradi innerText, ktery je v currentQuestion["choice" + number]. Tohle znamena vlastne choice1, choice2 apod.
});
availableQuestions.splice(questionIndex, 1); //Tohle vyhodi tu otazku, ktera byla pouzita z obehu
acceptingAnswers = true; //tohle umozni odpovidat na otazky az tehdy, kdyz bylo vsechno nacteno (proto je na zacatku dana hodnota false)
};


// DOSTAT NOVOU OTAZKU A POCITANI BODU
choices.forEach((choice) => {
choice.addEventListener("click", (e) => {
  //kdyz kliknou na tu odpoved, tak tohle mi da reference na to, na co vlastne klikli
  if (!acceptingAnswers) return; //jestli jeste neakceptujeme odpoved, tak to budeme ignorovat

  acceptingAnswers = false; // tohle vytvori male zpozdeni, nechceme, aby na to hned kliknuli
  const selectedChoice = e.target; //timhle vyselektuju volbu, na kterou klikli
  const selectedAnswer = selectedChoice.dataset["number"]; //timhle vyselektuju odpoved, kterou ta zvolena odpoved ma

  // FUNKCE removeClassHidden - odstrani class hidden a zobrazi multiple answers na posledni otazce
  function removeClassHidden() {
    const hiddenContainer = document.querySelectorAll(".hidden");
    hiddenContainer.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.remove("hidden");
      }
    });
  }
  removeClassHidden();

  // Odstrani posledni dve odpovedi v posledni otazce, ktere tam jsou navic
  // function removeClassHiddenLast() {
  //   hiddenLast.forEach(function (item) {
  //     if (
  //       currentQuestion.answer == 8 &&
  //       (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4 || selectedAnswer == 5)
  //     ) {
  //       item.classList.add("hideLastTwoAnswers");
  //     }
  //   });
  // }
  // removeClassHiddenLast();

  // Obstaraji odkryti a zakryti html divu tak, aby byla videt posledni vysledkova stranka
  function removeClassHidden2() {
    const hiddenContainer2 = document.querySelectorAll(".hidden2");
    hiddenContainer2.forEach(function (item) {
      if (
        currentQuestion.answer == 11 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4)
      ) {
        item.classList.remove("hidden2");
      }
    });
  }
  removeClassHidden2();

  function addClassHidden3() {
    const hiddenContainer3 = document.querySelectorAll(".hidden3");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 11 &&
        (selectedAnswer == 1 || selectedAnswer == 2 || selectedAnswer == 3 || selectedAnswer == 4)
      ) {
        item.classList.add("hidden2");
      }
    });
  }
  addClassHidden3();

  function addClassLastQuestion() {
    const hiddenContainer3 = document.querySelectorAll("#last-answer");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container");
      }
    });
  }
  addClassLastQuestion();

  function addClassLastQuestion1() {
    const hiddenContainer3 = document.querySelectorAll(".question-container");
    hiddenContainer3.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-container1");
      }
    });
  }
  addClassLastQuestion1();

  function addClassLastAnswer() {
    const hiddenContainer4 = document.querySelectorAll(".choice-text");
    hiddenContainer4.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-text");
      }
    });
  }
addClassLastAnswer();

  function addClassLastText() {
    const hiddenContainer5 = document.querySelectorAll(".choice-container");
    hiddenContainer5.forEach(function (item) {
      if (
        currentQuestion.answer == 10 &&
        (selectedAnswer == 1 || selectedAnswer == 2)
      ) {
        item.classList.add("last-question-answer");
      }
    });
  }
  addClassLastText();

  // VYTVORIT VYSVETLIVKU cislo 1 - Button 1
  // function createButton1 (){
  //   let button1 = document.createElement("button")
  //   button1.className = "button1";
  //   button1.innerText = "ZJISTIT VÍC"
  //   questionContainer.appendChild(button1)
  //   button1.addEventListener("click", function(){
  //     // add class hidden na overlay element, takze kliknutim se tam ten overlay element zobrazi a udela vsechno ostatni tmavym
  //     overlay.classList.remove("hidden11");
  //     explanation1Flex.classList.add("translate");
      
  //   })
  // }

  // VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2

  // function createButton2 (){
  //   const button2 = document.createElement("button")
  //   button2.className = "button2";
  //   button2.innerText = "ZPĚT"
  //   explanation1Flex.appendChild(button2)
  //   button2.addEventListener("click", function(){
  //     overlay.classList.add("hidden11");
  //     explanation1Flex.classList.remove("translate");
  //   })
  // }

  // SKRYT BUTTON1
  // function hideButton1(){
  //   let oznaceniButton1 = document.querySelector(".button1");
  //     oznaceniButton1.classList.add("hideButton1");;
  // }

// VYTVORIT VYSVETLIVKU CISLO 2 - Button 3
function createButton3 (){
  let button3 = document.createElement("button")
  button3.className = "button3";
  button3.innerText = "MORE INFO"
  questionContainer.appendChild(button3)
  button3.addEventListener("click", function(){
    overlay.classList.remove("hidden11");
    explanation2Flex.classList.add("translate");

  
  })
}

// VYTVORIT TLACITKO ZPET Z VYSVETLIVKY - Button 2
function createButton4 (){
  const button4 = document.createElement("button")
  button4.className = "button4";
  button4.innerText = "BACK"
  explanation2Flex.appendChild(button4)
  button4.addEventListener("click", function(){
    explanation2Flex.classList.remove("translate");
    overlay.classList.add("hidden11");
  })
}

// SKRYT BUTTON3 - skryje vysvetlivku (button 3)
function hideButton3(){
  let oznaceniButton3 = document.querySelector(".button3");
    oznaceniButton3.classList.add("hideButton3");;
}


// FUNKCE countPoints - Pocitani bodu
  function countPoints() {
     // OTAZKA 1
    if (currentQuestion.answer == 1 && selectedAnswer == 1) {
      ns++;
      csl++;
    }
    if (currentQuestion.answer == 1 && selectedAnswer == 2) {
      ksc++;
    }
    // OTAZKA 2
    if (currentQuestion.answer == 2 && selectedAnswer == 1) {
      ksc++;
      cssd++;
    }
    if (currentQuestion.answer == 2 && selectedAnswer == 2) {
      ns++;
      csl++;
    }
    // OTAZKA 3
    if (currentQuestion.answer == 3 && selectedAnswer == 1) {
      ksc++;
    }
    if (currentQuestion.answer == 3 && selectedAnswer == 2) {
      ns++;
      csl++;
    }
    // OTAZKA 4
    if (currentQuestion.answer == 4 && selectedAnswer == 1) {
      csl++;
      ns++;
    }
    if (currentQuestion.answer == 4 && selectedAnswer == 2) {
      ksc++;
    }
    // OTAZKA 5
    if (currentQuestion.answer == 5 && selectedAnswer == 1) {
      ns++;
    }
    if (currentQuestion.answer == 5 && selectedAnswer == 2) {
      csl++;
      ksc++;
    }
    // OTAZKA 6
    if (currentQuestion.answer == 6 && selectedAnswer == 1) {
      ksc++;
      createButton3 ()
      createButton4 ()
      
    }
    if (currentQuestion.answer == 6 && selectedAnswer == 2) {
      csl++;
      ns++    
      createButton3 ()  
      createButton4 ()  
    }
    // OTAZKA 7
    if (currentQuestion.answer == 7 && selectedAnswer == 1) {
      cssd++;
      csl++;
      ns++;
      ksc++;
      hideButton3() 
    }
    if (currentQuestion.answer == 7 && selectedAnswer == 2) {
      hideButton3()
    }
    // OTAZKA 8
    if (currentQuestion.answer == 8 && selectedAnswer == 1) {
      csl++;
    }
    if (currentQuestion.answer == 8 && selectedAnswer == 2) {
      ns++;
      ksc++;
      cssd++
    }
    // OTAZKA 9
    if (currentQuestion.answer == 9 && selectedAnswer == 1) {
      ksc++;
    }
    if (currentQuestion.answer == 9 && selectedAnswer == 2) {
      ns++;
      csl++;
    }
    // OTAZKA 10
    if (currentQuestion.answer == 10 && selectedAnswer == 1) {
      cssd++;
      ns++;
      ksc++;
    }
    if (currentQuestion.answer == 10 && selectedAnswer == 2) {
      csl++
    }

    // OTAZKA 11
    if (currentQuestion.answer == 11 && selectedAnswer == 1) {
      cssd++
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 2) {
      ksc++
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 3) {
      ns++
    }
    if (currentQuestion.answer == 11 && selectedAnswer == 4) {
      csl++
    }
  }
  countPoints();

  // ARRAY OBJEKT VYSLEDKY TEXT
  let strany = [
  {
      text:
        "SOCIAL DEMOCRATS",
      cislo: 2,
      strana: Math.floor((cssd / 11) * 100),
  },
  {
      text:
        "NATIONAL SOCIALISTS",
      cislo: 3,
      strana: Math.floor((ns / 11) * 100),
  },
  {
      text:
        "PEOPLE'S PARTY",
      cislo: 4,
      strana: Math.floor((csl / 11) * 100),
  },
  {
      text:
        "KSČ",
      cislo: 5,
      strana: Math.floor((ksc / 11) * 100),
    },
  ];


  // Preradi objekt strany od nejvetsiho po nejmensi pocet bodu
  const stranySorted = strany.sort((a, b) => parseFloat(b.strana) - parseFloat(a.strana));
  console.log(stranySorted);


// VEZME OBJEKT "stranySorted" A HODI HO DO DIVU
stranySorted.forEach(function(obj, index, arr) {
    allDivs[index].innerHTML = obj.strana + "% " + obj.text;
  });  

function firstPartyToSee(){
  if(allDivs[0].innerHTML.indexOf("SOCIAL DEMOCRATS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Social Democrats</p><br> <p>The tradition of an organized social democratic movement started in 1878, <br>but the Czechoslovak Social Democratic Worker’s Party (ČSDSD) was only founded <br>in December 1918. It was one of the strongest parties of the First Republic period. <br>In the 1920s and 1930s, however, it lost its position in the Government due <br>to disputes with the Communists, and would lose the subsequent elections <br>to the Agrarians. During the Second World War, a number of former members <br>of the party joined the resistance. They were represented in the London exile Government. <br><br>Social democracy was restored after 1945 as one of the four permitted parties <br>of the National Front. A year later it won 15% of the vote and finished last compared to other Czech parties.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/cssd.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("NATIONAL SOCIALISTS") !== -1) {
    changingPartiesDiv.innerHTML = "<p>National Socialists</p><br>The Czechoslovak National Socialist Party was founded in 1897 but only adopted this name in 1926. It had its own unions that helped consolidate its political power <br>in the interwar period. After the resignation of President Tomáš G. Masaryk, <br>the national socialist Edvard Beneš took his place. <br><br>During the Second World War, the members of this party actively participated in civil and national resistance. Some of them worked in exile in London. After the War, <br>the National Socialists acted as a socialist party with a different programme than <br>the radical Communists.   In the 1946 elections, they won about 25% of the vote and were the second strongest parliamentary party. After the Communists took power <br>in 1948, some members of the party were persecuted and executed. Others joined the ruling Communist Party or went to exile.";
    partiesContainerDiv.style.backgroundImage = "url(../img/ns.jpg)"

  }
  if(allDivs[0].innerHTML.indexOf("PEOPLE'S PARTY") !== -1) {
    changingPartiesDiv.innerHTML = "<p>People's Party</p><br>The Czechoslovak People’s Party was established in January 1919 by merging several Catholic parties. From the beginning, it targeted people from all social backgrounds and thanks to its broad scope was successful despite weak election results. During the war, the party was represented in the exile government, and in 1945 it was the only renewed non-socialist party. The party leaders hoped for victory, but the result was only 16% of the vote. After the communist takeover in 1948, some members were persecuted while others remained in the party, collaborating with the regime. <br>Until 1989, it was a part of the National Front alongside the Communist Party.";
    partiesContainerDiv.style.backgroundImage = "url(../img/csl.jpg)";
  }
  if(allDivs[0].innerHTML.indexOf("KSČ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>KSČ</p><br><p>The Communist Party of Czechoslovakia was an extreme left-wing party that was formed in 1921 by splitting off from social democracy. <br>At the time of its establishment, it was already one of the largest communist parties <br>in the world, and since 1929 it was bolshevized according to the Soviet model.  Some of its members were exiled in Moscow during the Second World War, and those who remained ended up in concentration camps or were executed. The Communist Party was gradually preparing to seize power in Czechoslovakia. In 1945 it was the most active party in the National Front. <br>It had an increased representation in the Government and won the 1946 elections with 40% of the vote. Two years later, it started a dictatorship and remained in power until 1989.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/ksc.jpg)";
  }
}
firstPartyToSee();

//Switch color of active link
party.forEach(function (item) {
  item.addEventListener("mousedown", function (e) {
    partiesContainerDiv.querySelector(".current").classList.remove("current");
    item.classList.add("current");
  });
});

function clickOnDiv(){
allDivs.forEach((something) => {
something.addEventListener("mousedown", (e) => {
  
  const selectedDiv = e.target; 

  function changeBackground(){
    if(selectedDiv.innerHTML.indexOf("SOCIAL DEMOCRATS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Social Democrats</p><br> <p>The tradition of an organized social democratic movement started in 1878, <br>but the Czechoslovak Social Democratic Worker’s Party (ČSDSD) was only founded <br>in December 1918. It was one of the strongest parties of the First Republic period. <br>In the 1920s and 1930s, however, it lost its position in the Government due <br>to disputes with the Communists, and would lose the subsequent elections <br>to the Agrarians. During the Second World War, a number of former members <br>of the party joined the resistance. They were represented in the London exile Government. <br><br>Social democracy was restored after 1945 as one of the four permitted parties <br>of the National Front. A year later it won 15% of the vote and finished last compared to other Czech parties.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/cssd.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("NATIONAL SOCIALISTS") !== -1) {
      changingPartiesDiv.innerHTML = "<p>National Socialists</p><br>The Czechoslovak National Socialist Party was founded in 1897 but only adopted this name in 1926. It had its own unions that helped consolidate its political power <br>in the interwar period. After the resignation of President Tomáš G. Masaryk, <br>the national socialist Edvard Beneš took his place. <br><br>During the Second World War, the members of this party actively participated in civil and national resistance. Some of them worked in exile in London. After the War, <br>the National Socialists acted as a socialist party with a different programme than <br>the radical Communists.   In the 1946 elections, they won about 25% of the vote and were the second strongest parliamentary party. After the Communists took power <br>in 1948, some members of the party were persecuted and executed. Others joined the ruling Communist Party or went to exile.";
      partiesContainerDiv.style.backgroundImage = "url(../img/ns.jpg)"
  
    }
    if(selectedDiv.innerHTML.indexOf("PEOPLE'S PARTY") !== -1) {
      changingPartiesDiv.innerHTML = "<p>People's Party</p><br>The Czechoslovak People’s Party was established in January 1919 by merging several Catholic parties. From the beginning, it targeted people from all social backgrounds and thanks to its broad scope was successful despite weak election results. During the war, the party was represented in the exile government, and in 1945 it was the only renewed non-socialist party. The party leaders hoped for victory, but the result was only 16% of the vote. After the communist takeover in 1948, some members were persecuted while others remained in the party, collaborating with the regime. <br>Until 1989, it was a part of the National Front alongside the Communist Party.";
      partiesContainerDiv.style.backgroundImage = "url(../img/csl.jpg)";
    }
    if(selectedDiv.innerHTML.indexOf("KSČ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>KSČ</p><br><p>The Communist Party of Czechoslovakia was an extreme left-wing party that was formed in 1921 by splitting off from social democracy. <br>At the time of its establishment, it was already one of the largest communist parties <br>in the world, and since 1929 it was bolshevized according to the Soviet model.  Some of its members were exiled in Moscow during the Second World War, and those who remained ended up in concentration camps or were executed. The Communist Party was gradually preparing to seize power in Czechoslovakia. In 1945 it was the most active party in the National Front. <br>It had an increased representation in the Government and won the 1946 elections with 40% of the vote. Two years later, it started a dictatorship and remained in power until 1989.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/ksc.jpg)";
    }
  }
  changeBackground();
})});
};
clickOnDiv();


getNewQuestion();
  
});
});

startGame();


