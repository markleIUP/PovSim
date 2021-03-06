//DOCUMENT INITIALIZE
let funds = '';
let vouchers = 25;
var day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let time = '';
let amtSpent = 0;
let amtEarned = 0;
let amtOwed = 0;
let weekNumber = 0;
let dayNext = 0;
let dockPay = 0;
let dockedTotal = 0;
let evicted = 0;
let endGameWeek = 0;

$(document).ready( function () {
  $('#statusBar').html("Cash: $<span id='funds'></span> || \
  Vouchers: <span id='vouchers'></span> || Day: <span id='day'></span> \
   || Time: <span id='time'>6</span> ") //|| Week: <span id='weekNumber'></span>: <span id='end'></span>
  $('#funds').html(funds);
  $('#vouchers').html(vouchers);
  $('#day').html(day[0]);
  $('#time').html(time);
  //$('#weekNumber').html(weekNumber + 1);
  $('#textPanel').load('script.txt #iupStartUp');
  $('#contextPanel').html("<b> Starting Money:</b> $\
  <form>\
  <input type='number' id='startingWeeklyPay' min='1' value='142'>\
  </form>\
  <br> <b> Paycheck Amounts:</b> $\
  <form>\
  <input type='number' id='initializeWeeklyPayAmount' min='1' value='142'>\
  </form>\
  <br> <b> TANF/Child Support check amounts: </b> $\
  <form>\
  <input type='number' id='initializeSupPayAmount' min='1' value='768'>\
  </form>\
  <br><b> Amount of Pay to Dock Late Workers (i.e., pay for each day):</b>\
  <form>\
  <input type='number' id='customDockAmt' min='1' value='28.40'>\
  </form>\
  <br><b> Game Length (in weeks):</b>\
  <form>\
  <input type='number' id='gameLength' min='1' value='4'>\
  </form>\
  <br><b> Game Speed (1000 = 1 second):</b>\
  <form>\
  <input type='number' id='customGameSpeed' min='1' value='3750'>\
  </form>")
  $('#menuPanel').html("<button onclick = 'rich(); home();'>Rich Version</button>\
  <button onclick = 'poor(); home();'>Poor Version</button>\
  <button onclick = 'custom(); home();'> Use Custom Settings</button>");
})

//VERSION
let version = '';
let weeklyPay = '';
let supPay = '';
let supType = '';
let dailyPay = '';
let paycheckValue = '';

function poor() {
  version = 'poor';
  gameSpeed = 3750;
  weeklyPay = 142;
  paycheckValue = weeklyPay;
  dailyPay = 28.40;
  supPay = 768;
  supType = 'TANF';
  funds = 142;
  count = 6;
  countPM = 0;
  clockVar = setInterval(displayTime, gameSpeed);
  endGameWeek = 4;
  $('#funds').html(funds);
  displayTime();
}

function rich() {
  version = 'rich';
  gameSpeed = 3750;
  weeklyPay = 568;
  paycheckValue = weeklyPay;
  dailyPay = 113.60;
  supPay = 926;
  supType = 'child support';
  funds = 568;
  count = 6;
  countPM = 0;
  clockVar = setInterval(displayTime, gameSpeed);
  endGameWeek = 4;
  $('#funds').html(funds);
  displayTime();
}

function custom() {
  weeklyPay = $('#initializeWeeklyPayAmount').val();
  gameSpeed = $('#customGameSpeed').val();
  paycheckValue = weeklyPay;
  dailyPay = (weeklyPay / 5);
  version = 'poor';
  supPay = $('#initializeSupPayAmount').val();
  supType = 'TANF';
  funds = $('#startingWeeklyPay').val();
  count = 6;
  countPM = 0;
  clockVar = setInterval(displayTime, gameSpeed);
  endGameWeek = $('#endGame').val();
  $('#funds').html(funds);
  displayTime();
}

//RESOURCE MANAGEMENT
function voucherLose() {
  vouchers--;
  $('#vouchers').html(vouchers);
}

function voucherGain() {
  let vouchersBought = $('#voucherAmount').val();
  if (vouchersBought <= funds) {
    vouchers = vouchers + parseInt(vouchersBought);
    funds = funds - parseInt(vouchersBought);
    amtSpent = amtSpent + parseInt(vouchersBought);
    $('#funds').html(funds);
    $('#vouchers').html(vouchers);
  } else if (vouchersBought > funds) {
    $('#contextPanel').html("You don't have enough money to do that!");
    $('#menuPanel').html("<button onclick = 'toQuickCash();'>Nevermind</button>");
  }
}

