let wordInput = document.querySelector("#wordInput");
let searchBtn = document.querySelector("#searchBtn");
let resultBox = document.querySelector("#resultBox");
let wordTitle = document.querySelector("#wordTitle");
let wordMeaning = document.querySelector("#wordMeaning");
let wordExample = document.querySelector("#wordExample");

let wordSynonyms = document.querySelector("#wordSynonyms");
let wordAntonyms = document.querySelector("#wordAntonyms");

let saveBtn = document.querySelector("#saveBtn");
let saveWords = document.querySelector("#saveWords");
let wordList = document.querySelector("#wordList");

const loading = document.querySelector("#loading");
const quizBox = document.querySelector("#quizBox");
const quizQuestion = document.querySelector("#quizQuestion");
const quizAnswer = document.querySelector("#quizAnswer");
const checkQuiz = document.querySelector("#checkQuiz");
const quizResult = document.querySelector("#quizResult");

const APIKEY = "AIzaSyARXj_-OIipVQn1nNbMv1YRUSw9yo2ry60";
const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${APIKEY}`;



async function getWordDetails(word){
    loading.classList.remove("hidden");
    // resultBox.classList.remove("hidden");
    // quizBox.classList.remove("hidden");

    const prompt = `
Explain the English word "${word}" with:
1. Meaning
2. Example sentence
3. 3 synonyms
4. 3 antonyms
5. A simple fill-in-the-blank quiz

Return ONLY JSON with keys: meaning, example, synonyms, antonyms, quiz
`;
try{
  let res = await fetch(url,{
    method:"POST",
    headers:{
        "Content-Type":"application/json",
    },
    body:JSON.stringify({
        contents:[{parts:[{text:prompt}] }],
    }),
  });
//   console.log(res); 
   if(!res.ok) throw new error(Error`${res.status}`);
   
   const data = await res.json();
   console.log(data);
   const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
   console.log(aiResponse);
   if(!aiResponse) throw new Error("No Response From Gemini API");

   const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
   if(!jsonMatch) throw new Error("AI did not return JSON");

   const parsedData = JSON.parse(jsonMatch);
   console.log(parsedData);

   loading.classList.add("hidden");
   return parsedData;
}catch(error){
 console.log("Error in Fetching words...");
} 
}


// function getWordDetails(word){
//     const dummyData={
//         meaning:"the act jkfjkdfj fkdlkf jgdklk ggjjkhkjh.",
//         example:"Innovation jkfidjf fjkl fjdk jk fdf fdfdfdf.",
//     };
//     return dummyData;
// }



searchBtn.addEventListener("click",async ()=>{
    const word = wordInput.value.trim();
    if(word === ""){
        alert("Please Enter a Word");
        return;
    }
    const details = await getWordDetails(word);
     wordTitle.textContent = word.charAt(0).toUpperCase() + word.slice(1);
     wordMeaning.textContent = `Meaning: ${details.meaning}`;
     wordExample.textContent = `Example: ${details.example}`;
     wordSynonyms.textContent = `Synonyms: ${details.synonyms.join(", ")}`;
     wordAntonyms.textContent = `Antonyms: ${details.antonyms.join(", ")}`;

     quizQuestion.textContent = details.quiz.question || details.quiz.sentence || details.quiz;
     quizBox.classList.remove("hidden");
     quizAnswer.value = "";
     quizResult.textContent = "";

     resultBox.classList.remove("hidden")
})

// saveBtn.addEventListener("click",()=>{
//     console.log("word");
//     let list = document.createElement("li");
//     list.textContent = wordInput.value.trim();
//     wordList.appendChild(list);
//     localStorage.setItem(wordInput.value.trim());
// })

let savedWords  = JSON.parse(localStorage.getItem("wordBank")) || [];
displaySavedWords();

saveBtn.addEventListener("click", ()=>{
    const word = wordTitle.textContent;
    if(!savedWords.includes(word)){
        savedWords.push(word);
        localStorage.setItem("wordBank",JSON.stringify(savedWords));
        displaySavedWords();
        alert("Word Saved Successfully");
    }else{
        alert("This Word is Already Saved");
    }
});

function displaySavedWords(){
    wordList.innerHTML = "";
    savedWords.forEach((word)=>{
    const li = document.createElement("li");
    li.innerHTML = `${word} <button  onClick="deleteWord('${word}')">❌</button>`;
    wordList.appendChild(li);
    });
}

function deleteWord(word){
    savedWords = savedWords.filter((w)=>w!==word);
    localStorage.setItem("wordBank", JSON.stringify(savedWords));
    displaySavedWords();
    alert("Word Removed Succesfully")
}



//localStorage.setItem("key1", {name:"fjdkj"})
//LocalStorage.setItem("key1", JSON.stringify({name:"fjkdsf"}))
//console.log(LocalStorage.getItem("key1"));
// console.log(JSON.parse(LocalStorage.getItem("key1")))

// JSON.parse()-> Converts JSON Sting into Objects.
// JSON.string()-> Converts Objects into JSON Sting.
