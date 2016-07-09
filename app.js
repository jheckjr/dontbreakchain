var monthStart = 0;
var currDay = 0;

// If current day, put or remove an X
function markDay(day) {
  if (day === currDay + monthStart - 1) {
    // get the calling button
    var div = document.getElementById(day.toString());
    var button = div.getElementsByTagName('button')[0];

    // add an X
    if (button.childElementCount === 0) {
      var item = document.createElement('i');
      item.className = 'fa fa-times fa-5x';
      button.appendChild(item);
      button.className = '';
    } else {
      // remove x
      var item = button.firstElementChild;
      button.removeChild(item);
      button.className = 'empty';
    }
  }
}

// adds the date numbers to the calendar for the current month
function populateDates() {
  var months = ['Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
  ];
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var numDaysInCal = 35;

  currDay = new Date().getDate();
  var currMonth = new Date().getMonth();
  var currYear = new Date().getFullYear();
  var firstDay = new Date(currYear, currMonth, 1);
  monthStart = firstDay.getDay() + 1;

  var numDays = daysInMonth[currMonth];
  if (leapMonth(currYear, currMonth)) {
    numDays = 29;
  }

  // Set month and day for first day of month
  var div = document.getElementById(monthStart.toString());
  div.getElementsByTagName('p')[0].innerHTML = months[currMonth] + ' 1';
  // Set day for all other days of month
  for (var i = monthStart + 1; i < monthStart + numDays; i++) {
    div = document.getElementById(i.toString());
    div.getElementsByTagName('p')[0].innerHTML = i - monthStart + 1;
  }

  // Show the hidden row if needed to display whole month
  if (numDaysInCal < monthStart + numDays - 1) {
    document.getElementsByClassName('extra-row')[0].style.display = 'table-row';
    numDaysInCal = 42;
  } else {
    document.getElementsByClassName('extra-row')[0].style.display = 'none';
  }

  fillInEmptyLabels();
  highlightCurrDay();

  // fill out non-labeled days in calender
  function fillInEmptyLabels() {
    // start of month
    // account for overflow Jan to Dec
    if (currMonth === 0) {
      var daysInPrevMonth = daysInMonth[11];
    } else {
      var daysInPrevMonth = daysInMonth[currMonth - 1];
    }

    for (var i = 1; i < monthStart; i++) {
      var div = document.getElementById(i.toString());
      // added one accounts for added one to monthStart
      var p = div.getElementsByTagName('p')[0]
      p.innerHTML = daysInPrevMonth - monthStart + i + 1;
      p.style.color = '#A0A0A0';
    }

    // end of month
    for (var i = monthStart + numDays; i <= numDaysInCal; i++) {
      var div = document.getElementById(i.toString());
      p = div.getElementsByTagName('p')[0];
      // added one accounts for added one to monthStart
      var day = i - monthStart - numDays + 1;
   
      if (day === 1) {
        // account for overflow Dec to Jan
        if (currMonth === 11) {
          p.innerHTML = months[0] + ' ' + day.toString();
        } else {
          p.innerHTML = months[currMonth + 1] + ' ' + day.toString();
        }
      } else {
        p.innerHTML = day.toString();
      }
      p.style.color = '#A0A0A0';
    }

  }

  // determine if current month is a leap month
  function leapMonth() {
    if (currMonth === 1) {
      if ((currYear % 4 === 0 && currYear % 100 !== 0) || currYear % 400 === 0) {
        return true;
      }
    }
    return false;
  }
  
  function highlightCurrDay() {
    var div = document.getElementById((currDay + monthStart - 1).toString());
    var p = div.getElementsByTagName('p')[0];
    p.style.textDecoration = 'underline';
    p.style.fontWeight = 'bold';
    markDay(currDay + monthStart - 1);
  }
}

function editTitle() {
  var maxLength = 30;
  var newTitle = prompt("Please enter a task name (max 30 char).", "Run each day");
  
  while (newTitle == null || newTitle.length > maxLength) {
    if (newTitle == null)
      return;
      
    newTitle = prompt("Please enter a task name (max 30 char).", "Run each day");
  }
  
  document.getElementById("task-title").innerHTML = newTitle;
}

window.onload = populateDates;