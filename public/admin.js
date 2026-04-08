// admin.js (moved from admin/modules/admin.js for correct public path)
// Handles admin actions: approve/reject applications, generate/send login, manage disbursements, send appreciation

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.segment').forEach(seg => seg.classList.add('hidden'));
            const segId = 'segment-' + btn.dataset.segment;
            document.getElementById(segId).classList.remove('hidden');
        });
    });
    // Initial load
    fetchApplications();
    fetchDisbursementForms();
    fetchDisbursementHistory();
    // Appreciation
    const appreciationBtn = document.getElementById('sendAppreciationBtn');
    if (appreciationBtn) appreciationBtn.addEventListener('click', sendAppreciationToAll);
    // Modal close
    const closeProfileBtn = document.getElementById('closeProfileModal');
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfileModal);
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        window.location.href = '/user-login.html';
    });
});

// --- Applications ---
async function fetchApplications() {
    const res = await fetch('/api/scholarships/applications');
    const applications = await res.json();
    const tableBody = document.getElementById('applicationsTableBody');
    tableBody.innerHTML = '';
    applications.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-3 py-2 border">${app.fullName}</td>
            <td class="px-3 py-2 border">${app.email}</td>
            <td class="px-3 py-2 border">${app.status}</td>
            <td class="px-3 py-2 border"><a href="/${app.documents}" class="text-blue-600 underline" target="_blank">View</a></td>
            <td class="px-3 py-2 border">
                <button class="profileBtn bg-gray-200 text-[#194341] px-2 py-1 rounded text-xs" data-type="applicant" data-id="${app.id}">Profile</button>
                <button class="approveBtn bg-green-500 text-white px-2 py-1 rounded text-xs" data-id="${app.id}" data-email="${app.email}" data-name="${app.fullName}">Approve</button>
                <button class="rejectBtn bg-red-500 text-white px-2 py-1 rounded text-xs" data-id="${app.id}">Reject</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    document.querySelectorAll('.approveBtn').forEach(btn => btn.addEventListener('click', approveApplication));
    document.querySelectorAll('.rejectBtn').forEach(btn => btn.addEventListener('click', rejectApplication));
    document.querySelectorAll('.profileBtn').forEach(btn => btn.addEventListener('click', showProfileModal));
}

// Export applications as CSV
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportApplicationsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const res = await fetch('/api/scholarships/applications');
            const applications = await res.json();
            const csvRows = [
                ['Full Name', 'Email', 'Status', 'Documents']
            ];
            applications.forEach(app => {
                csvRows.push([
                    app.fullName,
                    app.email,
                    app.status,
                    app.documents
                ]);
            });
            const csvContent = csvRows.map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scholarship_applications.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});

async function approveApplication(e) {
    const id = e.target.dataset.id;
    const email = e.target.dataset.email;
    const name = e.target.dataset.name;
    await fetch(`/api/scholarships/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
    });
    const res = await fetch('/api/auth/admin-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
    });
    if (res.ok) {
        const data = await res.json();
        if (data.login) {
            alert(`Application approved!\n\nUser Login Details:\nEmail: ${data.login.email}\nPassword: ${data.login.password}`);
        } else {
            alert('Application approved, login sent to user!');
        }
    } else {
        alert('Application approved, but failed to fetch login details.');
    }
    fetchApplications();
}

async function rejectApplication(e) {
    const id = e.target.dataset.id;
    await fetch(`/api/scholarships/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
    });
    alert('Application rejected.');
    fetchApplications();
}

// --- Disbursement Forms ---
async function fetchDisbursementForms() {
    const res = await fetch('/api/disbursements');
    const forms = await res.json();
    const tableBody = document.getElementById('disbursementFormsTableBody');
    tableBody.innerHTML = '';
    // ...existing code for rendering disbursement forms...
}

// --- Disbursement History ---
async function fetchDisbursementHistory() {
    // ...existing code for fetching and rendering disbursement history...
}

function sendAppreciationToAll() {
    // ...existing code for sending appreciation...
}

function closeProfileModal() {
    // ...existing code for closing profile modal...
}

function showProfileModal(e) {
    // ...existing code for showing profile modal...
}
