// আপনার শিট আইডি অলরেডি বসিয়ে দিয়েছি
const SHEET_ID = '1hsogF0HyhH1rAb9Rg_Gn68dGpNakjxsDGpDI818_wz4'; 
const SHEET_TITLE = 'Sheet1'; 
const SHEET_RANGE = 'A2:D100'; 

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

const leadData = document.getElementById('leadData');
const mainSearch = document.getElementById('mainSearch');
const countSpan = document.getElementById('count');
const loader = document.getElementById('loader');

let allLeads = [];

async function fetchLeads() {
    loader.style.display = "block";
    try {
        const response = await fetch(URL);
        const text = await response.text();
        // Google Sheet JSON ফরম্যাট ক্লিন করা
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        
        allLeads = jsonData.table.rows.map(row => ({
            name: row.c[0] ? row.c[0].v : 'N/A',
            title: row.c[1] ? row.c[1].v : 'N/A',
            company: row.c[2] ? row.c[2].v : 'N/A',
            email: row.c[3] ? row.c[3].v : 'Unverified'
        }));

        renderLeads(allLeads);
    } catch (error) {
        console.error("Error:", error);
        leadData.innerHTML = "<tr><td colspan='5' style='text-align:center; color:red;'>ডেটা লোড করতে সমস্যা হচ্ছে। শিটটি Public করা আছে কিনা চেক করুন।</td></tr>";
    } finally {
        loader.style.display = "none";
    }
}

function renderLeads(leads) {
    leadData.innerHTML = "";
    leads.forEach(lead => {
        const row = `
            <tr>
                <td><strong>${lead.name}</strong></td>
                <td>${lead.title}</td>
                <td>${lead.company}</td>
                <td><span class="status ${lead.email.toLowerCase() === 'verified' ? 'verified' : ''}">${lead.email}</span></td>
                <td><button class="access-btn" onclick="accessEmail('${lead.name}')">Access Email</button></td>
            </tr>
        `;
        leadData.innerHTML += row;
    });
    countSpan.innerText = leads.length;
}

mainSearch.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = allLeads.filter(item => 
        item.name.toString().toLowerCase().includes(value) || 
        item.company.toString().toLowerCase().includes(value)
    );
    renderLeads(filtered);
});

function accessEmail(name) {
    alert("Fetching email for: " + name);
}

// লোড কল
fetchLeads();
