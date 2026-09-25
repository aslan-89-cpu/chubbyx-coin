// Tasks Database with 5000 Coins reward each
const taskLinks = {
    tg_channel: 'https://t.me', 
    x_follow: 'https://x.com'   
};

function completeTask(taskId) {
    // 1. Check if this task was already completed before
    if (localStorage.getItem(task_completed_${taskId})) {
        alert("You have already completed this task and claimed your reward!");
        return;
    }

    // 2. Open the official link for Telegram or X
    const targetLink = taskLinks[taskId];
    if (targetLink) {
        window.open(targetLink, '_blank');

        // 3. Give 5000 coins ONLY after opening the link (waits 2.5 seconds for completion)
        setTimeout(() => {
            let currentScore = parseInt(localStorage.getItem('chubby_score')) || 0;
            currentScore += 5000; // Adds 5000 Coins reward
            
            // Save updated balance and task completion status locally
            localStorage.setItem('chubby_score', currentScore);
            localStorage.setItem(task_completed_${taskId}, 'true');
            
            // Update the coin balance counter on the screen
            if (document.getElementById('score')) {
                document.getElementById('score').innerText = currentScore;
            }
            
            alert("Task verified successfully! You earned +5,000 Coins. 🎉");
        }, 2500);
    }
}