//BEGIN GAME AND TRAVEL FUNCTION
let loc = '';
//SHOULD ADD A CANCEL BUTTON AT SOME POINT
function travel() {
  $('#contextPanel').html("Where would you like to travel to?");
  $('#menuPanel').html("<button id = 'home' onclick = 'home(); voucherLose();'>Home</button>\
  <button id = 'bank' onclick ='toBank();'>To the bank</button>\
  <button id = 'quick' onclick = 'toQuickCash();'>To the Quick Cash</button><br>\
  <button id = 'work' onclick = 'toEmploymentOffice();'>To the employment office</button>\
  <button id = 'util' onclick = 'toUtilities();'>To the utilities company</button>\
  <button id = 'land' onclick = 'toLandlord();'>To your landlord</button>\
  <button id = 'grocer' onclick = 'toGrocer();'> To the grocery store</button>");
  if (loc == 'atHome') {
  $('#home').remove();
  } else if (loc == 'atBank') {
  $('#bank').remove();
  } else if (loc == 'atQuick') {
  $('#quick').remove();
  } else if (loc == 'atWork') {
  $('#work').remove();
  } else if (loc == 'atLand') {
  $('#land').remove();
  } else if (loc == 'atUtil') {
  $('#util').remove();
  } else if (loc == 'atGroc') {
  $('#grocer').remove();
  }
}

function home() {
  loc = 'atHome';
  //$('#end').html(endGameWeek);
  if (evicted == 1) {
  $('#textPanel').load('script.txt #evicted');
  $('#menuPanel').html("<button onclick='travel();'>Go somewhere</button>\
  <button onclick= 'bed();'>Sleep outside on your back porch</button>");
  } else {
    if (kids == 1) {
      $('#textPanel').load('script.txt #homeKids');
    } else if (kids == 0) {
      $('#textPanel').load('script.txt #homeNoKids');
    }
    $('#contextPanel').load('script.txt #homeContext');
    $('#menuPanel').html("<button onclick = 'travel();'>Go somewhere</button>\
    <button onclick= 'bed();'>Go to bed (Skip to tomorrow)</button>");
  }
}
//QUICK CASH
function toQuickCash() {
  loc = 'atQuick';
  voucherLose();
  if (countPM >= 9 && (dayNext != 4 || dayNext != 5)) {
  $('#textPanel').load('script.txt #quickClosed');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick = 'travel();'>Travel somewhere else</button>");
} else {
    $('#textPanel').load('script.txt #quickCashArrive');
    $('#contextPanel').html('');
    $('#menuPanel').html("<button onclick = 'buyVouchers(1)'>Buy Travel Vouchers</button>\
    <button onclick = 'quickCashPay()'>Cash Paycheck</button>\
    <button id='payAdvancebtn' onclick = 'quickPayAdvance()'>Get a pay advance</button>\
    <button onclick = 'pawn()'>Pawn your belongings</button>\
    <button onclick = 'travel();'>Travel somewhere else</button>");
    if (payAdvance == 1) {
      $('#payAdvancebtn').remove();
      $('#menuPanel').append("<button onclick='payQuickBack();'>Pay your balance</button>")
    }
  }
}

function buyVouchers(cost) {
  $('#textPanel').load('script.txt #quickVoucherBuy');
  $('#contextPanel').html("How many would you like to buy?<br>\
  <form>\
  <input type = 'number' id='voucherAmount' min='0' value='1'>\
  </form><br>\
  This will cost: $<span id='vCost'>1</span>")
  $('#voucherAmount').on('change', function (event, previousText) {
        $('#vCost').html($(this).val())
    });
  $('#menuPanel').html("<button onclick=voucherGain()>Buy</button>\
  <button onclick = 'toQuickCash()'>Nevermind</button>");
}

function quickCashPay() {
  $('#textPanel').load("script.txt #quickPay");
  $('#contextPanel').html("<b>Warning! Cashing your paycheck here instead of at the \
  bank will cost 10% of your weekly pay.</b>\
  ");
  $('#menuPanel').html("<button onclick='cashPayQuick()'>Cash Pay Check</button>\
  <button onclick = 'toQuickCash()'>Nevermind</button>");
}

function cashPayQuick() {
  let fee = (paycheckValue * 0.1).toFixed(2);
  let finalPay = (paycheckValue - fee).toFixed(2);

  if (paycheckAmount < 1) {
  $('#textPanel').load('script.txt #noPaycheck');
  $('#contextPanel').html("You have <b>0</b> paychecks to cash.")
  } else if (paycheckAmount >= 1) {
  amtEarned = amtEarned + parseInt(finalPay);
  amtOwed = amtOwed + parseInt(paycheckValue);
  paycheckAmount--;
  $('#textPanel').load('script.txt #bankPaycheck');
  $('#contextPanel').html("You gained $<span id='cashAmt'></span> and were charged $<span id='feeAmt'></span>.")
  $('#cashAmt').html(finalPay);
  $('#feeAmt').html(fee);
  funds = funds + parseInt(finalPay);
  $('#funds').html(funds);
  }
}

let payAdvance = 0;
let advanceInterest = '';
let oweQuickCash = 0;

function quickPayAdvance() {
  advanceInterest = (paycheckValue * 0.3).toFixed(2);
  $('#textPanel').load('script.txt #payAdvance');
  $('#contextPanel').html("You will owe $<span id='payAmt'></span> plus 30% interest ($<span id='interest'></span>) next week \
  if you choose to take a pay advance.")
  $('#menuPanel').html("<button onclick='payAdvanceConfirm()'>Take a pay advance</button>\
  <button onclick='toQuickCash()'>Nevermind</button>");
  $('#payAmt').html(paycheckValue);
  $('#interest').html(advanceInterest);
}

