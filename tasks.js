// Tasks Database with 5000 Coins reward each
const taskLinks = {
    'tg': 'https://t.me', // لێرەدا بەستەری کەناڵی تێلیگرامەکەت دابنێ
    'x': 'https://x.com'    // لێرەدا بەستەری پەیجی ئێکسەکەت دابنێ
};

// ١. فەرمانی سەرەکی کاتێک کلیک لەسەر تاسکەکە دەکەن بۆ یەکەمجار
function startTask(taskId) {
    // پشکنین ئەگەر پێشتر تەواو کرابێت
    if (localStorage.getItem(task_completed_${taskId})) {
        alert("You have already completed this task! 😊");
        return;
    }

    const targetLink = taskLinks[taskId];
    if (targetLink) {
        // کردنەوەی لایەن یان پەیجەکە لە لاپەڕەیەکی نوێدا
        window.open(targetLink, '_blank');

        // گۆڕینی دەقی کاردەکە بۆ ئەوەی داوای پشکنین (Check) بکات
        const taskCard = document.getElementById(task-${taskId});
        if (taskCard) {
            // پاشەکەوتکردنی ئەوەی کە لینکەکەی کردووەتەوە
            localStorage.setItem(task_opened_${taskId}, 'true');
            
            // گۆڕینی دەقی ناو کاردەکە بۆ "Check 🔍"
            const statusText = taskCard.querySelector('span:last-child');
            if (statusText) {
                statusText.innerText = "Check 🔍";
                statusText.style.color = "#0088cc";
                statusText.style.background = "rgba(255,255,255,0.2)";
                statusText.style.padding = "4px 10px";
                statusText.style.borderRadius = "8px";
            }
        }
    }
}

// ٢. فەرمانی پشکنین کاتێک کلیک لەسەر "Check" دەکەنەوە
function verifyTask(taskId) {
    const taskCard = document.getElementById(task-${taskId});
    if (!taskCard) return;

    const statusText = taskCard.querySelector('span:last-child');
    if (!statusText) return;

    // پشکنین کە ئایا دەقەکە بووەتە "Check" (واتە کلیکی یەکەمی لێدراوە)
    if (statusText.innerText.includes("Check")) {
        statusText.innerText = "Checking...";
        statusText.style.color = "#ffd666";

        // دوای ٣ چرکە چاوەڕوانی، کۆینەکەی پێدەدرێت
        setTimeout(() => {
            let currentScore = parseInt(localStorage.getItem('chubby_score')) || 0;
            currentScore += 5000; // هەر تاسکێک ٥٠٠٠ کۆین

            // خەزنکردنی داتاکان لە مۆبایلەکەدا
            localStorage.setItem('chubby_score', currentScore);
            localStorage.setItem(task_completed_${taskId}, 'true');

            // نوێکردنەوەی ژمارەی سەر شاشەکە
            if (document.getElementById('score')) {
                document.getElementById('score').innerText = currentScore;
            }

            // گۆڕینی کاردەکە بۆ حاڵەتی تەواوبوو
            taskCard.style.opacity = "0.6";
            statusText.innerText = "✅ Done";
            statusText.style.color = "#a0e670";
            statusText.style.background = "transparent";
            statusText.style.padding = "0";

            alert(Task verified! You earned +5,000 coins. 🚀);
        }, 3000);
    } else {
        // ئەگەر دەقەکە هێشتا ژمارەی خەڵاتەکە بوو، واتە دەبێت سەرەتا لینکەکە بکاتەوە
        startTask(taskId);
    }
}

// بەستنەوەی فەرمانەکان بە دوگمەکانی ناو index.html لە کاتی باربوونی لاپەڕەکەدا
document.addEventListener("DOMContentLoaded", () => {
    const tgTask = document.getElementById("task-tg");
    const xTask = document.getElementById("task-x");

    if (tgTask) {
        // بەستنەوەی فەرمانی پشکنین بە کلیکەکە
        tgTask.addEventListener("click", () => verifyTask('tg'));
        
        // ئەگەر پێشتر بە تەواوی جێبەجێ کرابوو
        if (localStorage.getItem('task_completed_tg')) {
            tgTask.style.opacity = "0.6";
            tgTask.querySelector('span:last-child').innerText = "✅ Done";
            tgTask.querySelector('span:last-child').style.color = "#a0e670";
        } 
        // ئەگەر تەنها لینکەکەی کردبووەوە بەڵام چێکی نەکردبوو
        else if (localStorage.getItem('task_opened_tg')) {
            const statusText = tgTask.querySelector('span:last-child');
            statusText.innerText = "Check 🔍";
            statusText.style.color = "#0088cc";
        }
    }

    if (xTask) {
        xTask.addEventListener("click", () => verifyTask('x'));
        
        if (localStorage.getItem('task_completed_x')) {
            xTask.style.opacity = "0.6";
            xTask.querySelector('span:last-child').innerText = "✅ Done";
            xTask.querySelector('span:last-child').style.color = "#a0e670";
        } else if (localStorage.getItem('task_opened_x')) {
            const statusText = xTask.querySelector('span:last-child');
            statusText.innerText = "Check 🔍";
            statusText.style.color = "#0088cc";
        }
    }
});
