function completeTask(taskId, reward, buttonElement) {
    if(localStorage.getItem('task_done_' + taskId)) return;
    
    buttonElement.innerText = "Verifying...";
    buttonElement.disabled = true;

    setTimeout(function() {
        count += reward;
        document.getElementById('main-score').innerText = count.toLocaleString();
        localStorage.setItem('chubby_coins', count);
        localStorage.setItem('task_done_' + taskId, 'true');
        
        buttonElement.innerText = "Completed ✓";
        buttonElement.style.background = "#555";
        buttonElement.style.color = "#888";
    }, 2000);
}

(function() {
    const tasksPage = document.getElementById('tasks-page');
    if (!tasksPage) return;

    tasksPage.innerHTML = `
        <h2 class="page-title">Tasks List</h2>
        <div class="page-content">
            <p style="color: #aaa; text-align: center; margin-bottom: 25px; font-size: 14px;">Complete tasks to earn more $CHUBBYX</p>
            
            <div class="task-card">
                <div>
                    <div style="font-weight: bold; font-size: 15px;">Follow Telegram Channel</div>
                    <div style="color: #eeb308; font-size: 13px; margin-top: 3px;">+5,000 CHUBBYX</div>
                </div>
                <button class="task-btn" onclick="completeTask('tg', 5000, this)">Start</button>
            </div>

            <div class="task-card">
                <div>
                    <div style="font-weight: bold; font-size: 15px;">Follow X Account</div>
                    <div style="color: #eeb308; font-size: 13px; margin-top: 3px;">+3,000 CHUBBYX</div>
                </div>
                <button class="task-btn" onclick="completeTask('x', 3000, this)">Start</button>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: auto; padding: 12px; margin-bottom: 100px;">Back to Home</button>
    `;
})();