function payAdvanceConfirm() {
  payAdvance = 1;
  oweQuickCash = paycheckValue + parseInt(advanceInterest);
  amtEarned = amtEarned + parseInt(paycheckValue);
  amtOwed = amtOwed + parseInt(oweQuickCash);
  $('#contextPanel').html("You owe Quick Cash $<span id='totalOwedQuick'></span> by next Friday.\
  <br> You have gained $<span id='advanceAmount'></span>.")
  $('#menuPanel').html("<button onclick = 'buyVouchers(1)'>Buy Travel Vouchers</button>\
  <button onclick = 'quickCashPay()'>Cash Paycheck</button>\
  <button onclick = 'pawn()'>Pawn your belongings</button>\
  <button onclick = 'travel();'>Travel somewhere else</button>\
  <button onclick = 'payQuickBack()'>Pay your balance</button>");
  funds = funds + parseInt(paycheckValue);
  $('#funds').html(funds);
  $('#totalOwedQuick').html(oweQuickCash);
  $('#advanceAmount').html(paycheckValue);
}

function payQuickBack() {
  $('#textPanel').load('script.txt #payQuickBack');
  $('#contextPanel').html("You owe $<span id='amt'></span>. How much would you like to pay back?\
  <br><form>\
  $<input type='number' id='quickPayAmt' min='1' value ='1'>\
  </form>");
  $('#menuPanel').html("<button onclick = quickPayConfirm();>Pay</button>\
  <button onclick = 'toQuickCash();'>Nevermind</button>");
  $('#amt').html(oweQuickCash);
}

function quickPayConfirm() {
  let payAmt = $('#quickPayAmt').val();
  if (payAmt > funds) {
    $('#contextPanel').html("You don't have that much money.");
    $('#menuPanel').html("<button onclick = 'payQuickBack();'>Pay a different amount</button>");
  } else if (payAmt >= oweQuickCash) {
    payAmt = oweQuickCash;
    funds = funds - payAmt;
    payAdvance = 0;
    oweQuickCash = 0;
    amtSpent = amtSpent + payAmt;
    $('#contextPanel').html("You have paid off your debt!");
    $('#menuPanel').html("<button onclick = 'buyVouchers(1)'>Buy Travel Vouchers</button>\
    <button onclick = 'quickCashPay()'>Cash Paycheck</button>\
    <button id='payAdvancebtn' onclick = 'quickPayAdvance()'>Get a pay advance</button>\
    <button onclick = 'pawn()'>Pawn your belongings</button>\
    <button onclick = 'travel();'>Travel somewhere else</button>")
    $('#funds').html(funds);
  } else if (payAmt < oweQuickCash) {
    funds = funds - payAmt;
    oweQuickCash = oweQuickCash - payAmt;
    amtSpent = amtSpent + payAmt;
    $('#contextPanel').html("You paid $<span id='amtPaid'></span> and still owe $<span id='stillOwe'></span>.")
    $('#menuPanel').html("<button onclick = 'buyVouchers(1)'>Buy Travel Vouchers</button>\
    <button onclick = 'quickCashPay()'>Cash Paycheck</button>\
    <button onclick = 'pawn()'>Pawn your belongings</button>\
    <button onclick = 'travel();'>Travel somewhere else</button>\
    <button onclick = 'payQuickBack()'>Pay your balance</button>");
    $('#funds').html(funds);
    $('#amtPaid').html(payAmt);
    $('#stillOwe').html(oweQuickCash);
  }
}

let appliancesHave = 1;
let jewelsHave = 1;
function pawn() {
  $('#textPanel').load('script.txt #pawn');
  $('#contextPanel').html("You have <span id ='stuffToPawn'></span>\
   to sell.")
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Nevermind</button>");
  if (appliancesHave == 1 && jewelsHave == 1) {
    $('#stuffToPawn').html("an old toaster and your trusty coffee maker,\
      as well as some jewelry your mother used to wear");
    $('#menuPanel').append("<button onclick = 'pawnAll();'>Offer everything</button>\
    <button onclick = 'pawnJewels();'>Offer the jewelry</button>\
    <button onclick = 'pawnAppliances();'>Offer the appliances</button>");
  } else if (appliancesHave == 0 && jewelsHave == 1) {
    $('#stuffToPawn').html("some jewelry your mother used to wear");
    $('#menuPanel').append("<button onclick = 'pawnJewels();'>Offer the jewelry</button>");
  } else if (appliancesHave == 1 && jewelsHave == 0) {
    $('#stuffToPawn').html("an old toaster and your trusty coffee maker");
    $('#menuPanel').append("<button onclick = 'pawnAppliances();'>Offer the appliances</button>");
  } else {
    $('#stuffToPawn').html("nothing else");
  }
}

function pawnAll() {
  $('#textPanel').load('script.txt #pawnAll');
  $('#contextPanel').html("He offers $120 for everything.")
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Nevermind</button>\
  <button onclick = 'confirmPawnAll();'>Accept his offer</button>");
}

