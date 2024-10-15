document.addEventListener('DOMContentLoaded', () => {
    const risksContainer = document.getElementById('risks-container');
    const requirementsContainer = document.getElementById('requirements-container');
    const teamContainer = document.getElementById('team-container');

    document.getElementById('addRisk').addEventListener('click', () => {
        const riskDiv = document.createElement('div');
        riskDiv.classList.add('risk-input');
        riskDiv.innerHTML = `
            <input type="text" placeholder="Risk description" class="risk-description">
            <select class="risk-priority">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>`;
        risksContainer.appendChild(riskDiv);
        sortRisks();
    });

    document.getElementById('removeRisk').addEventListener('click', () => {
        if (risksContainer.children.length > 1) {
            risksContainer.removeChild(risksContainer.lastElementChild);
        } else {
            risksContainer.querySelector('.risk-description').value = '';
        }
    });

    document.getElementById('addRequirement').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('requirement');
        input.placeholder = 'Requirement';
        requirementsContainer.appendChild(input);
    });

    document.getElementById('removeRequirement').addEventListener('click', () => {
        if (requirementsContainer.children.length > 1) {
            requirementsContainer.removeChild(requirementsContainer.lastElementChild);
        } else {
            requirementsContainer.querySelector('input').value = '';
        }
    });

    document.getElementById('addTeamMember').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('team-member');
        input.placeholder = 'Team Member';
        teamContainer.appendChild(input);
    });

    document.getElementById('removeTeamMember').addEventListener('click', () => {
        if (teamContainer.children.length > 1) {
            teamContainer.removeChild(teamContainer.lastElementChild);
        } else {
            teamContainer.querySelector('input').value = '';
        }
    });

    document.getElementById('projectForm').addEventListener('submit', (event) => {
        const projectTitle = document.getElementById('projectTitle').value;
        const projectDescription = document.getElementById('projectDescription').value;

        if (!projectTitle || !projectDescription) {
            alert('Project Title and Description are required.');
            event.preventDefault();
        }
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function sortRisks() {
        const risks = Array.from(risksContainer.querySelectorAll('.risk-input'));
        risks.sort((a, b) => {
            const priorityA = a.querySelector('.risk-priority').value;
            const priorityB = b.querySelector('.risk-priority').value;

            const priorityRank = { 'High': 1, 'Medium': 2, 'Low': 3 };
            return priorityRank[priorityA] - priorityRank[priorityB];
        });

        risks.forEach(risk => risksContainer.appendChild(risk));
    }

    risksContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('risk-priority')) {
            sortRisks();
        }
    });
});
