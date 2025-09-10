const inputslider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const paswwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[dataindicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
//starting's password 
//starting's password length 10
//starting's uppercase checkbox is tick
//strting ma indicator grey
let password = "";
let passwordLength = 10;
let checkCountor = 0;
handleslider();
//str strength color to grey
setindicator("#ccc");

//set passwordLength
//password is set according to slider
//paswordlength ko ui pa reflect krata hai
function handleslider() {
  inputslider.value = passwordLength;
  //starting length is 10
  lengthDisplay.innerText = passwordLength;
  // nothing to do more
  const min = inputslider.min;
  const max = inputslider.max;

  inputslider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "%100%";
}

//color set
//shadow set

function setindicator(color) {
  indicator.style.backgroundColor = color;
  //shadow 
  indicator.style.boxShadow = `0px 0px 12px 1px ${color} `;
}



function getRandomInteger(min, max) {
  //now answer o to max -min 
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomInteger() {
  return getRandomInteger(0, 9);
}
function generateLowerCase() {
  //a assci value 97 and z have ascii value 123
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  //A assci value 65 and z have ascii value 91
  return String.fromCharCode(getRandomInteger(65, 91));
}


function generateSymbols() {
  //string len find in order to find max
  const randNum = getRandomInteger(0, symbols.length);

  return symbols[randNum];
}

//to calulate stength of password on basis of some rules

//indicator ma color set krdeta hai
function calculateStrength() {
  let hasupper = false;
  let haslower = false;
  let hasNum = false;
  let hasSymbol = false;

  if (upperCaseCheck.checked) {
    hasupper = true;
  }
  if (lowerCaseCheck.checked) {
    haslower = true;
  }
  if (numberCheck.checked) {
    hasNum = true;
  }
  if (symbolCheck.checked) {
    hasSymbol = true;
  }

  if (hasupper && haslower && (hasNum || hasSymbol) && passwordLength >= 8) {
    setindicator("#0f0");
  } else if (
    (haslower || hasupper) &&
    (hasNum || hasSymbol) &&
    passwordLength >= 6
  ) {
    setindicator("#ff0");
  } else {
    setindicator("#f00");
  }
}

//clipboard api
//async function
//write text method which retun promise in clipboard
async function copyContent() {
  //promise resolve or reject both can happen
  //copy msg invisible after sometime
  try {
    await navigator.clipboard.writeText(paswwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }
  //to make copy's span visible

  copyMsg.classList.add("active");

  //copy text dissapre 

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

//to add event listener
inputslider.addEventListener("input", (e) => {
  //pasword length updated
  passwordLength = e.target.value;

  handleslider();
});

//copy btn add event listener
//input value can be copy
copyBtn.addEventListener("click", () => {
  if (paswwordDisplay.value) {
    copyContent();
  }
});

function handleCheckBoxChange() {
  checkCountor = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCountor++;
    }
  });

  //special condition of password length< no of checkbocx count
  if (passwordLength < checkCountor) {
    passwordLength = checkCountor;
    handleslider();
  }
}
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

//to genrate a shuffle paswword
function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
//generate password
//then no password is generated

generateBtn.addEventListener("click", () => {
  //no password will be generated if no checkbox is checked 
  if (checkCountor == 0) {
    return;
  }

  if (passwordLength < checkCountor) {
    passwordLength = checkCountor;
    handleslider();
  }

  // console.log("stating the journey");

  //lets start to journey to find new password

  //remove old password
  password = "";
  //check which things are to be included
  //lets put the stuff mentioned by checkbox
  //   if (upperCaseCheck.checked) {
  //     password += generateUpperCase();
  //   }
  //   if (lowerCaseCheck.checked) {
  //     password += generateLowerCase();
  //   }
  //   if (numberCheck.checked) {
  //     password += generateRandomInteger();
  //   }
  //   if (symbolCheck.checked) {
  //     password += generateSymbols();
  //   }



  let funcArr = [];
  if (upperCaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowerCaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numberCheck.checked) {
    funcArr.push(generateRandomInteger);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbols);
  }
  // check if all things are there or not

  //compulsory addition

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  // console.log("Compulsory addition done");

  //remaining addition

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length);

    password += funcArr[randIndex]();
  }
  // console.log("Remaining addition Done");

  //shuffle has to be done
  //pasword in array form
  password = shufflePassword(Array.from(password));
  // console.log("Shuffling done");
  paswwordDisplay.value = password;
  // console.log("Ui addition done");
  // check paswword strength 
  calculateStrength();
});