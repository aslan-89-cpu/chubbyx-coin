 // ChubbyX Tasks Dynamic Logic
const taskLinks = {
    'tg': 'https://t.me', 
    'x': 'https://x.com'    
};

function handleTaskClick(taskId, buttonElement) {
    if (localStorage.getItem(task_completed_${taskId})) {
        alert("You have already completed this task! 😊");
        return;
    }

    const targetLink = taskLinks[taskId];
    if (targetLink) {
        window.open(targetLink, '_blank');
        
        // گۆڕینی دوگمەکە بۆ دۆخی پشکنین
        const rewardSpan = buttonElement.querySelector('span:last-child');
        if (rewardSpan) {
            rewardSpan.innerText = "Checking...";
            rewardSpan.style.color = "#ffd666";
        }

        // دوای ٣ چرکە خەڵاتەکەی پێدەدرێت
        setTimeout(() => {
            let currentCoins = parseInt(localStorage.getItem('chubby_coins')) || 0;
            currentCoins += 5000;
            localStorage.setItem('chubby_coins', currentCoins);
            localStorage.setItem(task_completed_${taskId}, 'true');

            if (document.getElementById('score')) {
                document.getElementById('score').innerText = currentCoins.toLocaleString();
            }

            if (rewardSpan) {
                rewardSpan.innerText = "✅ Done";
                rewardSpan.style.color = "#a0e670";
            }
            buttonElement.style.opacity = "0.6";
            alert(Task verified! You earned +5,000 coins. 🚀);
        }, 3000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const tgBtn = document.getElementById("task-tg-btn");
    const xBtn = document.getElementById("task-x-btn");

    if (tgBtn) {
        if (localStorage.getItem('task_completed_tg')) {
            tgBtn.style.opacity = "0.6";
            tgBtn.querySelector('span:last-child').innerText = "✅ Done";
            tgBtn.querySelector('span:last-child').style.color = "#a0e670";
        }
        tgBtn.addEventListener("click", () => handleTaskClick('tg', tgBtn));
    }

    if (xBtn) {
        if (localStorage.getItem('task_completed_x')) {
            xBtn.style.opacity = "0.6";
            xBtn.querySelector('span:last-child').innerText = "✅ Done";
            xBtn.querySelector('span:last-child').style.color = "#a0e670";
        }
        xBtn.addEventListener("click", () => handleTaskClick('x', xBtn));
    }
});
