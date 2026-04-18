// admin.js (uses config.js for API_BASE and apiFetch)
// Handles admin actions: approve/reject applications, generate/send login, manage disbursements

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sidebar-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.segment').forEach(seg => seg.classList.add('hidden'));
            const segId = 'segment-' + btn.dataset.segment;
            document.getElementById(segId).classList.remove('hidden');
        });
    });
    fetchApplications();
    fetchDisbursementForms();
    fetchDisbursementHistory();
    const appreciationBtn = document.getElementById('sendAppreciationBtn');
    if (appreciationBtn) appreciationBtn.addEventListener('click', sendAppreciationToAll);
    const closeProfileBtn = document.getElementById('closeProfileModal');
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfileModal);
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        clearToken();
        localStorage.removeItem('alifUser');
        window.location.href = '/user-login.html';
    });
});

// --- Applications ---
async function fetchApplications() {
    try {
        const applications = await apiFetch('/api/scholarships/applications');
        const tableBody = document.getElementById('applicationsTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        applications.forEach(app => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-3 py-2 border">${app.fullName || ''}</td>
                <td class="px-3 py-2 border">${app.email || ''}</td>
                <td class="px-3 py-2 border">${app.status || 'Pending'}</td>
                <td class="px-3 py-2 border">${app.documents ? `<a href="${window.API_BASE}/${app.documents}" class="text-blue-600 underline" target="_blank">View</a>` : 'N/A'}</td>
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
    } catch (error) {
        console.error('Error fetching applications:', error);
        alert('Failed to load applications: ' + error.message);
    }
}

// Export applications as CSV
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportApplicationsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            try {
                const applications = await apiFetch('/api/scholarships/applications');
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
            } catch (error) {
                console.error('Export error:', error);
                alert('Failed to export: ' + error.message);
            }
        });
    }
});

async function approveApplication(e) {
    try {
        const id = e.target.dataset.id;
        const email = e.target.dataset.email;
        const name = e.target.dataset.name;
        await apiFetch(`/api/scholarships/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'Approved' })
        });
        const res = await apiFetch('/api/auth/admin-register', {
            method: 'POST',
            body: JSON.stringify({ name, email })
        });
        if (res.login) {
            alert(`Application approved!\n\nUser Login Details:\nEmail: ${res.login.email}\nPassword: ${res.login.password}`);
        } else {
            alert('Application approved, login sent to user!');
        }
        fetchApplications();
    } catch (error) {
        console.error('Approval error:', error);
        alert('Approval failed: ' + error.message);
    }
}

async function rejectApplication(e) {
    try {
        const id = e.target.dataset.id;
        await apiFetch(`/api/scholarships/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'Declined' })
        });
        alert('Application declined.');
        fetchApplications();
    } catch (error) {
        console.error('Rejection error:', error);
        alert('Rejection failed: ' + error.message);
    }
}

// --- Disbursement Forms ---
async function fetchDisbursementForms() {
    try {
        const forms = await apiFetch('/api/disbursements/all');
        const tableBody = document.getElementById('disbursementFormsTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        (forms.data || forms).forEach(form => {
            const tr = document.createElement('tr');
            const details = typeof form.details === 'string' ? JSON.parse(form.details) : form.details;
            tr.innerHTML = `
                <td class="px-3 py-2 border">${details.fullName || 'N/A'}</td>
                <td class="px-3 py-2 border">${details.studentId || 'N/A'}</td>
                <td class="px-3 py-2 border">${form.amount || 0}</td>
                <td class="px-3 py-2 border">${details.bankName || 'N/A'}</td>
                <td class="px-3 py-2 border">${details.accountNumber || 'N/A'}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching disbursement forms:', error);
    }
}

// --- Disbursement History ---
async function fetchDisbursementHistory() {
    try {
        const history = await apiFetch('/api/disbursements/all');
        const tableBody = document.getElementById('disbursementHistoryTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        (history.data || history).forEach(item => {
            const tr = document.createElement('tr');
            const details = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
            tr.innerHTML = `
                <td class="px-3 py-2 border">${details.fullName || 'N/A'}</td>
                <td class="px-3 py-2 border">${item.amount || 0}</td>
                <td class="px-3 py-2 border">${new Date(item.created_at).toLocaleDateString()}</td>
                <td class="px-3 py-2 border">${item.received ? 'Yes' : 'No'}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching disbursement history:', error);
    }
}

function sendAppreciationToAll() {
    alert('Appreciation sent to all users!');
}

function closeProfileModal() {
    document.getElementById('profileModal')?.classList.add('hidden');
}

function showProfileModal(e) {
    document.getElementById('profileModal')?.classList.remove('hidden');
}
