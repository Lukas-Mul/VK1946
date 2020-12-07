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
  question: "Národní fronta umožňuje volbu jedné ze čtyř politických stran v ní sdružených. Opozice prakticky neexistuje. <br>Souhlasíte s takovým nastavením?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 1,
},
{
  question: "Nová fáze pozemkových reforem. Československo přistupuje k zabavování majetku <br>a jeho přerozdělování obyvatelstvu. Pozemky větší než 50 hektarů je třeba zabavit. Souhlasíte?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 2,
},
{
  question:
    "Stát hledá různé prostředky, jak se vypořádat s ekonomickou krizí. <br>Jednou z možností je tzv. milionářská daň, tedy vyšší zdanění bohatých. <br>Jste pro její zavedení?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 3,
},
{
  question:
    "Poválečná situace v Československu je nepříznivá. Přichází nabídka pomoci <br>od zahraničních spojenců, kterými je Východ i Západ. <br>Přijmete pomoc jednoho z nich, i když to znamená znepřátelení toho druhého? ",
  choice1: "Ano",
  choice2: "Ne",
  answer: 4,
},
{
  question:
    "Na jedné straně Západ, který nás v minulosti zradil, na druhé Sovětský svaz, mnohými vnímán jako osvoboditel. Československo zvažuje, ke komu <br>se v mezinárodní politice přiklonit. <br>Jste pro středovou pozici?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 5,
},
{
  question:
    "V květnu roku 1946 přešla přes naše území vojska jedné z armád. <br>Schválil to předseda vlády a ministr obrany bez vědomí parlamentu a ostatních představitelů vlády. <br>Je v pořádku, že o tomto přesunu nebyl informován nikdo další?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 6,
},
{
  question:
    "Souhlasíte s poválečným vysídlením Němců?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 7,
},
{
  question:
    "Po volbách je třeba ponechat církvím majetek a podpořit jejich nezávislost.",
  choice1: "Ano",
  choice2: "Ne",
  answer: 8,
},
{
  question:
    "V dobách první republiky nemohli příslušníci ozbrojených složek volit. <br>Je správné jim to teď umožnit?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 9,
},
{
  question:
    "Některé šlechtické rody se před válkou přihlásily k německé národnosti, některé ne. Měl by jim být odebrán majetek bez rozdílu?",
  choice1: "Ano",
  choice2: "Ne",
  answer: 10,
},
{
  question: "Které volební heslo je vám nejbližší?",
  choice1: "Volte stranu, jež nikdy nebloudila!",
  choice2: "Jednotná mládež zárukou státní jednoty!",
  choice3: "Od svobody neustoupíme!",
  choice4: "Nesocialisté do našich řad!",
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
continueButton.innerText = "ANO";
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
  button3.innerText = "ZJISTIT VÍC"
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
  button4.innerText = "ZPĚT"
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
        "SOCIÁLNÍ DEMOKRACIE",
      cislo: 2,
      strana: Math.floor((cssd / 11) * 100),
  },
  {
      text:
        "NÁRODNÍ SOCIALISTÉ",
      cislo: 3,
      strana: Math.floor((ns / 11) * 100),
  },
  {
      text:
        "LIDOVCI",
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
  if(allDivs[0].innerHTML.indexOf("SOCIÁLNÍ DEMOKRACIE") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Sociální demokracie</p><br> <p>Tradice organizované sociální demokracie začala v roce 1878, ale Československá sociálně demokratická strana dělnická (ČSDSD) vznikla až v prosinci 1918. <br>Byla jednou z nejsilnějších politických stran první republiky. Ve 20. a 30. letech však kvůli rozporům s komunisty o post vládnoucího člena přišla a ve volbách se poté umisťovala až za Agrárníky. Během druhé světové války se řada bývalých členů sociální demokracie zapojila do odbojové činnosti. Svoje zastoupení měli v Londýně. <br><br>Sociální demokracie byla obnovena po roce 1945 jako jedna ze čtyř povolených stran Národní fronty. O rok později získala ve volbách 15 % hlasů a ve srovnání s ostatními českými stranami skončila jako poslední.</p>";
    partiesContainerDiv.style.backgroundImage = "url(../img/cssd.jpg)";

  }
  if(allDivs[0].innerHTML.indexOf("NÁRODNÍ SOCIALISTÉ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Národní socialisté</p><br>Československá strana národně socialistická vznikla v roce 1897, ale tento název přijala až roku 1926. Měla vlastní odbory, které jí v meziválečných letech pomáhaly upevňovat politickou moc. Po odchodu prezidenta Tomáše G. Masaryka z úřadu stanul v čele země národní socialista Edvard Beneš. <br><br>Členové strany se za druhé světové války aktivně zapojili do občanského a národního odboje. Někteří z nich působili v londýnském exilu. Po válce vystupovali národní socialisté jako socialistická strana, programově odlišná od radikálních komunistů. <br>Ve volbách roku 1946 získali kolem 25 % hlasů a byli tak druhou nejsilnější parlamentní stranou. Po převzetí moci komunisty v roce 1948 došlo k perzekuci <br>a popravám některých členů. Jiní se k vládnoucí KSČ připojili, nebo odešli do exilu.";
    partiesContainerDiv.style.backgroundImage = "url(../img/ns.jpg)"

  }
  if(allDivs[0].innerHTML.indexOf("LIDOVCI") !== -1) {
    changingPartiesDiv.innerHTML = "<p>Lidovci</p><br>Československá strana lidová vznikla v lednu 1919 sloučením několika katolických stran. Od začátku cílila na všechny vrstvy obyvatel a díky svému širokému záběru měla i navzdory slabším volebním výsledkům úspěch. Během války byla zastoupena <br>v exilové vládě a v roce 1945 šlo o jedinou obnovenou nesocialistickou stranu. Vedení strany doufalo ve vítězství, ale výsledkem bylo pouhých 16 % hlasů. Po převzetí moci komunisty v roce 1948 došlo k perzekuci některých členů, ostatní zůstali ve straně kolaborující s tehdejším režimem. Až do roku 1989 byli stejně jako KSČ součástí Národní fronty.";
    partiesContainerDiv.style.backgroundImage = "url(../img/csl.jpg)";
  }
  if(allDivs[0].innerHTML.indexOf("KSČ") !== -1) {
    changingPartiesDiv.innerHTML = "<p>KSČ</p><br><p>Komunistická strana Československa byla krajně levicová strana, která vznikla v roce 1921 odštěpením od sociální demokracie. Už v době svého vzniku byla jednou <br>z největších komunistických stran na světě a od roku 1929 se dle sovětského vzoru bolševizovala. Někteří její členové byli za druhé sv. války v moskevském exilu <br>a ti, kteří zůstali, skončili v koncentračních táborech nebo na popravišti. <br>KSČ se postupně připravovala na převzetí moci v Československu. <br>V roce 1945 šlo o nejaktivnější stranu Národní fronty. Měla zvýšené zastoupení <br>ve vládě a ve volbách roku 1946 zvítězila se 40 % hlasů. O dva roky později zavedla diktaturu a u moci se držela až do roku 1989.</p>";
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
    if(selectedDiv.innerHTML.indexOf("SOCIÁLNÍ DEMOKRACIE") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Sociální demokracie</p><br> <p>Tradice organizované sociální demokracie začala v roce 1878, ale Československá sociálně demokratická strana dělnická (ČSDSD) vznikla až v prosinci 1918. <br>Byla jednou z nejsilnějších politických stran první republiky. Ve 20. a 30. letech však kvůli rozporům s komunisty o post vládnoucího člena přišla a ve volbách se poté umisťovala až za Agrárníky. Během druhé světové války se řada bývalých členů sociální demokracie zapojila do odbojové činnosti. Svoje zastoupení měli v Londýně. <br><br>Sociální demokracie byla obnovena po roce 1945 jako jedna ze čtyř povolených stran Národní fronty. O rok později získala ve volbách 15 % hlasů a ve srovnání s ostatními českými stranami skončila jako poslední.</p>";
      partiesContainerDiv.style.backgroundImage = "url(../img/cssd.jpg)";
  
    }
    if(selectedDiv.innerHTML.indexOf("NÁRODNÍ SOCIALISTÉ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Národní socialisté</p><br>Československá strana národně socialistická vznikla v roce 1897, ale tento název přijala až roku 1926. Měla vlastní odbory, které jí v meziválečných letech pomáhaly upevňovat politickou moc. Po odchodu prezidenta Tomáše G. Masaryka z úřadu stanul v čele země národní socialista Edvard Beneš. <br><br>Členové strany se za druhé světové války aktivně zapojili do občanského a národního odboje. Někteří z nich působili v londýnském exilu. Po válce vystupovali národní socialisté jako socialistická strana, programově odlišná od radikálních komunistů. <br>Ve volbách roku 1946 získali kolem 25 % hlasů a byli tak druhou nejsilnější parlamentní stranou. Po převzetí moci komunisty v roce 1948 došlo k perzekuci <br>a popravám některých členů. Jiní se k vládnoucí KSČ připojili, nebo odešli do exilu.";
      partiesContainerDiv.style.backgroundImage = "url(../img/ns.jpg)"
  
    }
    if(selectedDiv.innerHTML.indexOf("LIDOVCI") !== -1) {
      changingPartiesDiv.innerHTML = "<p>Lidovci</p><br>Československá strana lidová vznikla v lednu 1919 sloučením několika katolických stran. Od začátku cílila na všechny vrstvy obyvatel a díky svému širokému záběru měla i navzdory slabším volebním výsledkům úspěch. Během války byla zastoupena <br>v exilové vládě a v roce 1945 šlo o jedinou obnovenou nesocialistickou stranu. Vedení strany doufalo ve vítězství, ale výsledkem bylo pouhých 16 % hlasů. Po převzetí moci komunisty v roce 1948 došlo k perzekuci některých členů, ostatní zůstali ve straně kolaborující s tehdejším režimem. Až do roku 1989 byli stejně jako KSČ součástí Národní fronty.";
      partiesContainerDiv.style.backgroundImage = "url(../img/csl.jpg)";
    }
    if(selectedDiv.innerHTML.indexOf("KSČ") !== -1) {
      changingPartiesDiv.innerHTML = "<p>KSČ</p><br><p>Komunistická strana Československa byla krajně levicová strana, která vznikla v roce 1921 odštěpením od sociální demokracie. Už v době svého vzniku byla jednou <br>z největších komunistických stran na světě a od roku 1929 se dle sovětského vzoru bolševizovala. Někteří její členové byli za druhé sv. války v moskevském exilu <br>a ti, kteří zůstali, skončili v koncentračních táborech nebo na popravišti. <br>KSČ se postupně připravovala na převzetí moci v Československu. <br>V roce 1945 šlo o nejaktivnější stranu Národní fronty. Měla zvýšené zastoupení <br>ve vládě a ve volbách roku 1946 zvítězila se 40 % hlasů. O dva roky později zavedla diktaturu a u moci se držela až do roku 1989.</p>";
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


