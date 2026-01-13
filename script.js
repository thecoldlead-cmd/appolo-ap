// ১. আপনার নতুন শিট আইডি এবং ট্যাব নাম
const SHEET_ID = '16dK4p0q13BjYcze-oZCY2UtGp1RFwSmyJGQ0IW3h9y8'; // নতুন শিট আইডি
const SHEET_NAME = 'Sheet1'; // আপনার নতুন শিটের ট্যাব নাম
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

let allLeads = [];
let currentCredits = 1500;

// ২. ডেটা ফেচ করার ফাংশন
async function fetchLeads() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = "block";
    
    try {
        const response = await fetch(URL);
        const rawText = await response.text();
        const jsonData = JSON.parse(rawText.substring(47).slice(0, -2));
        
        // আপনার শিটের কলাম ম্যাপিং (A=0, B=1, C=2, D=3...)
        allLeads = jsonData.table.rows.map(row => {
            const r = row.c;
            return {
                name: (r[0] ? r[0].v : '') + ' ' + (r[1] ? r[1].v : ''), // First + Last Name
                title: r[2] ? r[2].v : 'N/A', // Title
                company: r[3] ? r[3].v : 'N/A', // Company Name
                status: r[15] ? r[15].v : 'Verified' // Status কলাম (P=index 15)
            };
        });

        renderLeads(allLeads);
    } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে:", error);
    } finally {
        if (loader) loader.style.display = "none";
    }
}

// ৩. টেবিল রেন্ডার ফাংশন (স্মুথ লোডিংয়ের জন্য)
function renderLeads(leads) {
    const container = document.getElementById('leadData');
    if (!container) return;
    
    // একসাথে অনেক ডেটা রেন্ডার করলে ব্রাউজার হ্যাং হয়, তাই লিমিট করা হলো
    const displayLeads = leads.slice(0, 100); 
    
    let html = "";
    displayLeads.forEach(lead => {
        html += `
            <tr class="fade-in">
                <td><strong>${lead.name}</strong></td>
                <td>${lead.title}</td>
                <td>${lead.company}</td>
                <td><span class="status verified">${lead.status}</span></td>
                <td><button class="access-btn" onclick="handleUnlock('${lead.name}')">Access Email</button></td>
            </tr>`;
    });
    
    container.innerHTML = html;
    
    // মোট লিড সংখ্যা আপডেট
    const countLabel = document.getElementById('count');
    if (countLabel) countLabel.innerText = leads.length;
}

// ৪. সার্চ ফাংশন
document.getElementById('mainSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allLeads.filter(l => 
        l.name.toLowerCase().includes(term) || 
        l.company.toLowerCase().includes(term)
    );
    renderLeads(filtered);
});

// ৫. ক্রেডিট সিস্টেম
function handleUnlock(name) {
    if (currentCredits >= 10) {
        currentCredits -= 10;
        document.getElementById('userCredits').innerText = currentCredits;
        alert(`${name} এর ইমেইল এক্সেস সফল! ১০ ক্রেডিট কাটা হয়েছে।`);
    } else {
        alert("আপনার ক্রেডিট শেষ! দয়া করে রিচার্জ করুন।");
    }
}

fetchLeads();
