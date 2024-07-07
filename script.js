const sideNavigation = document.querySelector(".sideNavigation"),
sideBarToggle = document.querySelector(".fa-bars"),
startContentUl = document.querySelector(".startContent ul"),
inputArea = document.querySelector(".inputArea input"),
sendRequest = document.querySelector(".fa-paper-plane"),
chatHistory = document.querySelector(".chathistory ul"),
startContent = document.querySelector(".startContent"),
chatContent = document.querySelector(".chatContent"),
results = document.querySelector(".results");


promtQuestions = [{
    question: "Write a Sample Code to learn javascript",
    icon: "fa-solid fa-code",

},

{
    question: "Share a list of exercises to loose weight",
    icon: "fa-solid fa-dumbbell",

},

{
    question: "How to became a Full Stack developer?",
    icon: "fa-solid fa-laptop-code",
},

{
    question: "Share a roadmap to become a Front-end Developer",
    icon: "fa-solid fa-database",

},


];

window.addEventListener("load", () => {
    promtQuestions.forEach((data) => {
        let item = document.createElement("li");
        item.addEventListener("click",()=>{
            getGeminiResponse(data.question, true);
        });
        item.innerHTML = `
            <div class="promtSuggestion">
                <p>${data.question}</p>
                <div class="icon">
                    <i class="${data.icon}"></i>
                </div>
            </div>
        `;
        startContentUl.append(item);
    });
});

sideBarToggle.addEventListener("click",()=>{
    sideNavigation.classList.toggle("expandClose")
});

inputArea.addEventListener("keyup",(e)=>{
    if(e.target.value.length>0){
        sendRequest.style.display = "inline";
    }else{
        sendRequest.style.display = "none";
    }
});

sendRequest.addEventListener("click",()=>{
    getGeminiResponse(inputArea.value,true);
});  

function getGeminiResponse(question,appendHistory){
    console.log(question); 
    if(appendHistory){
    let historyLi = document.createElement("li");
    historyLi.addEventListener("click",()=>{
        getGeminiResponse(question,false); 
    })
historyLi.innerHTML = `<i class="fa-regular fa-message"></i>${question}`;
chatHistory.append(historyLi);
    }

results.innerHTML = "";
inputArea.value = "";

startContent.style.display="none";
chatContent.style.display="block";

let resultTitle = `
<div class = "resultTitle">
<img src = "https://i.pinimg.com/736x/1c/54/f7/1c54f7b06d7723c21afc5035bf88a5ef.jpg" />
<p>${question}</p>
</div>
`;

let resultData=`
<div class = "resultData">
<img src = "icon.png"/>

<div class="loader">
<div class ="animatedBG"></div>
<div class ="animatedBG"></div>
<div class ="animatedBG"></div>
</div>
</div>
`;

results.innerHTML +=resultTitle;
results.innerHTML +=resultData;
 
const AIURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB3w5Gmcwcb5xD_Kh8IiiWp06o7JXCQra8'

fetch(AIURL, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }],
    })
})
.then((response) => response.json())
.then((data) => {
    document.querySelector(".results .resultData").remove();


    let responseData = jsonEscape(data.candidates[0].content.parts[0].text);
    console.log(responseData);

    let responseArray = responseData.split("**");
    let newResponse = "";

    for(let index = 0; index<responseArray.length;index++){
       if(index==0 || index%2 !==1){
        newResponse += responseArray[index];
        }
        else{
            newResponse += "<strong>" + responseArray[index].split(" ").join("&nbsp") + "</strong>"; 
        }
    }


    let newResponse2 = newResponse.split("*").join(" ");

    let textArea = document.createElement("textarea");
    textArea.innerHTML = newResponse2;



    results.innerHTML += `
    <div class = "resultResponse">
    <img src = "icon.png" />
    <p id = "typeEffect"></p>
    
    </div>
    `;

    let newResponseData = newResponse2.split(" ");
    for(let j = 0; j<newResponseData.length; j++){
        timeout(j,newResponseData[j]+" ");
    }
});

}

const timeout = (index,nextWord)=>{
    setTimeout(function(){
       document.getElementById("typeEffect").innerHTML += nextWord;
    }, 75*index);
};



function newChat(){
    startContent.style.display="block";
chatContent.style.display="none ";
}

function jsonEscape(str){
    return str.replace(new RegExp("\r?\n\n","g"),"<br>")
            .replace(new RegExp("\r?\n","g"),"<br>")
}