function pawnJewels() {
  $('#textPanel').load('script.txt #pawnJewels');
  $('#contextPanel').html("He offers $70 for your mother's jewelry.")
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Nevermind</button>\
  <button onclick = 'confirmPawnJewels();'>Accept his offer</button>");
}

function pawnAppliances() {
  $('#textPanel').load('script.txt #pawnApps');
  $('#contextPanel').html("He offers $50 for the toaster and coffee maker.")
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Nevermind</button>\
  <button onclick = 'confirmPawnApps();'>Accept his offer</button>");
}

function confirmPawnAll() {
  jewelsHave = 0;
  appliancesHave = 0;
  funds = funds + 120;
  amtEarned = amtEarned + 120;
  $('#textPanel').load('script.txt #confirmPawn');
  $('#contextPanel').html('You gained $120.');
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Continue shopping</button>\
  <button onclick = 'travel()'>Travel somewhere else</button>");
  $('#funds').html(funds);
}

function confirmPawnJewels() {
  jewelsHave = 0;
  funds = funds + 70;
  amtEarned = amtEarned + 70;
  $('#textPanel').load('script.txt #confirmPawn');
  $('#contextPanel').html('You gained $70.');
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Continue shopping</button>\
  <button onclick = 'travel()'>Travel somewhere else</button>");
  $('#funds').html(funds);
}

function confirmPawnApps() {
  appliancesHave = 0;
  funds = funds + 50;
  amtEarned = amtEarned + 50;
  $('#textPanel').load('script.txt #confirmPawn');
  $('#contextPanel').html('You gained $50.');
  $('#menuPanel').html("<button onclick = 'toQuickCash();'>Continue shopping</button>\
  <button onclick = 'travel()'>Travel somewhere else</button>");
  $('#funds').html(funds);
}
//BANK
let loanAttempt = 0;
let paycheckAmount = 0;

function toBank() {
  loc = 'atBank';
  voucherLose();
  if (countPM >= 5) {
  $('#textPanel').load('script.txt #bankClosed');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick = 'travel();'>Travel somewhere else</button>");
} else {
  $('#textPanel').load('script.txt #bankArrive');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick = 'cashPay()'>Cash Paycheck</button>\
  <button onclick = 'loan()'>Ask for a loan</button>")
  if (version == 'rich') {
    $('#menuPanel').append("<button id = 'supbtn' onclick = 'cashSup()'>Cash your child support check</button>\
    <button onclick = 'travel();'>Travel somewhere else</button>");
  } else if (version == 'poor') {
    $('#menuPanel').append("<button id = 'supbtn' onclick = 'cashSup()'>Cash your TANF check</button>\
    <button onclick = 'travel();'>Travel somewhere else</button>");
    }
  }
}
function loan() {
  $('#textPanel').load('script.txt #loan');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick='loanResult();'>$250</button>\
  <button onclick='loanResult();'>$500</button>\
  <button onclick='loanResult();'>$1000</button>");
}

function loanResult() {
  if (loanAttempt == 0) {
    loanAttempt++;
    $('#textPanel').load('script.txt #loanDeny');
    $('#menuPanel').html("<button onclick='toBank()'>Return to the lobby</button>");
  } else if (loanAttempt == 1) {
    loanAttempt++;
    $('#textPanel').load('script.txt #loanDeny1');
    $('#menuPanel').html("<button onclick='toBank()'>Return to the lobby</button>");
  } else if (loanAttempt ==2) {
    $('#textPanel').load('script.txt #loanDeny2');
    $('#menuPanel').html("<button onclick = 'cashPay()'>Cash Paycheck</button>\
    <button onclick = 'loan()'>Ask for a loan</button>\
    <button onclick = 'travel();'>Travel somewhere else</button>");
  }
}

function cashPay() {
  if (paycheckAmount < 1) {
    $('#textPanel').load('script.txt #noPaycheck');
    $('#contextPanel').html("You have <b>0</b> paychecks to cash.")
  } else if (paycheckAmount >= 1) {
    paycheckAmount--;
    amtEarned = amtEarned + paycheckValue;
    $('#textPanel').load('script.txt #bankPaycheck');
    $('#contextPanel').html("You gained $<span id='payAmt'></span>.")
    $('#payAmt').html(paycheckValue);
    funds = funds + paycheckValue;
    $('#funds').html(funds);
  }
}

let supAmount = 1;
function cashSup() {
  if (supAmount == 1) {
    supAmount--;
    $('#textPanel').load('script.txt #cashSupBank');
    $('#contextPanel').html('You gained $<span id="supAmt"></span>.');
    funds = funds + supPay;
    $('#funds').html(funds);
    $('#supAmt').html(supPay);
    amtEarned = amtEarned + parseInt(supPay);
  } else if (supAmount == 0) {
    $('#contextPanel').html("You don't have anymore supplemental checks! You will \
    have to wait until next month to get another one!")
    $('#supbtn').remove();
  }
}
//EMPLOYMENT OFFICE
function toEmploymentOffice() {
  loc = 'atWork';
  voucherLose();
  if (countPM >= 5) {
  $('#textPanel').load('script.txt #workClosed');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick = 'travel();'>Travel somewhere else</button>");
} else {
  $('#textPanel').load('script.txt #employmentOfficeArrive');
  $('#contextPanel').load('script.txt #ticTacToe');
  $('#menuPanel').html('');
  }
}

