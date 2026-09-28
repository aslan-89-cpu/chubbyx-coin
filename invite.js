const invitesPage = document.getElementById('invites-page');

if (invitesPage) {
    invitesPage.innerHTML = `
        <h2 class="page-title">Invite Friends</h2>
        <div class="page-content" style="text-align: center;">
            <p style="color: #ccc; font-size: 15px; margin-bottom: 30px;">Share your referral link and get 10% bonus from your friends earnings!</p>
            <button style="background: #eeb308; color: black; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; font-size: 16px; width: 100%; max-width: 280px; cursor: pointer; box-shadow: 0 4px 15px rgba(238, 179, 8, 0.2);">
                Invite a Friend
            </button>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: 20px; padding: 12px;">Back to Home</button>
    `;
}
