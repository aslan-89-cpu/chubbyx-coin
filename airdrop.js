const airdropPage = document.getElementById('airdrop-page');

if (airdropPage) {
    airdropPage.innerHTML = `
        <h2 class="page-title">Airdrop Tasks</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <p style="color: #ccc; font-size: 15px; max-width: 260px; line-height: 1.5;">Listing and distribution parameters will be announced soon.</p>
            <h3 style="color: #eeb308; margin-top: 25px; font-size: 18px; letter-spacing: 1px;">Listing Status: TBD</h3>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: 20px; padding: 12px;">Back to Home</button>
    `;
}
