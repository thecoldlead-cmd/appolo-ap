const SHEET_ID = '1foQGOZNLwMcL0O64zqf7SsYgkypIx_NbC02crmxhv4U';
const GID = '1718999460';
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;

let allLeads = [];
let credits = 1500;

async function fetchLeads() {
    document.getElementById('loader').style.display = "block";
    try {
        const res = await fetch(URL);
        const text = await res.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        
        allLeads = json.table.rows.map(r => ({
            name: r.c[0] ? r.c[0].v : 'N/A',
            title: r.c[1] ? r.c[1].v : 'N/A',
            company: r.c[2] ? r.c[2].v : 'N/A',
            status: r.c[3] ? r.c[3].v : 'Paid' // 'Free' or 'Paid'
        }));
        renderLeads(allLeads);
    } catch (e) { console.error("Data error", e); }
    document.getElementById('loader').style.display = "none";
}

function renderLeads(data) {
    const tbody = document.getElementById('leadData');
    tbody.innerHTML = "";
    data.forEach(l => {
        const isFree = l.status.toLowerCase() === 'free';
        tbody.innerHTML += `
            <tr>
                <td><strong>${l.name}</strong></td>
                <td>${l.title}</td>
                <td>${l.company}</td>
                <td><span class="status ${isFree ? 'free-tag' : 'paid-tag'}">${l.status}</span></td>
                <td><button class="access-btn" onclick="getLead('${l.name}', '${l.status}')">
                    ${isFree ? 'Get Free' : 'Unlock (10 Cr)'}
                </button></td>
            </tr>`;
    });
}

function getLead(name, status) {
    if(status.toLowerCase() === 'free') {
        alert("Free Access! Email for " + name + ": info@" + name.split(' ')[0].toLowerCase() + ".com");
    } else {
        if(credits >= 10) {
            credits -= 10;
            document.getElementById('userCredits').innerText = credits;
            alert("Unlocked! 10 credits deducted for " + name);
        } else {
            alert("Insufficient Credits! Please buy more.");
            openPayment();
        }
    }
}

// UI Functions
function showSection(id) {
    const s = document.getElementById('search-section');
    const o = document.getElementById('other-section');
    if(id === 'search') { s.style.display = "block"; o.style.display = "none"; }
    else { s.style.display = "none"; o.style.display = "block"; document.getElementById('section-title').innerText = id.toUpperCase(); }
}

function openPayment() { document.getElementById('paymentModal').style.display = "block"; }
function closePayment() { document.getElementById('paymentModal').style.display = "none"; }

mainSearch.addEventListener('input', (e) => {
    const v = e.target.value.toLowerCase();
    const f = allLeads.filter(l => l.name.toLowerCase().includes(v) || l.status.toLowerCase().includes(v));
    renderLeads(f);
});

fetchLeads();
