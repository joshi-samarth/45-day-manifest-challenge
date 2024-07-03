const totalCircles = 45;
let tasks = getTasks();
let dayCounter = getDayCounter();
// let intervalId;
let lastCompletedDay = getLastCompletedDay(); // Track the last completed day, retrieved from localStorage
// let timeoutId; // To hold the timeout ID for the day change timer
// const changeTime = "21:46"; // Set the time for the day change in HH:MM format

// Array of motivational messages (one for each of the 45 days)
const motivationalMessages = [
    // "samarth",
    "The journey of a thousand miles begins with a single step. Today, take that step towards your goals!",
    "Every accomplishment starts with the decision to try. Keep going!",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Your only limit is your mind. Stay positive and keep pushing forward.",
    "Great things never come from comfort zones. Challenge yourself today.",
    "Perseverance is not a long race; it’s many short races one after the other.",
    "It always seems impossible until it's done. You're closer than you think.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Success doesn’t come from what you do occasionally. It comes from what you do consistently.",
    "Don’t limit your challenges. Challenge your limits.",
    "Dream big and dare to fail. Each failure brings you closer to success.",
    "The secret of getting ahead is getting started. Keep moving forward!",
    "Small progress is still progress. Celebrate each step.",
    "You are capable of amazing things. Keep believing in yourself.",
    "With hard work, there are no limits. Keep striving for your best.",
    "It’s not about having time. It’s about making time. Prioritize your goals.",
    "Stay focused and never give up. The best is yet to come.",
    "Strength doesn’t come from what you can do. It comes from overcoming the things you once thought you couldn’t.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Push yourself, because no one else is going to do it for you.",
    "The future depends on what you do today. Make it count.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Believe in the person you want to become. You are capable of more than you know.",
    "The difference between ordinary and extraordinary is that little extra.",
    "Stay positive, work hard, make it happen.",
    "Your passion is waiting for your courage to catch up.",
    "Doubt kills more dreams than failure ever will.",
    "The only way to achieve the impossible is to believe it is possible.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "You are stronger than you think. Keep pushing forward.",
    "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.",
    "The key to success is to focus on goals, not obstacles.",
    "The harder the struggle, the more glorious the triumph.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "Keep your face always toward the sunshine—and shadows will fall behind you.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The way to get started is to quit talking and begin doing.",
    "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "Go confidently in the direction of your dreams! Live the life you've imagined.",
    "You’re doing great! Every step brings you closer to your goal.",
    "Congratulations on reaching Day 45! Your hard work and dedication have paid off. Keep shining and striving for excellence!"
];


document.addEventListener("DOMContentLoaded", () => {
    storedate();
    createStreakCircles();
    updateTaskList();
    updateDayText();
    updateMotivationalMessage(); // Ensure motivational message is updated on page load
    // checkDayChangeOnLoad(); // Check if day change is needed on page load
    // startNewDayTimer();
    compareDates();
});

function storedate() {
    if (!localStorage.getItem('storedDate')) {
        const currentDate = new Date();
        const nextDate = new Date();
        nextDate.setDate(currentDate.getDate() + 1);

        // Format date to YYYY-MM-DD
        const formattedNextDate = nextDate.toISOString().split('T')[0];
        localStorage.setItem('storedDate', formattedNextDate);
    }
}

function getTasks() {
    let tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDayCounter() {
    let counter = localStorage.getItem("dayCounter");
    return counter ? parseInt(counter, 10) : 1;
}

function saveDayCounter(counter) {
    localStorage.setItem("dayCounter", counter);
}

function getLastCompletedDay() {
    let lastDay = localStorage.getItem("lastCompletedDay");
    return lastDay ? parseInt(lastDay, 10) : 0;
}

function saveLastCompletedDay(day) {
    localStorage.setItem("lastCompletedDay", day);
}

// function getLastChangeTime() {
//     let lastChange = localStorage.getItem("lastChangeTime");
//     return lastChange ? new Date(lastChange) : null;
// }

// function saveLastChangeTime(date) {
//     localStorage.setItem("lastChangeTime", date.toISOString());
// }

function addTask() {
    const taskInput = document.getElementById("new-task-input");
    if (taskInput.value.trim()) {
        tasks.push({ text: taskInput.value.trim(), completed: false });
        saveTasks(tasks);
        taskInput.value = "";
        updateTaskList();
    } else {
        alert("Please enter a valid task.");
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    updateTaskList();
}

function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    updateTaskList();

    // Check if all tasks for the current day are completed
    const completedTasks = tasks.filter(task => task.completed).length;
    if (tasks.length > 0 && completedTasks === tasks.length && dayCounter <= totalCircles) {
        lastCompletedDay = dayCounter;
        saveLastCompletedDay(lastCompletedDay); // Save the last completed day in localStorage
    } else {
        lastCompletedDay = 0; // Reset lastCompletedDay if tasks are not all completed
        saveLastCompletedDay(lastCompletedDay); // Update the last completed day in localStorage
    }

    updateMotivationalMessage();
}

function updateTaskList() {
    const taskContainer = document.getElementById("list-container");
    taskContainer.innerHTML = ""; // Clear existing list

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.setAttribute("data-index", index);
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("checked");
        }

        li.addEventListener("click", function () {
            if (deleteMode) {
                deleteTask(index);
            } else {
                toggleTaskCompletion(index);
            }
        });

        if (deleteMode) {
            li.classList.add("delete-mode");
        } else {
            li.classList.remove("delete-mode");
        }

        taskContainer.appendChild(li);
    });

    updateStreakCircles();
}

