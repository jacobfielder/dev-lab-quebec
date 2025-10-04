let currentTeam = [];

// Generate a random team
async function generateTeam() {
    showLoading('Generating team...');
    
    try {
        const response = await fetch('/api/teams/generate', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentTeam = data.pokemon;
            displayTeam(currentTeam);
            showMessage('Team generated successfully!', 'success');
        } else {
            showMessage('Failed to generate team', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error generating team', 'error');
    }
    
    hideLoading();
}

// Display team on the page
function displayTeam(pokemon) {
    const container = document.getElementById('pokemon-display');
    container.innerHTML = '';
    
    pokemon.forEach(p => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${p.sprite}" alt="${p.name}">
            <div class="pokemon-name">${p.name}</div>
            <div class="pokemon-types">
                ${p.types.map(type => `<span class="type-badge">${type}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}

// Save current team
async function saveTeam() {
    const teamName = document.getElementById('teamName').value.trim();
    
    if (!teamName) {
        showMessage('Please enter a team name', 'error');
        return;
    }
    
    if (currentTeam.length === 0) {
        showMessage('Generate a team first', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: teamName,
                pokemon: currentTeam
            })
        });
        
        if (response.ok) {
            showMessage('Team saved successfully!', 'success');
            document.getElementById('teamName').value = '';
            loadTeams();
        } else {
            showMessage('Failed to save team', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error saving team', 'error');
    }
}

// Load all saved teams
async function loadTeams() {
    try {
        const response = await fetch('/api/teams');
        const teams = await response.json();
        
        if (response.ok) {
            displaySavedTeams(teams);
        } else {
            showMessage('Failed to load teams', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error loading teams', 'error');
    }
}

// Display saved teams
function displaySavedTeams(teams) {
    const container = document.getElementById('saved-teams');
    container.innerHTML = '<h3>Saved Teams</h3>';
    
    if (teams.length === 0) {
        container.innerHTML += '<p>No saved teams yet.</p>';
        return;
    }
    
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.innerHTML = `
            <div class="team-header">
                <strong>${team.name}</strong>
                <div>
                    <button class="btn" onclick="editTeamName('${team._id}', '${team.name}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteTeam('${team._id}')">Delete</button>
                </div>
            </div>
            <div>Created: ${new Date(team.createdAt).toLocaleDateString()}</div>
        `;
        container.appendChild(teamDiv);
    });
}

// Edit team name
async function editTeamName(teamId, currentName) {
    const newName = prompt('Enter new team name:', currentName);
    
    if (!newName || newName === currentName) {
        return;
    }
    
    try {
        const response = await fetch(`/api/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        });
        
        if (response.ok) {
            showMessage('Team name updated successfully!', 'success');
            loadTeams();
        } else {
            showMessage('Failed to update team', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error updating team', 'error');
    }
}

// Delete a team
async function deleteTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/teams/${teamId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('Team deleted successfully!', 'success');
            loadTeams();
        } else {
            showMessage('Failed to delete team', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error deleting team', 'error');
    }
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.controls');
    container.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Show loading state
function showLoading(message) {
    const container = document.getElementById('pokemon-display');
    container.innerHTML = `<div class="loading">${message}</div>`;
}

// Hide loading state
function hideLoading() {
    // Loading is hidden when displayTeam is called
}

// Load teams when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTeams();
});