//UTILITIES COMPANY
let gas = 50;
let electricity = 50;
let phone = 15;

function toUtilities() {
  loc = 'atUtil';
  voucherLose();
  if (countPM >= 6) {
  $('#textPanel').load('script.txt #utilitiesClosed');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick = 'travel();'>Travel somewhere else</button>");
} else {
  $('#textPanel').load('script.txt #utilitiesArrive');
  $('#contextPanel').html("Your utilities bills are:<br>\
  <b>Gas: </b>$<span id='gasBill'></span><br>\
  <b>Electricity: </b>$<span id='electricBill'></span><br>\
  <b>Phone: </b>$<span id='phoneBill'></span><br>");
  $('#menuPanel').html("<button onclick = 'payUtilities()'>Pay your bill(s)</button>\
  <button onclick = 'travel();'>Travel somewhere else</button>");
  updateUtilities();
 }
}

function payUtilities() {
  $('#textPanel').load('script.txt #payUtilitiesText');
  $('#contextPanel').append("<br><form>\
  <input type='number' id='utiltiesAmountPaid' min='1'>\
  </form>")
  $('#menuPanel').html("<button onclick = 'confirmPayG();'>Pay Gas</button>\
  <button onclick =  'confirmPayE();'>Pay Electricity</button>\
  <button onclick =  'confirmPayP();'>Pay Phone</button>\
  <button onclick = 'travel()'> Finished. Travel somewhere else");
}

function confirmPayG() {
  let amt = $('#utiltiesAmountPaid').val();
  if (funds < amt) {
    $('#contextPanel').html("You don't have enough money to do that!");
    $('#menuPanel').html("<button onclick = 'toUtilities();'>Nevermind</button>");
  } else if (amt > gas) {
    amt = gas;
    funds = funds - amt;
    gas = gas - amt;
    amtSpent = amtSpent + parseInt(amt);
    $('#funds').html(funds);
    $('#gasBill').html(gas);
  } else {
    funds = funds - amt;
    gas = gas - amt;
    amtSpent = amtSpent + parseInt(amt);
    $('#funds').html(funds);
    $('#gasBill').html(gas);
  }
}

function confirmPayE() {
  let amt = $('#utiltiesAmountPaid').val();
  if (funds < amt) {
    $('#contextPanel').html("You don't have enough money to do that!");
    $('#menuPanel').html("<button onclick = 'toUtilities();'>Nevermind</button>");
  } else if (amt > electricity) {
    amt = electricity;
    funds = funds - amt;
    electricity = electricity - amt;
    amtSpent = amtSpent + parseInt(amt);
    $('#funds').html(funds);
    $('#electricBill').html(electricity);
  } else {
    funds = funds - amt;
    electricity = electricity - amt;
    amtSpent = amtSpent + parseInt(amt);
    $('#funds').html(funds);
    $('#electricBill').html(electricity);
  }
}

function confirmPayP() {
  let amt = $('#utiltiesAmountPaid').val();
  if (funds < amt) {
    $('#contextPanel').html("You don't have enough money to do that!");
    $('#menuPanel').html("<button onclick = 'toUtilities();'>Nevermind</button>");
  } else if (amt > phone) {
    amt = phone;
    funds = funds - amt;
    phone = phone - amt;
    $('#funds').html(funds);
    $('#phoneBill').html(phone);
    amtSpent = amtSpent + parseInt(amt);
  } else {
    funds = funds - amt;
    phone = phone - amt;
    $('#funds').html(funds);
    $('#phoneBill').html(phone);
    amtSpent = amtSpent + parseInt(amt);
  }
}

function updateUtilities() {
  $('#gasBill').html(gas);
  $('#electricBill').html(electricity);
  $('#phoneBill').html(phone);
}

//LANDLORD
let rent = 225;
let rentDue = 1;
let rentDueSoon = 0;
let rentIsLate  = 0;
function toLandlord() {
  loc = 'atLand';
  voucherLose();
  if (countPM >= 6) {
  $('#textPanel').load('script.txt #landlordClosed');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button onclick = 'travel();'>Travel somewhere else</button>");
} else {
  $('#textPanel').load('script.txt #landlordArrive');
  $('#contextPanel').html("Rent Due: $<span id = 'rentDue'></span>");
  $('#menuPanel').html("<button onclick = 'payRent()'>Pay your rent</button>\
  <button onclick = 'travel();'>Travel somewhere else</button>");
  $('#rentDue').html(rent);
  }
}

