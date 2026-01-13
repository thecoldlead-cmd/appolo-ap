const apiData = [
    { name: "Anisur Rahman", title: "Software Architect", company: "Brain Station 23", email: "Verified" },
    { name: "Sumaiya Akter", title: "Marketing Manager", company: "Grameenphone", email: "Verified" },
    { name: "Tanvir Hasan", title: "Product Designer", company: "Pathao", email: "Unverified" },
    { name: "Jessica Smith", title: "CEO", company: "Global Tech", email: "Verified" },
    { name: "Ariful Islam", title: "Data Scientist", company: "TigerIT", email: "Verified" }
];

const leadData = document.getElementById('leadData');
const mainSearch = document.getElementById('mainSearch');
const countSpan = document.getElementById('count');
const loader = document.getElementById('loader');

// ডেটা রেন্ডার করার ফাংশন
function renderLeads(leads) {
    leadData.innerHTML = "";
    leads.forEach(lead => {
        const row = `
            <tr>
                <td><strong>${lead.name}</strong></td>
                <td>${lead.title}</td>
                <td>${lead.company}</td>
                <td><span class="status ${lead.email === 'Verified' ? 'verified' : ''}">${lead.email}</span></td>
                <td><button class="access-btn" onclick="accessEmail('${lead.name}')">Access Email</button></td>
            </tr>
        `;
        leadData.innerHTML += row;
    });
    countSpan.innerText = leads.length;
}

// লাইভ সার্চ ফাংশনালিটি
mainSearch.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = apiData.filter(item => 
        item.name.toLowerCase().includes(value) || 
        item.company.toLowerCase().includes(value) ||
        item.title.toLowerCase().includes(value)
    );
    renderLeads(filtered);
});

// ইমেল এক্সেস করার সিমুলেশন
function accessEmail(name) {
    alert("Fetching verified email for: " + name);
}

// শুরুতে লোডার দেখিয়ে ডেটা লোড করা
loader.style.display = "block";
setTimeout(() => {
    loader.style.display = "none";
    renderLeads(apiData);
}, 1000);
