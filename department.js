/* ==========================================================================
   EduVerse AI — department.js
   Department-based registration + personalized roadmap add-on.
   Frontend-only, localStorage-backed. Structured so a Flask + MongoDB
   backend can later replace the localStorage calls with real API calls
   without touching the rendering functions below them.

   Data contract stored in localStorage:
     eduverse-student-profile   -> { name, email, college, department,
                                      year, semester, cgpa, attendance,
                                      careerInterest, roadmap }
     eduverse-roadmap-progress  -> { [roadmapKey]: [completedStageIndex, ...] }
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * 1. DEPARTMENT → ROADMAP DATA
 *    Adding a new department later only means adding one entry here —
 *    no other file needs to change.
 * ---------------------------------------------------------------------- */
const DEPARTMENT_ROADMAPS = {
  ai_ds: {
    label: "Artificial Intelligence & Data Science (AI & DS)",
    stages: ["Python", "Statistics", "SQL", "Data Analysis", "Machine Learning", "Deep Learning", "Generative AI", "Projects", "Internship", "Placement"],
  },
  cse: {
    label: "Computer Science & Engineering (CSE)",
    stages: ["Programming", "DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks", "Web Development", "Projects", "Internship", "Placement"],
  },
  ece: {
    label: "Electronics & Communication Engineering (ECE)",
    stages: ["Circuit Fundamentals", "Digital Electronics", "Microprocessors", "Embedded Systems", "Communication Systems", "IoT", "Projects", "Internship", "Placement"],
  },
  eee: {
    label: "Electrical & Electronics Engineering (EEE)",
    stages: ["Electrical Fundamentals", "Circuit Theory", "Electrical Machines", "Power Systems", "Control Systems", "Power Electronics", "Projects", "Internship", "Placement"],
  },
  mech: {
    label: "Mechanical Engineering",
    stages: ["Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "CAD", "Manufacturing", "Robotics/Automation", "Projects", "Internship", "Placement"],
  },
  civil: {
    label: "Civil Engineering",
    stages: ["Engineering Mechanics", "Structural Analysis", "Surveying", "Concrete Technology", "Geotechnical Engineering", "Construction Management", "Projects", "Internship", "Placement"],
  },
  it: {
    label: "Information Technology (IT)",
    stages: ["Programming", "DSA", "DBMS", "Web Development", "Cloud Computing", "Cybersecurity", "DevOps", "Projects", "Internship", "Placement"],
  },
};

/* ---------------------------------------------------------------------- *
 * 2. STORAGE HELPERS — BACKEND: swap for POST /api/students,
 *    GET/POST /api/students/:id/roadmap-progress
 * ---------------------------------------------------------------------- */
function getStudentProfile() {
  try { return JSON.parse(localStorage.getItem('eduverse-student-profile')); }
  catch (e) { return null; }
}
function saveStudentProfile(profile) {
  localStorage.setItem('eduverse-student-profile', JSON.stringify(profile));
}
function getRoadmapProgress() {
  try { return JSON.parse(localStorage.getItem('eduverse-roadmap-progress') || '{}'); }
  catch (e) { return {}; }
}
function saveRoadmapProgress(progress) {
  localStorage.setItem('eduverse-roadmap-progress', JSON.stringify(progress));
}
/* Falls back to the AI & DS demo roadmap when no student has registered yet,
   so the dashboard never renders empty. */
function getActiveRoadmapKey() {
  const profile = getStudentProfile();
  return (profile && DEPARTMENT_ROADMAPS[profile.roadmap]) ? profile.roadmap : 'ai_ds';
}

/* ---------------------------------------------------------------------- *
 * 3. REGISTRATION — captures the form, assigns the department roadmap,
 *    stores the profile, and redirects to the dashboard.
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const deptSelect = document.getElementById('departmentSelect');

  /* Requirement 9: keep validity messaging in sync as the student changes
     their department selection before submitting. */
  deptSelect.addEventListener('change', () => {
    deptSelect.setCustomValidity('');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const deptKey = deptSelect.value;
    const deptInfo = DEPARTMENT_ROADMAPS[deptKey];
    if (!deptInfo) {
      deptSelect.setCustomValidity('Please select a department.');
    }

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const profile = {
      name: document.getElementById('fullNameInput').value.trim(),
      email: document.getElementById('emailInput').value.trim(),
      college: document.getElementById('collegeInput').value.trim(),
      department: deptInfo.label,
      year: document.getElementById('yearSelect').value,
      semester: document.getElementById('semesterSelect').value,
      cgpa: parseFloat(document.getElementById('cgpaInput').value),
      attendance: parseInt(document.getElementById('attendanceInput').value, 10),
      careerInterest: document.getElementById('careerInterestInput').value.trim(),
      roadmap: deptKey, // roadmap identifier — dynamically assigned from the selected department
    };

    saveStudentProfile(profile);

    /* Seed empty progress for this roadmap if the student hasn't started one yet */
    const progress = getRoadmapProgress();
    if (!progress[deptKey]) progress[deptKey] = [];
    saveRoadmapProgress(progress);

    window.location.href = 'dashboard.html';
  });
});