function payRent() {
  if (rentDue == 1) {
    $('#textPanel').load('script.txt #payRent');
    $('#contextPanel').html("How much did you want to pay? You owe: $<span id='rentAmountDue'></span>.\
    <br><form>\
    <input type='number' id='rentAmountPaid' min='1'>\
    </form>");
    $('#menuPanel').html("<button onclick = 'payRentConfirm();'>Pay</button>\
    <button onclick = 'home(); voucherLose();'>Nevermind. Head back home.</button>");
    $('#rentAmountDue').html(rent);
  } else if (rentDue == 0) {
    $('#textPanel').load('script.txt #noRentDue');
    $('#menuPanel').html("<button onclick = 'home(); voucherLose();'>Nevermind. Head back home. </button>");
  }
}

function payRentConfirm() {
  let rentAmountConfirm = $('#rentAmountPaid').val();

  if (rentAmountConfirm == 0) {
    $('#textPanel').html("The housekeeper shakes his head and closes the door in your face.");
    $('#contextPanel').html('');
    $('#menuPanel').html("<button onclick = 'home(); voucherLose();'>Whoops! Head back home.</button>\
    <button onclick = 'payRent()'>Knock and pay a different amount.</button>");
  } else if (rentAmountConfirm > 0 && rentAmountConfirm <= rent && rentAmountConfirm < rent) {
    rent = rent - rentAmountConfirm;
    funds = funds - rentAmountConfirm;
    amtSpent = amtSpent - parseInt(rentAmountConfirm);
    if (rent == 0) {
      rentDue = 0;
    }
    $('#funds').html(funds);
    $('#textPanel').load('script.txt #payRentComplete');
    $('#contextPanel').html("You owe $<span id = 'rentAmountDue'></span>.");
    $('#menuPanel').html("<button onclick = 'home(); voucherLose();'>Go home</button>")
    $('#rentAmountDue').html(rent);
    if (rent >= 0) {
      $('#menuPanel').append("<button onclick = 'payRent()'>Pay more</button>");
    }
  } else if (rentAmountConfirm > rent) {
    rentAmountConfirm = rent;
    rent = rent - rentAmountConfirm;
    funds = funds - rentAmountConfirm;
    amtSpent = amtSpent - rentAmountConfirm;
    amtOwed = amtOwed - rentAmountConfirm;
    if (rent == 0) {
      rentDue = 0;
    }
    $('#funds').html(funds);
    $('#textPanel').load('script.txt #payRentComplete');
    $('#contextPanel').html("You now owe $<span id = 'rentAmountDue'></span>.");
    $('#menuPanel').html("<button onclick = 'home(); voucherLose();'>Go home</button>");
    $('#rentAmountDue').html(rent);
    if (rent >= 0) {
      $('#menuPanel').append("<button onclick = 'payRent()'>Pay more</button>");
    }
  } else if (rentAmountConfirm > funds) {
    $('#contextPanel').html("You don't have enough money to do that!");
    $('#menuPanel').html("<button onclick = 'payRent();'>Change the amount you want to pay</button>\
    <button onclick = 'home(); voucherLose();'>Nevermind. Go home</button>");
  }
}

//GROCERY STORE
let groceryBill = 0;
let haveGroceries = 0;
let gAmountPaid = 0;
function toGrocer() {
  loc = 'atGroc';
  voucherLose();
  $('#textPanel').load('script.txt #grocerArrive');
  $('#contextPanel').html('');
  $('#menuPanel').html("<button id='buyG' onclick='buyGroceries();'>Shop for Groceries</button>\
  <button onclick = 'travel()';>Travel somewhere else</button>");
  if (groceryBill > 0) {
    $('#menuPanel').append("<button onclick='payGroceryBill()';>Pay Grocery Bill</button>");
  }
}

function buyGroceries() {
  if (haveGroceries == 1) {
  $('#textPanel').load('script.txt #alreadyHaveGroceries');
  $('#menuPanel').remove($('#buyG'));
} else {
  haveGroceries = 1;
  groceryBill = groceryBill + 225;
  $('#textPanel').load('script.txt #buyGroceriesNow');
  $('#contextPanel').html("You owe $<span id='grocAmt'></span>. Do you want to pay now or later?");
  $('#menuPanel').html("<button onclick='payGroceryBill()';>Pay Now</button>\
  <button onclick='addToGroceryTab()';>Pay Later</button>");
  $('#grocAmt').html(groceryBill);
  }
}

  function addToGroceryTab() {
  amtOwed = amtOwed + groceryBill;
  $('#textPanel').load('script.txt #deferGroceryPay');
  $('#contextPanel').html("Your current grocery bill is $" + groceryBill + ".");
  $('#menuPanel').html("<button onclick = 'travel()';>Go somewhere else</button>\
  <button onclick = 'payGroceryBill()';>Pay your bill</button>");
}

  function payGroceryBill() {
  $('#textPanel').load('script.txt #payGroceryBillNow');
  $('#contextPanel').html("How much would you like to pay back? Your current bill is $" + groceryBill +".\
  <br><form>\
  <input type='number' id='grocPayAmount' min = 1 value = 1>\
  </form>");
  $('#menuPanel').html("<button onclick='payGroceryConfirm()';>Confirm Payment</button>\
  <button onclick='toGrocer()'>Nevermind</button>");
}


