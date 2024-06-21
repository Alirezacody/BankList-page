"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "Alireza Nabikhani",
  movements: [200, 400, -500, 1000, -350, 2000, -1400],
  interestRate: 1.8,
  pin: 1234,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
// const containerDate = document.querySelector('.movements__date');

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const balanceDD = document.querySelector(".balance");

const displayMovements = (accs, sort = false) => {
  containerMovements.innerHTML = "";

  console.log(accs);

  const movs = sort ? accs.slice().sort((a, b) => a - b) : accs;
  console.log(movs);

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date();
    const mounth = date.getMonth() + 1;
    const daye = date.getDate();
    const yers = date.getFullYear();

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date"> ${mounth < 10 ? "0" : ""}${mounth} /${
      daye < 10 ? "0" : ""
    }${daye} / ${yers} </div>
          <div class="movements__value"> ${mov} € </div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// displayMovements(accounts);

const createUserName = (accs) => {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((mov) => mov[0])
      .join("");
    // console.log(acc.userName);
  });
};

createUserName(accounts);

const calcBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcBalance(account1);

const displaySumery = (mov) => {
  const interest = mov.interestRate;
  const SUMIN = mov.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = `${SUMIN} €`;

  const SUMOUT = Math.abs(
    mov.movements.filter((mov) => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );

  labelSumOut.textContent = `${SUMOUT} €`;

  const SumInterest = mov.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => (acc + cur) * interest);
  labelSumInterest.textContent = `${Math.trunc(SumInterest)} €`;
};

const updateUI = (accs) => {
  displayMovements(accs.movements);
  displaySumery(accs);
  calcBalance(accs);
};

// displaySumery(account1);

const d = new Date();
labelDate.textContent = `${
  d.getMonth() + 1
} / ${d.getDate()} / ${d.getFullYear()}`;

let currentAccount;
let currentPassword;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
  } else {
    alert("account is not defined ! 🚫");
    containerApp.style.opacity = 0;
  }

  inputLoginPin.value = inputLoginUsername.value = "";
  inputLoginPin.blur();

  updateUI(currentAccount);
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    let index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    if (index === -1) {
      index = accounts.length - 1;
    }

    // console.log("Index found:", index);
    // console.log("Current account:", currentAccount);

    if (index !== -1) {
      accounts.splice(index, 1);
      // console.log("Account deleted:", accounts);
      containerApp.style.opacity = 0;
    }

    updateUI(currentAccount);
    labelWelcome.textContent = `Log in to get started`;
  }

  inputClosePin.value = inputCloseUsername.value = "";
  inputClosePin.blur();
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && amount > currentAccount.balance * 0.1) {
    currentAccount.movements.push(amount);
  }

  inputLoanAmount.value = "";

  updateUI(currentAccount);
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  // console.log(receiverAcc);
  // console.log(amount);
  if (
    amount > 0 &&
    amount + 200 < currentAccount.balance &&
    receiverAcc &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = "";
});

let sort = true;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  displayMovements(currentAccount.movements, sort);
  sort = !sort;
});


const a = prompt('input your num a:');
const b = prompt('input your num b:');
const c = prompt('input your num c:');

const calcDelta = function(a , b ,c){
  const DELTA = (b**2) - (4*a*c);
  console.log(DELTA);
  console.log(a , b ,c);
  if(DELTA > 0 ){
    let answer1 = (-(b) + Math.sqrt(DELTA)) / (2*a);
    let answer2 = (-(b) - Math.sqrt(DELTA))  /(2*a);
    console.log(answer1 , answer2);
  }else if(DELTA === 0){
    let answer3 = -b / (2*a)
    console.log(answer3);
  }else{
    alert('your num is not answer🚫');
  }
};

calcDelta(a , b , c);