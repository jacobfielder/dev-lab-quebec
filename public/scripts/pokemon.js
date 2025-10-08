let currentTeam = [];

// Initialize when page loads
$(document).ready(() => {
    loadTeams();
    $('.btn').hover(
        function() { $(this).addClass('shadow-lg'); },
        function() { $(this).removeClass('shadow-lg'); }
    );
});

// Generate random team
async function generateTeam() {
    showLoading('Generating team...');
    
    try {
        const response = await fetch('/api/teams/generate', { method: 'POST' });
        const data = await response.json();
        
        if (response.ok) {
            currentTeam = data.pokemon;
            displayTeam(currentTeam);
            showMessage('Team generated! ✨', 'success');
        } else {
            showMessage('Failed to generate team ❌', 'error');
        }
    } catch (error) {
        showMessage('Error generating team ❌', 'error');
    }
}

// Display Pokemon team
function displayTeam(pokemon) {
    const container = $('#pokemon-display');
    container.empty();
    
    pokemon.forEach(p => {
        container.append(`
            <div class="pokemon-card">
                <img src="${p.sprite}" alt="${p.name}" loading="lazy">
                <div class="pokemon-name">${p.name}</div>
                <div class="pokemon-types">
                    ${p.types.map(type => `<span class="type-badge">${type}</span>`).join('')}
                </div>
            </div>
        `);
    });
}

// Save team
async function saveTeam() {
    const teamName = $('#teamName').val().trim();
    
    if (!teamName) {
        showMessage('Please enter a team name 📝', 'warning');
        return;
    }
    if (currentTeam.length === 0) {
        showMessage('Generate a team first 🎲', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teamName, pokemon: currentTeam })
        });
        
        if (response.ok) {
            showMessage('Team saved! 🎉', 'success');
            $('#teamName').val('');
            loadTeams();
        } else {
            showMessage('Failed to save team ❌', 'error');
        }
    } catch (error) {
        showMessage('Error saving team ❌', 'error');
    }
}

// Load saved teams
async function loadTeams() {
    const container = $('#saved-teams');
    container.html('<h3 class="text-center"><div class="spinner-border text-primary me-2"></div>Loading...</h3>');
    
    try {
        const response = await fetch('/api/teams');
        const teams = await response.json();
        
        if (response.ok) {
            displaySavedTeams(teams);
        } else {
            showMessage('Failed to load teams ❌', 'error');
        }
    } catch (error) {
        showMessage('Error loading teams ❌', 'error');
    }
}

// Display saved teams
function displaySavedTeams(teams) {
    const container = $('#saved-teams');
    container.html('<h3 class="text-center mb-4">📚 Saved Teams</h3>');
    
    if (teams.length === 0) {
        container.append('<div class="text-center text-muted p-4">No saved teams yet. Create your first! 🌟</div>');
        return;
    }
    
    teams.forEach(team => {
        container.append(`
            <div class="team-item">
                <div class="team-header">
                    <h4 class="text-primary">${team.name}</h4>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm" onclick="editTeamName('${team._id}', '${team.name.replace(/'/g, "\\'")}')">✏️ Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTeam('${team._id}')">🗑️ Delete</button>
                    </div>
                </div>
                <small class="text-muted">📅 ${new Date(team.createdAt).toLocaleDateString()} | 👾 ${team.pokemon?.length || 0} Pokemon</small>
            </div>
        `);
    });
}

// Edit team name
async function editTeamName(teamId, currentName) {
    const newName = prompt('Enter new team name:', currentName);
    if (!newName || newName === currentName) return;
    
    try {
        const response = await fetch(`/api/teams/${teamId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        
        if (response.ok) {
            showMessage('Team updated! ✅', 'success');
            loadTeams();
        } else {
            showMessage('Failed to update ❌', 'error');
        }
    } catch (error) {
        showMessage('Error updating ❌', 'error');
    }
}

// Delete team
async function deleteTeam(teamId) {
    if (!confirm('Delete this team?')) return;
    
    try {
        const response = await fetch(`/api/teams/${teamId}`, { method: 'DELETE' });
        
        if (response.ok) {
            showMessage('Team deleted! 🗑️', 'success');
            loadTeams();
        } else {
            showMessage('Failed to delete ❌', 'error');
        }
    } catch (error) {
        showMessage('Error deleting ❌', 'error');
    }
}

// Show message
function showMessage(message, type) {
    $('.alert').remove();
    
    const alertClass = type === 'success' ? 'alert-success' : 
                     type === 'error' ? 'alert-danger' : 'alert-warning';
    
    const messageDiv = $(`
        <div class="alert ${alertClass} alert-dismissible fade show mt-3">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('.controls').append(messageDiv);
    setTimeout(() => messageDiv.remove(), 4000);
}

// Show loading
function showLoading(message) {
    $('#pokemon-display').html(`
        <div class="text-center p-5">
            <div class="spinner-border text-primary mb-3"></div>
            <div class="text-muted">${message}</div>
        </div>
    `);
}