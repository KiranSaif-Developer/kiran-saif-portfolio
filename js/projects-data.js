// ===================================================================
// PROJECTS DATA — thin admin wrapper around the existing 'portfolio_projects'
// key (schema already defined/used by js/projects.js on the public page).
// ===================================================================

const PROJECTS_STORAGE_KEY = 'portfolio_projects';

function getProjectsAdmin() {
    return JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY)) || [];
}

function saveProjectsAdmin(list) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(list));
}
