// আপনার সুপাবেস কানেকশন ডিটেইলস
const SUPABASE_URL = 'https://zkoudzxdhwgjzxcrzbvi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprb3VkenhkaHdnanp4Y3J6YnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjE0OTUsImV4cCI6MjA4Mzg5NzQ5NX0.TwHDRrryXMW9QZUacLC98PzvX9PqShHE7ylUzQZCiB0';

const resultsBody = document.getElementById('results');
const searchInput = document.getElementById('searchInput');

// ডাটাবেস থেকে লিড আনার ফাংশন
async function fetchLeads(query = '') {
    resultsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Loading...</td></tr>';
    
    // Supabase API URL
    let url = `${SUPABASE_URL}/rest/v1/leads?select=*`;
    
    // যদি কেউ সার্চ করে তবে ফিল্টার করবে (নাম বা কোম্পানি দিয়ে)
    if (query) {
        url += `&or=(first_name.ilike.*${query}*,company_name.ilike.*${query}*)`;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        
        if (data.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No data found.</td></tr>';
        } else {
            renderTable(data);
        }
    } catch (error) {
        console.error('Error:', error);
        resultsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error connecting to database!</td></tr>';
    }
}

// টেবিলে ডাটা দেখানোর ফাংশন
function renderTable(leads) {
    resultsBody.innerHTML = leads.map(lead => `
        <tr>
            <td>${lead.first_name} ${lead.last_name || ''}</td>
            <td>${lead.title || 'N/A'}</td>
            <td>${lead.company_name || 'N/A'}</td>
            <td>${lead.location || 'N/A'}</td>
            <td><button class="view-btn" onclick="alert('Email: ${lead.email}')">Show Email</button></td>
        </tr>
    `).join('');
}

// টাইপ করার সাথে সাথে সার্চ শুরু হবে
searchInput.addEventListener('input', (e) => {
    fetchLeads(e.target.value);
});

// পেজ লোড হলে শুরুতে সব ডাটা দেখাবে
fetchLeads();
