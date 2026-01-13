// ১. আপনার গুগল শিট কনফিগারেশন
const SHEET_ID = '1foQGOZNLwMcL0O64zqf7SsYgkypIx_NbC02crmxhv4U';
const GID = '1718999460';
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;

// ২. স্টেট ম্যানেজমেন্ট
let allLeads = [];
let currentCredits = 1500;

// এলিমেন্ট সিলেকশন
const leadDataContainer = document.getElementById('leadData');
const mainSearchInput = document.getElementById('mainSearch');
const userCreditsDisplay = document.getElementById('userCredits');
const loaderElement = document.getElementById('loader');

// ৩. গুগল শিট থেকে ডেটা ফেচ করা
async function fetchLeadsFromSheet() {
    if (loaderElement) loaderElement.style.display = "block";
    
    try {
        const response = await fetch(URL);
        const rawText = await response.text();
        
        // গুগল শিটের JSON ডাটা ক্লিন করা
        const jsonData = JSON.parse(rawText.substring(47).slice(0, -2));
        
        allLeads = jsonData.table.rows.map(row => ({
            name: row.c[0] ? row.c[0].v : 'N/A',
            title: row.c[1] ? row.c[1].v : 'N/A',
            company: row.c[2] ? row.c[2].v : 'N/A',
            status: row.c[3] ? row.c[3].v : 'Paid'
        }));

        renderLeadsTable(allLeads);
    } catch (error) {
        console.error("Fetch Error:", error);
        if (leadDataContainer) {
            leadDataContainer.innerHTML = "<tr><td colspan='5' style='text-align:center; color:#ef4444; padding:20px;'>Data Sync Failed! Please check if the Google Sheet is Public.</td></tr>";
        }
    } finally {
        if (loaderElement) loaderElement.style.display = "none";
    }
}

// ৪. টেবিল রেন্ডার করা (Premium UI এর জন্য)
function renderLeadsTable(leads) {
    if (!leadDataContainer) return;
    leadDataContainer.innerHTML = "";

    leads.forEach(lead => {
        const isFree = lead.status.toString().toLowerCase() === 'free';
        const rowHTML = `
            <tr class="fade-in">
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:30px; height:30px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; color:#6366f1;">
                            ${lead.name.charAt(0)}
                        </div>
                        <strong>${lead.name}</strong>
                    </div>
                </td>
                <td>${lead.title}</td>
                <td><i class="fas fa-building" style="color:#94a3b8; font-size:12px;"></i> ${lead.company}</td>
                <td>
                    <span class="status ${isFree ? 'free-tag' : 'paid-tag'}">
                        <i class="fas ${isFree ? 'fa-check-circle' : 'fa-lock'}"></i> ${lead.status}
                    </span>
                </td>
                <td>
                    <button class="access-btn" onclick="handleLeadUnlock('${lead.name}', '${lead.status}')">
                        ${isFree ? 'Get Details' : 'Unlock (10 Cr)'}
                    </button>
                </td>
            </tr>
        `;
        leadDataContainer.innerHTML += rowHTML;
    });

    const countLabel = document.getElementById('count');
    if (countLabel) countLabel.innerText = leads.length;
}

// ৫. লিড আনলক এবং ক্রেডিট ম্যানেজমেন্ট
window.handleLeadUnlock = function(name, status) {
    const isFreeLead = status.toString().toLowerCase() === 'free';

    if (isFreeLead) {
        alert(`🔓 Success! Free Lead Unlocked.\nName: ${name}\nEmail: contact@${name.split(' ')[0].toLowerCase()}.io`);
    } else {
        if (currentCredits >= 10) {
            currentCredits -= 10;
            if (userCreditsDisplay) userCreditsDisplay.innerText = currentCredits;
            
            // ক্রেডিট কমার সময় একটি স্মুথ এনিমেশন
            userCreditsDisplay.parentElement.style.transform = "scale(1.1)";
            setTimeout(() => userCreditsDisplay.parentElement.style.transform = "scale(1)", 200);

            alert(`💎 Premium Access Granted!\n10 Credits deducted for ${name}.\nFetching verified data...`);
        } else {
            alert("⚠️ Insufficient Credits! Please upgrade your plan.");
            openPayment();
        }
    }
}

// ৬. নেভিগেশন এবং সেকশন পরিবর্তন
window.showSection = function(sectionId) {
    const searchSection = document.getElementById('search-section');
    const otherSection = document.getElementById('other-section');
    const sectionTitle = document.getElementById('section-title');

    // নেভিগেশন বাটনের স্টাইল পরিবর্তন
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (sectionId === 'search') {
        searchSection.classList.remove('hidden');
        otherSection.classList.add('hidden');
    } else {
        searchSection.classList.add('hidden');
        otherSection.classList.remove('hidden');
        if (sectionTitle) sectionTitle.innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + " Module";
    }
}

// ৭. পেমেন্ট মডাল কন্ট্রোল
window.openPayment = function() {
    document.getElementById('paymentModal').style.display = "flex";
}
window.closePayment = function() {
    document.getElementById('paymentModal').style.display = "none";
}

// ৮. লাইভ প্রিমিয়াম সার্চ
if (mainSearchInput) {
    mainSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLeads = allLeads.filter(lead => 
            lead.name.toString().toLowerCase().includes(searchTerm) || 
            lead.company.toString().toLowerCase().includes(searchTerm) ||
            lead.title.toString().toLowerCase().includes(searchTerm)
        );
        renderLeadsTable(filteredLeads);
    });
}

// পেজ লোড হলে ডেটা ফেচ শুরু করুন
fetchLeadsFromSheet();
