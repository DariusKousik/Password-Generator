const passHolder=document.querySelector('[data-input-password]');
const passLenDsp=document.querySelector('[data-password-value-display]');
const slider=document.querySelector('[data-slider]');
const hasUpper=document.querySelector('#uppercase');
const hasLower=document.querySelector('#lowercase');
const hasNum=document.querySelector('#numbers');
const hasSymb=document.querySelector('#symbols');
const genBtn=document.querySelector('[data-generate-btn]');
const cpybtn=document.querySelector('[data-copy-btn]');
const cpycon=document.querySelector('[data-copy-container]');
const strcolor=document.querySelector('[data-strength-color]');

const upperSet="ABCDEFGHIJKLMNOPQUSTUVWXYZ";
const lowerset="abcdefghijklmnopqrstuvwxyz";
const numset="0123456789";
const symbset='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


slider.value=8;
passLenDsp.innerText=slider.value;
changeValue();
setIndicator("#ccc")
let password="";
let actLen=slider.value;
passHolder.value=password;
hasUpper.checked=true;

slider.addEventListener('input',changeValue);

function changeValue() {
    let len=slider.value;
    passLenDsp.innerText=slider.value;
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ( (len- min)*100/(max - min)) + "% 100%";
}

function generateRandom(dataset){
    let len=dataset.length;
    let ranInd=Math.floor(Math.random()*len);

    return dataset[ranInd];
}

function shufflePassword(arr) {
    //Fisher Yates method
    let len=arr.length;
    for (let i=len-1;i>=0;i--){
        let j=Math.floor(Math.random()*(i+1));
        let temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    let str="";
    for (let ch of arr){
        str+=ch;
    }
    return str;
}

function generatePassword() {
    let chcnt=0;
    if (hasUpper.checked) chcnt++;
    if (hasLower.checked) chcnt++;
    if (hasNum.checked) chcnt++;
    if (hasSymb.checked) chcnt++;
    if (chcnt>actLen){
        actLen=chcnt;
        slider.value=chcnt;
        changeValue();
    }

    if (hasUpper.checked) {
        password+=generateRandom(upperSet);
    }

    if (hasLower.checked) {
        password+=generateRandom(lowerset);
    }

    if (hasNum.checked){
        password+=generateRandom(numset);
    }

    if (hasSymb.checked){
        password+=generateRandom(symbset);
    }

    let len=password.length;
    if (len<actLen){
        generatePassword();
    }

    password=shufflePassword(Array.from(password));
    password=truncateString(password,actLen);
    passHolder.value=password;
}
function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num);
    } else {
      return str;
    }
}

genBtn.addEventListener('click',() =>{
    actLen=slider.value;
    password="";
    generatePassword();
    calcStrength();
});

cpybtn.addEventListener('click',copyText);

async function copyText() {
    try {
        await navigator.clipboard.writeText(passHolder.value);
        cpycon.innerText="Copied";
    }
    catch(err) {
        cpycon.innerText="Failed";
    }

    cpycon.classList.add('active');

    setTimeout(()=> {
        cpycon.classList.remove('active');
    },3000);
}


function calcStrength() {
    let isuc=false;
    let islc=false;
    let isnum=false;
    let issymb=false;
    if (hasUpper.checked) isuc=true;
    if (hasLower.checked) islc=true;
    if (hasNum.checked) isnum=true;
    if (hasSymb.checked) issymb=true;

    let passlen1=password.length;
    if (isuc && islc && (isnum || issymb) && (passlen1>=8)){
        setIndicator("#f00");
    }
    else if ((islc || isuc) && (isnum || issymb) && (passlen1>=6)){
        setIndicator("#ff0");
    }

    else {
        setIndicator("#0f0");
    }
}

function setIndicator(color){
    strcolor.style.backgroundColor= color;
    strcolor.style.boxShadow=`0px 0px 12px 1px ${color}`;
}