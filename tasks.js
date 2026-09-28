const tasksPage = document.getElementById('tasks-page');

if (tasksPage) {
    tasksPage.innerHTML = `
        <h2 class="page-title">Tasks List</h2>
        <div class="page-content">
            <p style="color: #ccc; margin-bottom: 20px; text-align: center;">Complete tasks to earn more $CHUBBYX</p>
            <div style="background: rgba(255,255,255,0.07); padding: 15px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; font-size: 15px;">Follow Telegram Channel</div>
                    <div style="color: #eeb308; font-size: 13px; margin-top: 3px;">+1,000 CHUBBYX</div>
                </div>
                <button style="background: #eeb308; color: black; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">Start</button>
            </div>
            <div style="background: rgba(255,255,255,0.07); padding: 15px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; font-size: 15px;">Follow X Account</div>
                    <div style="color: #eeb308; font-size: 13px; margin-top: 3px;">+800 CHUBBYX</div>
                </div>
                <button style="background: #eeb308; color: black; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">Start</button>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: 20px; padding: 12px;">Back to Home</button>
    `;
}