/* ---------------------------------------------------------------------- *
 * 4. DASHBOARD — department-specific roadmap as trackable stage cards
 * ---------------------------------------------------------------------- */
function renderDepartmentRoadmapCard() {
  const box = document.getElementById('departmentRoadmapCard');
  if (!box) return;

  const profile = getStudentProfile();
  const roadmapKey = getActiveRoadmapKey();
  const dept = DEPARTMENT_ROADMAPS[roadmapKey];
  const progress = getRoadmapProgress();
  const completed = new Set(progress[roadmapKey] || []);

  box.innerHTML = `
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
      <div>
        <h6 class="mb-1"><i class="bi bi-signpost-2 me-2"></i>My Department Roadmap</h6>
        <p class="text-muted-ev small mb-0">
          ${dept.label}
          ${!profile ? '<span class="ev-badge demo ms-2"><i class="bi bi-cpu"></i> Demo Profile</span>' : ''}
        </p>
      </div>
      <span class="ev-chip">${completed.size} / ${dept.stages.length} completed</span>
    </div>
    <div class="dna-track" id="roadmapStagesTrack"></div>
    <p class="text-muted-ev small mt-2 mb-0">
      <i class="bi bi-info-circle me-1"></i>Tap a stage to mark it completed or pending. This roadmap always matches the department chosen at registration.
    </p>
  `;

  renderRoadmapStages(dept, completed);
}

function renderRoadmapStages(dept, completed) {
  const track = document.getElementById('roadmapStagesTrack');
  if (!track) return;

  let nextAssigned = false;
  track.innerHTML = dept.stages.map((stage, i) => {
    const isDone = completed.has(i);
    let nodeClass = 'dna-node';
    let cardStyle = 'opacity:.6;';
    let chipClass = 'ev-chip';
    let statusLabel = 'Locked';

    if (isDone) {
      nodeClass = 'dna-node completed';
      cardStyle = 'background:var(--bg-sunken); box-shadow:none; cursor:pointer;';
      chipClass = 'ev-chip have';
      statusLabel = 'Completed';
    } else if (!nextAssigned) {
      nodeClass = 'dna-node next';
      cardStyle = 'border:1.5px dashed var(--ev-indigo); background:var(--bg-elevated); cursor:pointer;';
      chipClass = 'ev-badge';
      statusLabel = 'Up Next';
      nextAssigned = true;
    } else {
      cardStyle += 'cursor:pointer;';
    }

    return `
    <div class="${nodeClass}">
      <div class="ev-card ev-card-pad roadmap-stage-btn" data-index="${i}" style="${cardStyle}">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-0">${i + 1}. ${stage}</h6>
          <span class="${chipClass}">${statusLabel}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.roadmap-stage-btn');
  if (!btn) return;

  const idx = parseInt(btn.getAttribute('data-index'), 10);
  const roadmapKey = getActiveRoadmapKey();
  const progress = getRoadmapProgress();
  const list = new Set(progress[roadmapKey] || []);

  if (list.has(idx)) list.delete(idx); else list.add(idx);
  progress[roadmapKey] = Array.from(list).sort((a, b) => a - b);
  saveRoadmapProgress(progress);

  renderDepartmentRoadmapCard();
});

document.addEventListener('DOMContentLoaded', renderDepartmentRoadmapCard);
