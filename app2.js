var model = {
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    completedDay: [],
    taskTitle: "Task Name",
    currDay: {},
    
    init: function() {
        if (typeof(window.localStorage) !== "undefined") {
            // Populate completedDay array
            var dataObj = window.localStorage.getItem('completedDay');
            var month = window.localStorage.getItem('month');
            
            if (dataObj && month && month === new Date().getMonth().toString()) {
                this.completedDay = JSON.parse(dataObj).data;
            } else {
                for (var i = 0; i < this.daysInMonth[new Date().getMonth()]; i++) {
                    this.completedDay.push(false);
                }
            }
            
            // Populate taskTitle
            var title = window.localStorage.getItem('taskTitle');
            
            if (title) {
                this.taskTitle = title;
            }
        } else {
            for (var i = 0; i < this.daysInMonth[new Date().getMonth()]; i++) {
                this.completedDay.push(false);
            }
        }
        
        initDate(this.currDay);
        
        return this.currDay;
        
        function initDate(currentDay) {
            var date = new Date();
            currentDay.date = date.getDate() - 1;
            currentDay.month = date.getMonth();
            currentDay.year = date.getFullYear(); 
            currentDay.firstWeekday = new Date(currentDay.year, currentDay.month, 1).getDay();
            
            // Store current month
            window.localStorage.setItem('month', currentDay.month);
        }
    },
    
    markDay: function() {
        this.completedDay[this.currDay.date] = !this.completedDay[this.currDay.date];
        
        if (typeof(window.localStorage) !== "undefined") {
            window.localStorage.setItem('completedDay', JSON.stringify(
                {
                    'data': this.completedDay
                }));
        }
        
        return this.completedDay[this.currDay.date];
    },
    
    changeTitle: function(title) {
        this.taskTitle = title;
        
        if (typeof(window.localStorage) !== "undefined") {
            window.localStorage.setItem('taskTitle', this.taskTitle);   
        }
    },
    
    getPercentageComplete: function() {
        // Return String '<completed>/<total>'
        var pastDays = this.completedDay.slice(0,this.currDay.date + 1);
        var numCompleted = pastDays.filter(function(currVal) {
            return currVal;
        }).length;
        
        return numCompleted.toString() + '/' + pastDays.length.toString();
    },
    
    getDaysInMonth: function(month) {
        if (month < 0) {
            month = this.daysInMonth.length - month;
        }
        
        return this.daysInMonth[leapMonth(month)];
        
        // determine if current month is a leap month
        function leapMonth(month) {
            if (month === 1) {
                if ((this.currDay.year % 4 === 0 && this.currDay.year % 100 !== 0) || this.currDay.year % 400 === 0) {
                    return 29;
                }
            }
            
            return month;
        }
    }
};