function createStreakCircles() {
    const streakContainer = document.querySelector(".todo-list");
    streakContainer.innerHTML = ""; // Clear existing circles

    for (let i = 0; i < totalCircles; i++) {
        const circle = document.createElement("div");
        circle.classList.add("streak-circle");
        streakContainer.appendChild(circle);
    }
}

var realisticlookEffect = function () {
    var count = 200;
    var defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};

var fireworksEffect = function () {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
};

// School Pride Effect
var schoolprideEffect = function () {
    var end = Date.now() + (5 * 1000);

    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0.2, y: 1 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
};
var starsEffect = function () {
    var defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
};

// Snow Effect   
var snowEffect = function () {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var skew = 1;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        var timeLeft = animationEnd - Date.now();
        var ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                // since particles fall down, skew start toward the top
                y: (Math.random() * skew) - 0.2
            },
            colors: ['#ffffff'],
            shapes: ['circle'],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4)
        });

        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    }());
};

function updateStreakCircles() {
    const circles = document.querySelectorAll(".streak-circle");

    // Reset all circles
    circles.forEach(circle => circle.classList.remove("completed"));

    // Check completion for the current day
    const completedTasks = tasks.filter(task => task.completed).length;

    // Mark the current day's circle as completed if there are tasks and all are completed
    if (tasks.length > 0 && dayCounter <= totalCircles && completedTasks === tasks.length) {
        circles[dayCounter - 1].classList.add("completed");

        // Check if this is a new completion (lastCompletedDay was not set previously)
        if (lastCompletedDay !== dayCounter) {
            if (dayCounter === totalCircles) {
                // Call all effects if it's the final day (day 45)
                realisticlookEffect();
                setTimeout(() => {
                    realisticlookEffect();
                }, 2000);
                fireworksEffect();
                schoolprideEffect();
                starsEffect();
                setTimeout(() => {
                    starsEffect();
                }, 3000);
                snowEffect();
            } else {

                realisticlookEffect();
            }
            // Update lastCompletedDay and save in localStorage
            lastCompletedDay = dayCounter;
            saveLastCompletedDay(lastCompletedDay);
        }
    }

    // Mark previous days' circles as completed if they were completed previously
    for (let i = 0; i < dayCounter - 1; i++) {
        circles[i].classList.add("completed");
    }
}



function updateMotivationalMessage() {
    const boxInfo = document.querySelector(".box-info .text h3");

    // Display the motivational message corresponding to the last completed day
    if (lastCompletedDay <= totalCircles && lastCompletedDay > 0) {
        boxInfo.textContent = motivationalMessages[lastCompletedDay - 1];

    } else {
        boxInfo.textContent = "Keep going! Every small step you take brings you closer to your goals. Stay focused, stay positive, and never give up. You've got this!"; // Set default message if no tasks completed today
        // boxInfo.textContent = "testing bro"; // Set default message if no tasks completed today
    }
}

let deleteMode = false;

function toggleDeleteMode() {
    deleteMode = !deleteMode;

    if (deleteMode) {
        document.querySelectorAll(".task-item").forEach(item => item.classList.add("delete-mode"));
    } else {
        document.querySelectorAll(".task-item").forEach(item => item.classList.remove("delete-mode"));
    }
}

let switchMode1 = document.getElementById("delete-mode");
switchMode1.addEventListener("change", (e) => {
    toggleDeleteMode();
});

function showCustomConfirm() {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('customConfirm');
        const yesButton = document.getElementById('confirmYes');
        const noButton = document.getElementById('confirmNo');

        // Show the modal
        modal.style.display = 'flex';

        // When the user clicks "Yes", resolve the promise
        yesButton.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };

        // When the user clicks "No", reject the promise
        noButton.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
    });
}

document.getElementById("reset-btn").addEventListener("click", () => {
    showCustomConfirm().then(result => {
        if (result) {
            localStorage.clear();
            location.reload();
        }
    });
});

function updateDayText() {
    const dayText = document.querySelector(".breadcrumb .active");
    dayText.textContent = `Day ${dayCounter}`;
}

