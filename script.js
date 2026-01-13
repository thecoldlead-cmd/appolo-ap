const SUPABASE_URL = 'https://zkoudzxdhwgjzxcrzbvi.supabase.co';
const SUPABASE_KEY = ''eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprb3VkenhkaHdnanp4Y3J6YnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjE0OTUsImV4cCI6MjA4Mzg5NzQ5NX0.TwHDRrryXMW9QZUacLC98PzvX9PqShHE7ylUzQZCiB0';';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else checkUser();
}

// Signup
async function handleSignUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Check your email for confirmation!");
    else alert("Signup successful!");
}

// Check User Status
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        fetchLeads();
    } else {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }
}

// Fetch Leads
async function fetchLeads(query = '') {
    let url = `${SUPABASE_URL}/rest/v1/leads?select=*`;
    if (query) url += `&or=(first_name.ilike.*${query}*,company_name.ilike.*${query}*)`;

    const res = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
    });
    const data = await res.json();
    
    document.getElementById('results').innerHTML = data.map(lead => `
        <tr>
            <td><strong>${lead.first_name} ${lead.last_name || ''}</strong></td>
            <td>${lead.title}</td>
            <td>${lead.company_name}</td>
            <td>${lead.location}</td>
            <td><button class="view-btn" onclick="alert('Email: ${lead.email}')">Show Email</button></td>
        </tr>
    `).join('');
}

async function handleLogout() { await supabase.auth.signOut(); checkUser(); }
document.getElementById('searchInput').addEventListener('input', (e) => fetchLeads(e.target.value));
checkUser();
