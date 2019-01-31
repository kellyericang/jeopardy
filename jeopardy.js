// single player trivia game
// generate a random board of questions (6x5)
// click on a question and it comes up 
// answer correctly and the money adds to your total 
// answer wrong and it subtracts 
/////////////////////////////////////////////////////

//--- general ---//
let mainMenuButton = document.querySelector("button.mainMenu");

//--- game selection ---//
let gameSelectionMenu = document.getElementById("gameSelectionMenu");
// let gameSelectionButton = document.querySelector("div#gameSelection button");
let gameMode = document.querySelector(".selectGameMode"); 
let randomGameButton = document.getElementById("randomGame");
let fullGameButton = document.getElementById("fullGame");

//--- game board ---//
let clue = document.querySelector(".clue");
let board = document.querySelector("div.board");
let question = document.querySelector("p.question");
let questionCounter = document.querySelector("p.questionCounter");
let answer = document.querySelector("p.answer");
let category = document.querySelector("p.category");
let randomButton = document.querySelector("button.random"); 
let input = document.getElementById("userinput"); 
let guessButton = document.getElementById("guess");
let scoreBoard = document.getElementById("score"); 

let resp, result, score = 0, totalQuestion, questionNumber=0, answerStr;


//-------------------------//
//--- general functions ---//
//-------------------------//

function toggle(x) {
	console.log(`${x} is being toggled`);
	if(x.style.display === "none") {
		x.style.display = "block";
	} else if(x.style.display === "block"){
		x.style.display = "none";
	}
}

function inputLength() {
	return input.value.length;
}


//-----------------------------------------//
//--- game selection and menu functions ---//
//-----------------------------------------//

function selectGame() {
	totalQuestion = document.getElementById("questionNum").value;
	console.log(totalQuestion, "questions selected")
	gameSelectionMenu.style.display = "none";
	board.style.display = "block";
	clue.style.display = "block";
}

function displayEndScreen(){
	console.log('End of Game');
}

function mainMenu() {
	console.log("back to the main menu");
	gameSelectionMenu.style.display = "block";
	board.style.display = "none"; 
}


//------------------------------------//
//--- game board related functions ---//
//------------------------------------//

function updateQuestionCounter() {
	questionNumber++; 
	questionCounter.textContent = `Question ${questionNumber} of ${totalQuestion}`;
}

function displayClue() {
	clue.style.visibility = "visible";
	category.textContent = result[0].category.title;
	question.textContent = result[0].question; 
	answer.textContent = "";
}

function updateScore(bool) {
	bool ? score += result[0].value : score -= result[0].value;
	scoreBoard.textContent = score; 
}


//----------------------------------//
//--- gameplay related functions ---//
//----------------------------------//

function startRandomGame() {

}

async function randomQuestion() {
	resp = await fetch('http://jservice.io/api/random');
	result = await resp.json(); 
	console.log('result:', result);
	if(result[0].question == "" || result[0].invalid_count != null) {
		console.log('getting a new question')
		randomQuestion();
	} else if(questionNumber == totalQuestion) {
		displayEndScreen();
	} else {
		input.value = "";
		updateQuestionCounter();
		displayClue();
	}
}

function guessAnswer() {
	let guess = ((input.value).trim()).toLowerCase(); 
	console.log('guess:', guess);
	
	let ans = cleanUpAnswer().toLowerCase();
	console.log('answer:', ans);
	let ansBool = false; 

	console.log('typeof(ans) =', typeof(ans));
	if(typeof(ans) != "string") {
		for(x of ans) {
			if(guess == x) { 
				ansBool == true; 
				break;
			}
		}
	} else {
		ansBool = (guess == ans);
		console.log('ansBool:', ansBool);
	}

	if(ansBool) {
		console.log('correct!');
		answer.textContent = "correct! the answer is: " + ans;
		updateScore(true); 
	} else {
		console.log('wrong');
		answer.textContent = "wrong! the correct answer is: " + ans;
		updateScore(false); 
	}
	input.value = "";
}

function inputEnter(event) {
	if (inputLength() > 0 && event.keyCode === 13) {
		guessAnswer();
	} else if (inputLength() == 0 && event.keyCode === 13) {
		randomQuestion();
	}
}

function cleanUpAnswer(){
	// "opthamology (optometry accepted)" is also an answer
	// "RAM (or Random Access Memory)"
	let answerArray=[];
	answerStr = result[0].answer;
	answerStr = answerStr.replace(/<[^>]*>/gm,""); //removing tags if present
	answerStr = answerStr.replace(/\/(?![a-zA-Z0-9])/gm,""); //removing escaped characters 
	answerStr = answerStr.replace(/\-(?=[A-Z])/gm,""); //spelling questions 

	// if there's multiple answers 
	if(answerStr.indexOf("/") != -1) {
		answerArray = answerStr.split("/");
		return answerArray;
	} else if(answerStr[0] == "a") { 
		// getting rid of "a" or "an"
		answerArray[0] = answerStr; 
		answerArray.push(answerStr.replace(/(a\s)|(an\s)/gm,""));
		return answerArray; 
	} else if(answerStr.indexOf("(") != -1) {
		// if the answer has something in ()
		answerArray[0] = answerStr; // original answer 
		answerArray.push(answerStr.replace(/\s\(.*\)/gm,"")); // without the brackets
		answerArray.push(answerStr.substring(answerStr.indexOf("(")+1, answerStr.indexOf(")"))); //stuff in the brackets
		return answerArray; 
	}
	return answerStr;
}


//--- event listeners ---//
guessButton.addEventListener("click", guessAnswer);
input.addEventListener("keyup", inputEnter);
// gameSelectionButton.addEventListener("click", selectGame);
mainMenuButton.addEventListener("click", mainMenu)
randomGameButton.addEventListener("click", startRandomGame);
// fullGameButton.addEventListener("click", startFullGame);

//-------------------------//
//--- CSS related stuff ---//
//-------------------------//
