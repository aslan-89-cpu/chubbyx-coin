// ChubbyX Invite Dynamic Logic
document.addEventListener("DOMContentLoaded", () => {
    const inviteActionBtn = document.getElementById("invite-action-btn");
    
    if (inviteActionBtn) {
        inviteActionBtn.addEventListener("click", () => {
            const botUsername = "Your_bot_username"; 
            const inviteLink = https://t.me{botUsername}/game;

            navigator.clipboard.writeText(inviteLink).then(() => {
                alert("Your unique invite link copied to clipboard! Share it with friends.");
            }).catch(err => {
                console.error('Could not copy link: ', err);
            });
        });
    }
});