function payGroceryConfirm() {
  gAmountPaid = $('#grocPayAmount').val();
    if (gAmountPaid > funds) {
      $('#textPanel').load('script.txt #grocNotEnoughMoney');
      $('#contextPanel').html("You don't have that much money!");
      $('#menuPanel').html("<button onclick='toGrocer()';>Nevermind</button>")
    } else if (gAmountPaid > groceryBill) {
      gAmountPaid = groceryBill;
      finalGrocPayCalc();
    } else {
      finalGrocPayCalc();
    }
}

function finalGrocPayCalc() {
  amtOwed = amtOwed - gAmountPaid;
  groceryBill = groceryBill - gAmountPaid;
  funds = funds - gAmountPaid;
  $('#textPanel').load('script.txt #grocAcceptMoney');
    if (groceryBill == 0) {
      $('#contextPanel').html("You have paid everything off!");
    } else {
      $('#contextPanel').html("You still owe $" + groceryBill + ".");
    }
  $('#funds').html(funds);
  $('#menuPanel').html("<button onclick='buyGroceries();'>Shop for groceries</button>\
  <button onclick='travel();'>Go somewhere else</button>");
  if (groceryBill > 0) {
  $('#menuPanel').append("<button onclick='payGroceryBill();'>Try to pay more</button>");
  }
}

//CLOCK AND TIMER FUNCTIONS
let count = '';
let countPM = '';
let clockVar = '';
let clockPM = '';
let dayUpdate = '';
let dockStart='';

function displayTime() {
  count++;
  $("#time").html(count + " AM");
  if (count == 8) {kidsHome();}
  if (count == 8 && loc == 'atHome') {
    $('#textPanel').load('script.txt #homeNoKids');
  }
  if (count == 9 && loc !== 'atWork' && day != day[5] && day != day[6]) {
    lateWarning();
    dockStart = setInterval(increaseDockPay, gameSpeed);
  }
  if (count == 12) {
    $("#time").html(count + " PM");
    clearInterval(clockVar);
    clockPM = setInterval(displayPM, gameSpeed);
  }
}

function displayPM() {
  countPM++;
  $('#time').html(countPM + " PM");
  if (countPM == 4) {kidsHome();}
  if (countPM == 4 && loc == 'atHome') {
    $('#textPanel').load('script.txt #homeKids');
  }
  if (countPM == 5 && loc == 'atWork') {
    $('#contextPanel').load('script.txt #noOvertime');
    $('#menuPanel').html("<button onclick = 'travel();'>Punch out and go somewhere else</button>");
  }
  if (countPM == 6 && (loc == 'atBank' || loc == 'atUtil')) {
    $('#textPanel').load('script.txt #closingTime');
    $('#contextPanel').html('');
    $('#menuPanel').html("<button onclick = 'travel();'>Travel somewhere else</button>")
  }
  if (countPM == 6) {clearInterval(dockStart);}
  if (dayNext == 4 && countPM == 5) {displayPaycheck();}
  if (countPM >= 9 && loc == 'atHome') {
    $('#textPanel').load('script.txt #homeKidsInBed');
  }
  if (countPM == 11) {
    if ((loc == 'atQuick' && (dayNext == 4 || dayNext == 5)) || loc == 'atGroc') {
      vouchers = vouchers - 1;
      $('#vouchers').html(vouchers);
    }
    clearInterval(clockPM);
    endOfDay();
    }
}

function displayPaycheck() {
  $('#kidsContent').html("You have earned a paycheck!");
  $('#kids').show();
  setTimeout(function() {
     $('#kids').fadeOut();
 }, 3000);
}

function lateWarning() {
    $('#kidsContent').html("You are late for work!");
    $('#kids').show();
    setTimeout(function() {
       $('#kids').fadeOut();
   }, 3000);
}

let payHasBeenDocked = 0;
function increaseDockPay() {
  if (loc == 'atWork') {
    clearInterval(dockStart);
  }
  else {
    dockPay++;
    $('#testDock').html(dockPay); //Comment this line out late....
    if (dockPay == 8) {
      if (version == 'poor') {
      amtEarned = dailyPay - 28.40;
      dockPay = 0;
      payHasBeenDocked++;
      }
      else if (version == 'rich') {
      amtEarned = dailyPay - 113.60;
      dockPay = 0;
      payHasBeenDocked++;
      }
      else if (version == 'custom') {
      amtEarned = dailyPay - customDockAmt;
      dockPay = 0;
      payHasBeenDocked++;
      }
    }
  }
}

let kids = 1;
function kidsHome() {
if (dayNext < 5) {
  if (kids == 1) {
    $('#kidsContent').html("Your kids have left for school.");
    $('#kids').show();
    setTimeout(function() {
       $('#kids').fadeOut();
   }, 3000);
    kids = 0;
  if (kids == 1 && loc == 'atHome') {
    $('#textPanel').load('script.txt #homeNoKids');
  }
  } else if (kids == 0) {
    $('#kidsContent').html("Your kids have returned from school.")
    $('#kids').show();
    setTimeout(function() {
       $('#kids').fadeOut();
   }, 3000);
    kids = 1;
  }
}}

