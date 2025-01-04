window.addEventListener("load",()=>{
    const questionCounter = document.querySelector("#questionCounter");
    const timerBar = document.querySelector("#Bar");
    const timer = document.querySelector("#timer");
    const questionContainer = document.querySelector("#questionContainer");
    const nextBtn = document.querySelector("#nextBtn");
    const result = document.querySelector("#result");
    const score = document.querySelector("#score");
    const percentageScore = document.querySelector("#percentageScore");


   
class Exam {
    #questions;
    #currentQuestionIndex;
    selectedAnswer;
    #totalTime
    #timeRemaining;
    #timerIntervalId;
    #score;
    constructor(questions) {
        this.#questions = questions;
        this.#currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.#totalTime = 60;
        this.#timeRemaining = 60;
        this.#score = 0;
        this.#timerIntervalId = null;
    }


    updateTimerBar() {
        const percentageRemaining = (this.#timeRemaining / this.#totalTime) * 100;
        timerBar.style.width = percentageRemaining + '%';
        if (percentageRemaining < 0) {
            timerBar.style.width = '0%';
        }
    }
    
    formatTime(AllSeconds) {
        const minutes = Math.floor(AllSeconds / 60);
        const seconds = AllSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    questionDisplay() {
        if (this.#currentQuestionIndex < this.#questions.length) 
        {
            questionCounter.textContent = `${this.#currentQuestionIndex + 1}/${this.#questions.length}`;
            const question = this.#questions[this.#currentQuestionIndex];
            questionContainer.innerHTML = `
                <h4 class="questionFont">${question.title}</h4>
                <img  src="${question.image}" alt="noImg">
                <div id="answersContainer">
                    ${question.answers.map(answer => `
                            <input type="button" class="answerBtn questionFont" value="${answer}" >
                    `).join('')}
                </div>
            `;
            const answerBtns = document.querySelectorAll('.answerBtn');

            answerBtns.forEach(btn => {
                btn.addEventListener('click', () =>{
                     this.selectAnswer(btn.value);
                     console.log(btn.value);
                });
            });
        } 
        else
        {
            this.showResult();
        }
    }
    selectAnswer(answer) {
        this.selectedAnswer = answer;
        const answerBtns = document.querySelectorAll('.answerBtn');
        answerBtns.forEach(btn => {
            btn.style.backgroundColor = (btn.value === this.selectedAnswer ? 'grey' : '');
        });
        nextBtn.disabled = false;
    }

    //when press next
    nextQuestion() {
        if (this.selectedAnswer === this.#questions[this.#currentQuestionIndex].correctAnswer) {
            this.#score++;
        }
        this.#currentQuestionIndex++;
        this.selectedAnswer = null;
        nextBtn.disabled = true;
        this.questionDisplay();
    }

    startExam(){
        this.randomQuestions();
        this.randomAnswers();
        this.questionDisplay();
        this.#timerIntervalId = setInterval(()=>{
            this.#timeRemaining--;
            this.updateTimerBar();
            timer.innerText = "time: "+ this.formatTime(this.#timeRemaining);
            if (this.#timeRemaining <= 0) {
                clearInterval(this.#timerIntervalId);
                 this.showResult();
            }
        },1000)
    }

    showResult(){
        clearInterval(this.#timerIntervalId);
        timer.style.display = 'none';
        timerBar.parentNode.style.display = 'none';
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        result.style.display = 'block'; 

        const percentage = Math.round((this.#score / this.#questions.length) * 100);
        percentageScore.innerText = `${percentage}%`;
        score.textContent = `You have ${this.#score} out of ${this.#questions.length} correct answers`;
    }
    
    randomQuestions(){
        this.#questions.sort(() => Math.random() - 0.5);
    }

    randomAnswers(){
        this.#questions.forEach(question => {
            question.answers.sort(() => Math.random() - 0.5);
        });
    }

}


let questions = [
    {
        title: "What is the name of this animal ?",
        image: "images/1.jpg",
        answers: ["Giraffe", "Elephant", "Rhinoceros"],
        correctAnswer: "Elephant"
    },
    {
        title: "What is the name of this sport?",
        image: "images/2.jpg",
        answers: ["Cricket", "Corkball", "Kickball"],
        correctAnswer: "Cricket"
    },
    {
        title: "Who is the author of 'Mona Lisa'?",
        image: "images/3.jpg",
        answers: ["Rembrandt", "Michelangelo", "Leonardo Da Vinci"],
        correctAnswer: "Leonardo Da Vinci"
    },
    {
        title: "What is the name of this Pokemon?",
        image: "images/4.jpg",
        answers: ["Pikachu", "Raichu", "Pichu"],
        correctAnswer: "Pikachu"
    },
    {
        title: "What is the name of this fictional cat with no mouth and a red bow?",
        image: "images/5.jpg",
        answers: ["Doraemon", " Hello Kitty", "Totoro"],
        correctAnswer: "Hello Kitty"
    },
    {
        title: "What is this popular cocktail?",
        image: "images/6.jpg",
        answers: ["Daiquiri", "Mojito", "Margarita"],
        correctAnswer: "Mojito"
    },
    {
        title: "Which type of nuts is this?",
        image: "images/7.jpg",
        answers: ["Hazelnut", "Almond", "Pistachio"],
        correctAnswer: "Almond"
    },
    {
        title: "What is the approximate value of this mathematical constant?",
        image: "images/8.jpg",
        answers: ["1.32", "2.79", "3.14"],
        correctAnswer: "3.14"
    },
    {
        title: "What is the name of the national dress of Japan?",
        image: "images/9.jpg",
        answers: ["Hanbok", "Ao dai", "Kimono"],
        correctAnswer: "Kimono"
    },
    {
        title: "From which country did this musical instrument originally come from?",
        image: "images/10.jpg",
        answers: ["Spain", "Germany", "France"],
        correctAnswer: "Spain"
    },
]

let exam = new Exam(questions);

nextBtn.addEventListener("click",()=>{
exam.nextQuestion();
})

//popup 
Swal.fire({
    imageUrl: 'images/startExam.png',
    imageWidth: 200, 
    imageHeight: 200, 
    title: 'Enter Your Name',
    color: '#3B1E54',
    input: 'text',
    confirmButtonText: 'Start Exam',
    allowOutsideClick: false,
    preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(`Please enter your name`)
        }
      }
}).then((result) => {
    if (result.isConfirmed) {
        studentName = result.value;
       exam.startExam();
    }

});



});