var view = {
    months: ['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    currDayIndex: '0',
    calCells: [],
    showExtraRow: false,
    
    toggleDay: function(mark) {
        var elementId = this.currDayIndex + 1;
        var dayButton = document.getElementById(elementId).getElementsByTagName('button')[0];
        
        if (mark) {
            var item = document.createElement('i');
            item.className = 'fa fa-times fa-5x';
            dayButton.appendChild(item);
            dayButton.classList = '';
        } else {
            dayButton.removeChild(dayButton.firstElementChild);
            dayButton.className = 'empty';
        }
        
        document.getElementById("stat").innerHTML = 
            controller.getPercentageComplete() + " Days Completed This Month";
    },
    
    init: function(currDate) {
        var completedDay = controller.getCompletedDay();
        this.currDayIndex = currDate.date + currDate.firstWeekday;
        this.calCells.push({
            text: this.months[currDate.month] + ' 1',
            style: 'normal',
            mark: completedDay[0]
        });

        // Fill current month days
        for (var i = 2; i <= controller.getNumDays(currDate.month); i++) {
            this.calCells.push({
                text: i.toString(),
                style: 'normal',
                mark: completedDay[i-1]
            });
        }
        
        // Fill previous month numbers
        var numDaysInPrevMonth = controller.getNumDays(currDate.month - 1);
        for (var j = 0; j < currDate.firstWeekday; j++) {
            this.calCells.unshift({
                text: (numDaysInPrevMonth - j).toString(),
                style: 'fade',
                mark: false
            });
        }
        
        var k = 1;
        var calLength = this.calCells.length;
        // Fill next month numbers
        if (35 < calLength) {
            this.showExtraRow = true;
            for (k = 1; k <= 42 - calLength; k++) {
                this.calCells.push({
                    text: k.toString(),
                    style: 'fade',
                    mark: false
                });
            }
        } else {
            for (k = 1; k <= 35 - calLength; k++) {
                this.calCells.push({
                    text: k.toString(),
                    style: 'fade',
                    mark: false
                });
            }
        }
        
        this.calCells[this.currDayIndex].style = 'bold';
        
        // Init calendar cells
        for (var cell = 1; cell <= this.calCells.length; cell++) {
            var div = document.getElementById(cell.toString());
            this.calCells[cell - 1].textElem = div.getElementsByTagName('p')[0];
            this.calCells[cell - 1].markElem = div.getElementsByTagName('button')[0];
            
            if (cell === (this.currDayIndex + 1)) {
                this.calCells[cell - 1].markElem.addEventListener('click', function() {
                    controller.markDay();
                });
            }
        }
        
        // Show an extra row if needed to complete the calendar
        if (this.showExtraRow) {
            document.getElementsByClassName('extra-row')[0].style.display = 'table-row';
        } else {
            document.getElementsByClassName('extra-row')[0].style.display = 'none';
        }

        // Add callback for title edit button
        document.getElementById("edit-title").addEventListener('click', function() {
           controller.editTitle(); 
        });
    },
    
    render: function() {
        this.calCells.forEach(function(currVal) {
            currVal.textElem.innerHTML = currVal.text;
            
            switch(currVal.style) {
                case 'bold':
                    currVal.textElem.style.textDecoration = 'underline';
                    currVal.textElem.style.fontWeight = 'bold';
                    break;
                case 'fade':
                    currVal.textElem.style.color = '#A0A0A0';
                    break;
                case 'normal':
                    // Do nothing
                    break;
                default:
                    // Do nothing
            }
            
            if (currVal.mark) {
                var item = document.createElement('i');
                item.className = 'fa fa-times fa-5x';
                currVal.markElem.appendChild(item);
                currVal.markElem.classList = '';
            }
        });
        
        // Render title and percentage
        document.getElementById("task-title").innerHTML = 
            controller.getTaskTitle();
        document.getElementById("stat").innerHTML = 
            controller.getPercentageComplete() + " Days Completed This Month";
    },
    
    editTitle: function(titleName) {
        document.getElementById("task-title").innerHTML = titleName;
    }
};

var controller = {
    getNumDays: function(month) {
        return model.getDaysInMonth(month);
    },
    
    getCompletedDay: function() {
        return model.completedDay;
    },
    
    getTaskTitle: function() {
        return model.taskTitle;
    },
    
    getPercentageComplete: function() {
        return model.getPercentageComplete();
    },
    
    editTitle: function() {
        var maxLength = 30;
        var newTitle = prompt("Please enter a task name (max 30 char).", "Run each day");
        
        while (newTitle == null || maxLength < newTitle.length) {
            if (newTitle == null)
                return;
                
            newTitle = prompt("Please enter a task name (max 30 char).", "Run each day");
        }
        
        model.changeTitle(newTitle);
        view.editTitle(newTitle);
    },
    
    init: function() {
        var day = model.init();
        view.init(day);
        view.render();
    },
    
    markDay: function() {
        view.toggleDay(model.markDay());
    }
};

window.onload = controller.init;