function bed() {
  clearInterval(clockVar);
  clearInterval(clockPM);
  endOfDay();
}

//END OF DAY POPUP
amtOwed = amtOwed + rent + gas + electricity + phone;
let gasLate = 0;
let phoneLate = 0;
let electricLate = 0;
let quickLate = 0;
let upcomingWarnings = '';
function endOfDay() {
  if (dayNext == 6) {
    dayNext = -1;
    weekNumber++;
    payHasBeenDocked = 0;
  }
  if (dayNext == 4 ){
    paycheckValue = paycheckValue - dockedTotal;
    paycheckAmount++;
  }
  if (dayNext == 3 && rent > 0) {
    rentDueSoon = 1; //Check for if the rent will be due tomorrow
  }
  if (dayNext == 4 && rent > 0) {
    rentIsLate = 1; //Start the eviction timer
  }
  if (dayNext == 4 && gas > 0) {
    gasLate = 1;
  }
  if (dayNext == 4 && phone > 0) {
    phoneLate = 1;
  }
  if (dayNext == 4 && electricity > 0) {
    electricLate = 1;
  }
  if (dayNext == 4 && oweQuickCash > 0) {
    quickLate = 1;
  }
  if (payHasBeenDocked > 0) {
    dockedTotal = (payHasBeenDocked * dailyPay).toFixed(2);
  }
    upcomingWarnings = '';
    dayNext++;
    dayUpdate = day[dayNext];
    if (amtEarned > 0) {
    amtEarned = amtEarned + dailyPay;
    }
    $('#nextDay').html("Tomorrow is: " + dayUpdate); //
    $('#amtSpent').html("You spent: $" + amtSpent);
    $('#amtEarned').html("You earned: $" + amtEarned);
    $('#amtOwed').html("You owe: $" + amtOwed);
    $('#nextDayVouchers').html("You have " + vouchers + " travel vouchers remaining");
    $('#continue').html("<button onclick = 'restart();'>Continue</button>");
    $('#warnings').html("<button onclick='showWarnings();'>Show Warnings</button>");
    $('#end').show();
  }

evictionDays = 6;
function showWarnings() {
  $('#warningsPopup').show();
  if (funds < amtOwed) {
    upcomingWarnings = upcomingWarnings + 'WARNING! You owe more money than you have!'
  }
  if (vouchers <= 5) {
    upcomingWarnings = upcomingWarnings + '<br><br>WARNING! You are low on travel vouchers! You can buy more at work or at the Quick Cash!';
  }
  if (rentDueSoon == 1) {
    upcomingWarnings = upcomingWarnings + '<br><br>Your rent is due soon!';
    rentDueSoon = 0;
  }
  if (rentIsLate == 1) {
    evictionDays = evictionDays - 1;
    if (evictionDays > 0) {
      upcomingWarnings = upcomingWarnings + '<br><br>WARNING! Your rent is late! You will be evicted if you don\'t pay soon!';
    } else if (evictionDays <= 0) {
      evicted = 1;
      upcomingWarnings = upcomingWarnings + "<br><br> YOU HAVE BEEN EVICTED FROM YOUR HOME!";
    }
  }
  if (gasLate == 1) {
    gasLate = 0;
    upcomingWarnings = upcomingWarnings + '<br><br>Your gas bill is late!';
  }
  if (phoneLate == 1) {
    phoneLate = 0;
    upcomingWarnings = upcomingWarnings + '<br><br>Your phone bill is late!';
  }
  if (electricLate == 1) {
    electricLate = 0;
    upcomingWarnings = upcomingWarnings + '<br><br>Your electricity bill is late!';
  }
  if (quickLate == 1) {
    quickLate = 0;
    upcomingWarnings = upcomingWarnings + '<br><br>Your payment to the Quick Cash is late!';
  }
  if (payHasBeenDocked > 0) {
    upcomingWarnings = upcomingWarnings + '<br><br> You were docked $<span id="amtDocked"></span> for being late to work!';
  }
  $('#warningsTotal').html(upcomingWarnings + "<br><br><button onclick = 'restart()'>Continue</button>");
  $('#amtDocked').html(dockedTotal);
  if (funds > amtOwed && vouchers > 5 && rentDueSoon == 0 && rentIsLate == 0)  {
  $('#warningsTotal').html("<br>You are managing to survive! Nothing to report at the moment. <br> \
  <button onclick = 'restart()'>Continue</button>");
  }
}

function restart() {
  if (weekNumber == endGameWeek){
    endGame(); //Check for end of game
  }
  count = 6;
  countPM = 0;
  clockVar = setInterval(displayTime, gameSpeed);
  clockPM = '';
  amtEarned = 0;
  amtSpent = 0;
  displayTime();
  home();
  $('#day').html(dayUpdate);
  $('#weekNumber').html(weekNumber + 1);
  $('#end').hide();
  $('#warningsPopup').hide();
}

function endGame() {
  $('#textPanel').html("GG!");
  $('#contextPanel').html('');
  $('#menuPanel').html('');
}


//Credit: Cory Fogliani