// function startNewDayTimer() {
//     clearInterval(intervalId);
//     clearTimeout(timeoutId);

//     const now = new Date();
//     const targetTime = new Date();
//     const [hours, minutes] = changeTime.split(":").map(Number);
//     targetTime.setHours(hours, minutes, 0, 0);

//     if (targetTime <= now) {
//         targetTime.setDate(targetTime.getDate() + 1);
//     }

//     const timeToTarget = targetTime - now;

//     // Set a timeout to trigger the day change at the specified time
//     timeoutId = setTimeout(() => {
//         changeDay();
//         intervalId = setInterval(changeDay, 24 * 60 * 60 * 1000); // Set interval for 24 hours
//     }, timeToTarget);
// }


function changeDay() {
    const storedDate = localStorage.getItem('storedDate');
    const selectedDate = new Date(storedDate);
    const currentDate = new Date();
    const differenceInTime = currentDate - selectedDate;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24) - 1);
    // alert(differenceInDays)
    const completedTasks = tasks.filter(task => task.completed).length;

    if (tasks.length > 0 && completedTasks === tasks.length && differenceInDays == 0) {
        dayCounter++;
        if (dayCounter > totalCircles) {
            dayCounter = 1;
        }
    } else {
        dayCounter = 1; // Reset to Day 1 if tasks are not completed
    }

    tasks.forEach(task => task.completed = false);
    saveDayCounter(dayCounter);
    saveTasks(tasks);
    updateDayText();
    updateTaskList();
    updateStreakCircles();

    lastCompletedDay = 0; // Reset lastCompletedDay to ensure default message next day
    // saveLastChangeTime(new Date()); // Update last change time
    updateMotivationalMessage();
}

// function checkDayChangeOnLoad() {
//     const lastChange = getLastChangeTime();
//     if (lastChange) {
//         const now = new Date();
//         const [hours, minutes] = changeTime.split(":").map(Number);
//         const targetTime = new Date(lastChange);
//         targetTime.setHours(hours, minutes, 0, 0);

//         if (targetTime <= lastChange) {
//             targetTime.setDate(targetTime.getDate() + 1);
//         }

//         if (now >= targetTime) {
//             changeDay();
//         }
//     }
// }


// function compareDates() {
//     // Get the current date and time
//     const currentDate = new Date();
//     // Get the stored date and time from localStorage
//     const storedDateTime = localStorage.getItem('storedDateTime');

//     if (!storedDateTime) {
//         document.getElementById('result').textContent = "No date and time stored in localStorage.";
//         return;
//     }

//     const givenDateTime = new Date(storedDateTime);

//     // Compare the dates and times
//     let resultText;
//     if (givenDateTime > currentDate) {
//         resultText = "The stored date and time is in the future.";
//     } else if (givenDateTime < currentDate) {
//         resultText = "The stored date and time is in the past.";
//         changeDay();
//         // const storedDateTime = localStorage.getItem('storedDateTime');
//         // const currentDate = new Date();
//         // const nextTime = new Date(currentDate.getTime() + 1 * 60 * 1000); // Add 5 minutes

//         // // Format date to YYYY-MM-DDTHH:MM:SS
//         // const formattedNextTime = nextTime.toISOString();
//         // localStorage.setItem('storedDateTime', formattedNextTime);

//     } else {
//         resultText = "The stored date and time is now.";
//         // abc="hey";
//     }

//     // Display the result
//     document.getElementById('test').textContent = resultText;
// }

function compareDates() {
    // Get the current date
    const currentDate = new Date();
    const format = currentDate.toISOString().split('T')[0];
    // console.log(format);
    // Get the stored date from localStorage
    const storedDate = localStorage.getItem('storedDate');
    // console.log(storedDate);

    // const givenDate = new Date(storedDate);
    // console.log(givenDate);

    if (storedDate > format) {
        // console.log("future");

        //  future
    } else if (storedDate < format) {
        // console.log("past");
        //    past
        changeDay();
        const currentDate = new Date();
        const nextDate = new Date();
        nextDate.setDate(currentDate.getDate() + 1);

        // Format date to YYYY-MM-DD
        const formattedNextDate = nextDate.toISOString().split('T')[0];
        localStorage.setItem('storedDate', formattedNextDate);
    } else {
        // console.log("present");
        changeDay();
        const currentDate = new Date();
        const nextDate = new Date();
        nextDate.setDate(currentDate.getDate() + 1);

        // Format date to YYYY-MM-DD
        const formattedNextDate = nextDate.toISOString().split('T')[0];
        localStorage.setItem('storedDate', formattedNextDate);
        //  today
    }

}


// Ensure motivational message is updated after a refresh
window.addEventListener('load', () => {
    updateMotivationalMessage();
});

// setInterval(compareDates, 10000);