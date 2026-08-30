/* ==========================================================================
   EduVerse AI — script.js
   Frontend-only interactions + DUMMY DATA.
   Every value marked DUMMY / DEMO below is a placeholder that the future
   Flask + scikit-learn backend will replace with a real prediction.
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * 1. THEME (light / dark) — persisted in localStorage
 * ---------------------------------------------------------------------- */
(function initTheme(){
  const saved = localStorage.getItem('eduverse-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.theme-toggle');
    updateThemeIcon(saved);
    btns.forEach(btn => btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('eduverse-theme', next);
      updateThemeIcon(next);
    }));
  });
  function updateThemeIcon(mode){
    document.querySelectorAll('.theme-toggle i').forEach(i=>{
      i.className = mode === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    });
  }
})();

/* ---------------------------------------------------------------------- *
 * 2. SIDEBAR (mobile open/close)
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.ev-sidebar');
  const backdrop = document.querySelector('.ev-sidebar-backdrop');
  const openBtns = document.querySelectorAll('.sidebar-toggle-btn');
  if(sidebar && backdrop){
    openBtns.forEach(b => b.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('show');
    }));
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });
  }
});

/* ---------------------------------------------------------------------- *
 * 3. SCROLL REVEAL (landing page fade-ups)
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.fade-up');
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.15});
  items.forEach(i=>io.observe(i));
});

/* ---------------------------------------------------------------------- *
 * 4. DUMMY / DEMO DATA
 *    NOTE: All of this will later come from the Flask API:
 *      /api/student/profile
 *      /api/predict/performance   -> Random Forest Regressor + Logistic Regression
 *      /api/recommend/career      -> Random Forest Classifier
 *      /api/learning-dna          -> Content-based recommendation engine
 *      /api/senior-matches        -> KNN + Cosine Similarity
 * ---------------------------------------------------------------------- */
const EDUVERSE_DEMO = {
  student: {
    name: "Avinash M",
    department: "AI & Data Science",
    college: "T.J.S Engineering College",
    year: "3rd Year",
    semester: "5th Semester",
    cgpa: 8.2,
    attendance: 87,
    careerGoal: "Machine Learning Engineer",
    skills: [
      {name:"Python", level:80},
      {name:"SQL", level:60},
      {name:"Machine Learning", level:45},
      {name:"Statistics", level:55},
    ]
  },
  performanceTrend: {
    labels: ["Sem 2","Sem 3","Sem 4 (Current)","Sem 5 (Predicted)"],
    actual: [7.6, 7.9, 8.2, null],
    predicted: [null, null, 8.2, 8.5]
  },
  careers: [
    { name:"Machine Learning Engineer", match:89, have:["Python","Statistics","Pandas"], missing:["Deep Learning","MLOps"] },
    { name:"Data Scientist", match:84, have:["Python","SQL","Statistics"], missing:["A/B Testing","Big Data Tools"] },
    { name:"Data Analyst", match:78, have:["SQL","Excel","Python"], missing:["Power BI","Storytelling"] },
  ],
  seniors: [
    {
      id:"rahul", name:"Senior Rahul", dept:"AI & Data Science", cgpa:8.7,
      skills:["Python","Machine Learning","SQL"], projects:5, internships:2,
      role:"ML Engineer", similarity:91,
      journey:[
        {sem:1, title:"Foundations", detail:"Python programming basics"},
        {sem:2, title:"Core CS", detail:"Data Structures & Algorithms"},
        {sem:3, title:"Data Skills", detail:"SQL + Statistics"},
        {sem:4, title:"AI Core", detail:"Machine Learning fundamentals"},
        {sem:5, title:"Industry Exposure", detail:"Internship at a data-analytics startup"},
        {sem:6, title:"Applied Work", detail:"Major project: Student Risk Predictor"},
        {sem:7, title:"Placement Prep", detail:"Mock interviews, DSA revision"},
        {sem:8, title:"Outcome", detail:"Placed as ML Engineer"},
      ],
      certifications:["Google ML Crash Course","AWS Cloud Practitioner"],
      outcome:"Machine Learning Engineer @ a data-analytics startup"
    },
    {
      id:"priya", name:"Senior Priya", dept:"AI & Data Science", cgpa:8.4,
      skills:["Python","Pandas","Data Visualization"], projects:4, internships:1,
      role:"Data Scientist", similarity:83,
      journey:[
        {sem:1, title:"Foundations", detail:"Python + basic statistics"},
        {sem:2, title:"Core CS", detail:"Data Structures & Databases"},
        {sem:3, title:"Data Skills", detail:"Data Visualization with Pandas & Matplotlib"},
        {sem:4, title:"AI Core", detail:"Applied Machine Learning"},
        {sem:5, title:"Industry Exposure", detail:"Internship — data analytics team"},
        {sem:6, title:"Applied Work", detail:"Major project: Sales Forecasting Dashboard"},
        {sem:7, title:"Placement Prep", detail:"Case studies & SQL practice"},
        {sem:8, title:"Outcome", detail:"Placed as Data Scientist"},
      ],
      certifications:["IBM Data Science Professional"],
      outcome:"Data Scientist @ a retail analytics firm"
    },
    {
      id:"karthik", name:"Senior Karthik", dept:"AI & Data Science", cgpa:7.9,
      skills:["SQL","Excel","Power BI"], projects:3, internships:1,
      role:"Data Analyst", similarity:74,
      journey:[
        {sem:1, title:"Foundations", detail:"Programming basics"},
        {sem:2, title:"Core CS", detail:"Databases & SQL"},
        {sem:3, title:"Data Skills", detail:"Excel + Power BI"},
        {sem:4, title:"AI Core", detail:"Intro to Machine Learning"},
        {sem:5, title:"Industry Exposure", detail:"Internship — business intelligence team"},
        {sem:6, title:"Applied Work", detail:"Major project: Attendance Analytics Dashboard"},
        {sem:7, title:"Placement Prep", detail:"BI tool practice & interviews"},
        {sem:8, title:"Outcome", detail:"Placed as Data Analyst"},
      ],
      certifications:["Microsoft Power BI Data Analyst"],
      outcome:"Data Analyst @ a fintech company"
    }
  ],
  learningDna: [
    {skill:"Python", status:"completed", progress:100, difficulty:"Beginner", next:"Move to NumPy"},
    {skill:"NumPy", status:"completed", progress:100, difficulty:"Beginner", next:"Move to Pandas"},
    {skill:"Pandas", status:"completed", progress:90, difficulty:"Intermediate", next:"Sharpen data-cleaning skills"},
    {skill:"Statistics", status:"progress", progress:65, difficulty:"Intermediate", next:"Finish hypothesis testing module"},
    {skill:"Machine Learning", status:"next", progress:0, difficulty:"Advanced", next:"Start with supervised learning"},
    {skill:"Model Evaluation", status:"upcoming", progress:0, difficulty:"Advanced", next:"Learn precision, recall, ROC-AUC"},
    {skill:"Projects", status:"upcoming", progress:0, difficulty:"Advanced", next:"Build an end-to-end ML project"},
    {skill:"Deployment", status:"upcoming", progress:0, difficulty:"Advanced", next:"Deploy a model with Flask"},
  ]
};

/* ---------------------------------------------------------------------- *
 * 5. FORM VALIDATION (Bootstrap-style, frontend only)
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form.needs-validation').forEach(form=>{
    form.addEventListener('submit', function(e){
      e.preventDefault();
      e.stopPropagation();
      if(!form.checkValidity()){
        form.classList.add('was-validated');
        return;
      }
      form.classList.add('was-validated');
      const successTarget = form.getAttribute('data-success-redirect');
      if(successTarget){ window.location.href = successTarget; }
    });
  });
});

/* ---------------------------------------------------------------------- *
 * 6. DEMO LOGIN button (login.html) — no real auth
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const demoBtn = document.getElementById('demoLoginBtn');
  if(demoBtn){
    demoBtn.addEventListener('click', () => {
      localStorage.setItem('eduverse-demo-user', 'true');
      window.location.href = 'dashboard.html';
    });
  }
});

/* ---------------------------------------------------------------------- *
 * 7. Fill in student profile placeholders across pages
 *    Prefers a real registered profile (localStorage, set by department.js
 *    at registration) over the EDUVERSE_DEMO fallback — this key is a
 *    shared data contract, not a function dependency, so it works on
 *    every page whether or not department.js is loaded there.
 * ---------------------------------------------------------------------- */
function getDisplayStudent(){
  try{
    const stored = JSON.parse(localStorage.getItem('eduverse-student-profile'));
    if(stored && stored.name){
      return Object.assign({}, EDUVERSE_DEMO.student, {
        name: stored.name,
        department: stored.department,
        year: stored.year,
        cgpa: stored.cgpa,
        attendance: stored.attendance,
        careerGoal: stored.careerInterest,
      });
    }
  } catch(e){ /* ignore malformed storage */ }
  return EDUVERSE_DEMO.student;
}

document.addEventListener('DOMContentLoaded', () => {
  const s = getDisplayStudent();
  document.querySelectorAll('[data-student="name"]').forEach(el=>el.textContent = s.name);
  document.querySelectorAll('[data-student="firstname"]').forEach(el=>el.textContent = s.name.split(' ')[0]);
  document.querySelectorAll('[data-student="dept"]').forEach(el=>el.textContent = s.department);
  document.querySelectorAll('[data-student="cgpa"]').forEach(el=>el.textContent = s.cgpa);
  document.querySelectorAll('[data-student="attendance"]').forEach(el=>el.textContent = s.attendance + '%');
  document.querySelectorAll('[data-student="year"]').forEach(el=>el.textContent = s.year);
  document.querySelectorAll('[data-student="goal"]').forEach(el=>el.textContent = s.careerGoal);
  document.querySelectorAll('[data-student="initials"]').forEach(el=>{
    el.textContent = s.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  });
});


/* ---------------------------------------------------------------------- *
 * 8. Chart helpers (Chart.js) — used by dashboard.html, performance.html,
 *    career.html. Each function checks if its canvas exists first.
 * ---------------------------------------------------------------------- */
function getChartColors(){
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid: dark ? 'rgba(255,255,255,.06)' : 'rgba(23,20,38,.06)',
    text: dark ? '#948FB3' : '#6B6884',
    indigo: '#4F46E5',
    violet: '#7C3AED',
    cyan: '#06B6D4',
  };
}

function initDashboardChart(){
  const ctx = document.getElementById('dashboardChart');
  if(!ctx) return;
  const c = getChartColors();
  const d = EDUVERSE_DEMO.performanceTrend;
  new Chart(ctx, {
    type:'line',
    data:{
      labels:d.labels,
      datasets:[
        { label:'Actual CGPA', data:d.actual, borderColor:c.indigo, backgroundColor:c.indigo, tension:.35, spanGaps:true, pointRadius:5 },
        { label:'AI Predicted (Demo)', data:d.predicted, borderColor:c.cyan, backgroundColor:c.cyan, borderDash:[6,5], tension:.35, spanGaps:true, pointRadius:5 },
      ]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ labels:{ color:c.text } } },
      scales:{
        y:{ min:6, max:10, grid:{color:c.grid}, ticks:{color:c.text} },
        x:{ grid:{display:false}, ticks:{color:c.text} }
      }
    }
  });
}

function initCareerChart(){
  const ctx = document.getElementById('careerChart');
  if(!ctx) return;
  const c = getChartColors();
  const careers = EDUVERSE_DEMO.careers;
  new Chart(ctx, {
    type:'bar',
    data:{
      labels: careers.map(c=>c.name),
      datasets:[{ label:'Match %', data:careers.map(c=>c.match), backgroundColor:[c=='',''][0] || ['#4F46E5','#7C3AED','#06B6D4'], borderRadius:10, maxBarThickness:56 }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{ display:false } },
      scales:{
        y:{ min:0, max:100, grid:{color:c.grid}, ticks:{color:c.text} },
        x:{ grid:{display:false}, ticks:{color:c.text} }
      }
    }
  });
}

function initPerformanceCharts(){
  const bar = document.getElementById('subjectChart');
  if(bar){
    const c = getChartColors();
    new Chart(bar, {
      type:'bar',
      data:{
        labels:['Statistics','Python','DBMS','ML Basics','Data Structures'],
        datasets:[{ label:'Score %', data:[58,88,72,64,80], backgroundColor:['#F43F5E','#10B981','#7C3AED','#F59E0B','#10B981'], borderRadius:8 }]
      },
      options:{
        indexAxis:'y',
        plugins:{ legend:{display:false} },
        scales:{
          x:{ min:0, max:100, grid:{color:c.grid}, ticks:{color:c.text} },
          y:{ grid:{display:false}, ticks:{color:c.text} }
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboardChart();
  initCareerChart();
  initPerformanceCharts();
});

/* ---------------------------------------------------------------------- *
 * 9. Performance prediction page — "Analyze My Performance" demo action
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultBox = document.getElementById('predictionResults');
  if(analyzeBtn && resultBox){
    analyzeBtn.addEventListener('click', () => {
      resultBox.classList.remove('d-none');
      resultBox.scrollIntoView({behavior:'smooth', block:'start'});
      resultBox.querySelectorAll('.ev-progress-bar').forEach(bar=>{
        const target = bar.getAttribute('data-target');
        bar.style.width = '0%';
        requestAnimationFrame(()=> setTimeout(()=>{ bar.style.width = target + '%'; }, 80));
      });
      analyzeBtn.innerHTML = '<i class="bi bi-check2-circle me-2"></i>Analysis Complete (Demo)';
      analyzeBtn.disabled = true;
    });
  }
});

/* ---------------------------------------------------------------------- *
 * 10. Career page — "Explore Career" toggles skill detail
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.explore-career-btn').forEach(btn=>{
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('data-target'));
      if(target){
        target.classList.toggle('d-none');
        btn.innerHTML = target.classList.contains('d-none')
          ? 'Explore Career <i class="bi bi-arrow-down-short"></i>'
          : 'Hide Details <i class="bi bi-arrow-up-short"></i>';
      }
    });
  });
});

/* ---------------------------------------------------------------------- *
 * 11. Senior Blueprint — "Build My Path Like This" demo interaction
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const buildBtn = document.getElementById('buildPathBtn');
  if(buildBtn){
    buildBtn.addEventListener('click', () => {
      buildBtn.innerHTML = '<i class="bi bi-check2-circle me-2"></i>Added to My Roadmap';
      buildBtn.classList.remove('btn-ev-primary');
      buildBtn.classList.add('btn-ev-outline');
      buildBtn.disabled = true;
      const toastEl = document.getElementById('roadmapToast');
      if(toastEl && window.bootstrap){
        new bootstrap.Toast(toastEl).show();
      }
    });
  }
});

/* ---------------------------------------------------------------------- *
 * 12. Profile page — inline "edit" toggle (demo only, no persistence)
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const editBtn = document.getElementById('editProfileBtn');
  const viewFields = document.querySelectorAll('.profile-view');
  const editFields = document.querySelectorAll('.profile-edit');
  if(editBtn){
    editBtn.addEventListener('click', () => {
      const editing = editBtn.getAttribute('data-editing') === 'true';
      viewFields.forEach(f=>f.classList.toggle('d-none', !editing));
      editFields.forEach(f=>f.classList.toggle('d-none', editing));
      editBtn.setAttribute('data-editing', String(!editing));
      editBtn.innerHTML = editing
        ? '<i class="bi bi-pencil-square me-1"></i> Edit Profile'
        : '<i class="bi bi-check2-circle me-1"></i> Save Changes (Demo)';
    });
  }
});

/* ==========================================================================
   EduVerse AI — DOMAIN ASSESSMENT & PERSONALIZED ROADMAP ADD-ON
   Everything below is frontend-only demo logic. In the final product this
   will be replaced by:
     Academic Prediction   -> Random Forest Regressor
     Pass/Fail Prediction  -> Logistic Regression
     Domain Recommendation -> Random Forest Classifier
     Senior Matching       -> KNN + Cosine Similarity
     Learning DNA          -> Content-Based Recommendation
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * A. DOMAIN DATA — academic + CAT + aptitude + skills + interest per domain
 * ---------------------------------------------------------------------- */
const INTEREST_SCORE = { "Low":50, "Medium":70, "High":85, "Very High":95 };

const DOMAIN_DEMO = {
  domains: [
    {
      id:"ml", icon:"🤖", name:"Machine Learning",
      desc:"Build systems that learn patterns from data to make predictions.",
      requiredSkills:["Python","Statistics","Machine Learning","Model Evaluation"],
      cat:91, aptitude:92, programming:85, statistics:88,
      interest:"High", level:"Intermediate"
    },
    {
      id:"dl", icon:"🧠", name:"Deep Learning",
      desc:"Design neural networks for vision, language, and complex pattern tasks.",
      requiredSkills:["Python","Linear Algebra","Neural Networks","CNN/RNN"],
      cat:88, aptitude:84, programming:85, statistics:80,
      interest:"Very High", level:"Beginner"
    },
    {
      id:"ds", icon:"📊", name:"Data Science",
      desc:"Turn raw data into insight through cleaning, analysis, and modelling.",
      requiredSkills:["Python","Pandas","Statistics","EDA"],
      cat:79, aptitude:78, programming:80, statistics:82,
      interest:"Medium", level:"Beginner"
    },
    {
      id:"da", icon:"📈", name:"Data Analytics",
      desc:"Explore business data and communicate findings through dashboards.",
      requiredSkills:["Excel","SQL","Power BI","Data Visualization"],
      cat:75, aptitude:74, programming:60, statistics:70,
      interest:"Medium", level:"Beginner"
    },
    {
      id:"sd", icon:"💻", name:"Software Development",
      desc:"Design, build, and ship reliable full-stack applications.",
      requiredSkills:["Programming","Data Structures","OOP","APIs"],
      cat:80, aptitude:81, programming:88, statistics:55,
      interest:"Medium", level:"Intermediate"
    },
    {
      id:"cc", icon:"☁️", name:"Cloud Computing",
      desc:"Deploy and scale applications on cloud infrastructure.",
      requiredSkills:["Linux","Networking","AWS/Azure","Docker"],
      cat:70, aptitude:68, programming:65, statistics:50,
      interest:"Low", level:"Beginner"
    },
    {
      id:"cs", icon:"🔐", name:"Cyber Security",
      desc:"Protect systems and data from threats and vulnerabilities.",
      requiredSkills:["Networking","Security Fundamentals","Cryptography","Web Security"],
      cat:68, aptitude:65, programming:60, statistics:50,
      interest:"Low", level:"Beginner"
    },
  ],

  /* skill -> current progress %, shared across all roadmaps */
  skillProgress: {
    "Python":100, "NumPy":100, "Pandas":90, "Statistics":65, "Linear Algebra":40,
    "Data Preprocessing":60, "Supervised Learning":55, "Unsupervised Learning":30,
    "Machine Learning":70, "Model Evaluation":20, "Feature Engineering":25,
    "Neural Networks":0, "Deep Learning Fundamentals":0, "CNN":0, "RNN / LSTM":0,
    "Transformers":0, "Deep Learning Projects":0, "ML Projects":0, "Deployment":0,
    "Data Cleaning":70, "EDA":50, "Visualization":40, "Projects":0,
    "Excel":80, "SQL":75, "Power BI":20, "Tableau":10, "Data Visualization":35, "Analytics Projects":0,
    "Programming":85, "Data Structures":70, "Algorithms":60, "Git/GitHub":80,
    "OOP":75, "Backend":40, "APIs":35, "Database":50, "Full Stack Project":0,
    "Linux":60, "Networking":55, "Cloud Fundamentals":30, "AWS/Azure":20,
    "Containers":10, "Docker":10, "Kubernetes":0, "Cloud Project":0,
    "Security Fundamentals":40, "Cryptography":20, "Web Security":15,
    "Ethical Hacking Concepts":10, "Security Tools":5, "Security Projects":0,
  },

  /* domain id -> ordered skill roadmap */
  roadmaps: {
    ml: ["Python","NumPy","Pandas","Statistics","Data Preprocessing","Supervised Learning","Unsupervised Learning","Model Evaluation","Feature Engineering","ML Projects"],
    dl: ["Python","NumPy","Statistics","Linear Algebra","Machine Learning","Neural Networks","Deep Learning Fundamentals","CNN","RNN / LSTM","Transformers","Deep Learning Projects"],
    ds: ["Python","NumPy","Pandas","Statistics","Data Cleaning","EDA","Visualization","Machine Learning","Projects"],
    da: ["Excel","SQL","Statistics","Data Cleaning","Power BI","Tableau","Data Visualization","Analytics Projects"],
    sd: ["Programming","Data Structures","Algorithms","Git/GitHub","OOP","Backend","APIs","Database","Full Stack Project"],
    cc: ["Linux","Networking","Git/GitHub","Cloud Fundamentals","AWS/Azure","Containers","Docker","Kubernetes","Cloud Project"],
    cs: ["Networking","Linux","Security Fundamentals","Cryptography","Web Security","Ethical Hacking Concepts","Security Tools","Security Projects"],
  }
};

/* Weighted overall domain score = Academic(CAT) 30% + Aptitude 30% + Programming 20% + Interest 20% */
function computeDomainScore(domain){
  const interestScore = INTEREST_SCORE[domain.interest] || 60;
  const score = (domain.cat * 0.30) + (domain.aptitude * 0.30) + (domain.programming * 0.20) + (interestScore * 0.20);
  return Math.round(score);
}

function getBestDomain(){
  return DOMAIN_DEMO.domains.slice().sort((a,b)=> computeDomainScore(b) - computeDomainScore(a))[0];
}

function getSelectedDomainId(){
  return localStorage.getItem('eduverse-selected-domain') || null;
}
function setSelectedDomainId(id){
  localStorage.setItem('eduverse-selected-domain', id);
}
function getDomainById(id){
  return DOMAIN_DEMO.domains.find(d=>d.id===id);
}
function getActiveDomain(){
  const selectedId = getSelectedDomainId();
  return selectedId ? getDomainById(selectedId) : getBestDomain();
}

/* ---------------------------------------------------------------------- *
 * C. DOMAIN ASSESSMENT PAGE
 * ---------------------------------------------------------------------- */
function renderDomainAssessmentPage(){
  const grid = document.getElementById('domainGrid');
  const strengthList = document.getElementById('domainStrengthList');
  const recoBox = document.getElementById('domainRecoBox');
  const selectedBox = document.getElementById('selectedDomainBox');
  const compareBox = document.getElementById('domainCompareBox');
  if(!grid) return;

  const best = getBestDomain();
  const selectedId = getSelectedDomainId();

  /* Domain choice cards */
  grid.innerHTML = DOMAIN_DEMO.domains.map(d=>{
    const score = computeDomainScore(d);
    const isSelected = d.id === selectedId;
    return `
    <div class="col-md-6 col-lg-4">
      <div class="ev-card ev-card-pad hoverable h-100 d-flex flex-column ${isSelected ? 'border-selected' : ''}" style="${isSelected ? 'border-color:var(--ev-indigo); box-shadow:var(--shadow-lg);' : ''}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div style="font-size:1.8rem;">${d.icon}</div>
          ${d.id === best.id ? '<span class="ev-badge"><i class="bi bi-stars"></i> AI Pick</span>' : ''}
        </div>
        <h6 class="mb-1">${d.name}</h6>
        <p class="text-muted-ev small mb-2">${d.desc}</p>
        <div class="d-flex justify-content-between small mb-1"><span class="text-muted-ev">Performance</span><span class="font-mono">${score}%</span></div>
        <div class="ev-progress mb-2"><div class="ev-progress-bar" style="width:${score}%;"></div></div>
        <div class="d-flex justify-content-between small mb-3">
          <span class="text-muted-ev">Interest: <strong style="color:var(--text);">${d.interest}</strong></span>
          <span class="text-muted-ev">Level: <strong style="color:var(--text);">${d.level}</strong></span>
        </div>
        <button class="mt-auto ${isSelected ? 'btn-ev-primary' : 'btn-ev-outline'} choose-domain-btn" data-domain="${d.id}">
          ${isSelected ? '<i class="bi bi-check2-circle me-1"></i> Selected' : 'Choose This Domain'}
        </button>
      </div>
    </div>`;
  }).join('');

  /* Domain strength analysis bars */
  if(strengthList){
    strengthList.innerHTML = DOMAIN_DEMO.domains.map(d=>{
      const score = computeDomainScore(d);
      return `
      <div class="mb-3">
        <div class="d-flex justify-content-between small mb-1">
          <span>${d.icon} ${d.name}</span>
          <span class="font-mono">${score}%</span>
        </div>
        <div class="ev-progress"><div class="ev-progress-bar" style="width:${score}%;"></div></div>
      </div>`;
    }).join('');
  }

  /* AI recommendation box */
  if(recoBox){
    const bestScore = computeDomainScore(best);
    recoBox.innerHTML = `
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="ev-icon-tile" style="font-size:1.5rem;">${best.icon}</div>
        <div>
          <span class="ev-badge demo mb-1"><i class="bi bi-cpu"></i> Demo Analysis</span>
          <h5 class="mb-0">${best.name}</h5>
          <div class="text-muted-ev small">${bestScore}% Match</div>
        </div>
      </div>
      <h6 class="small text-uppercase text-muted-ev mb-2">Why this domain?</h6>
      <ul class="list-unstyled small mb-3">
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>Strong ${best.name} CAT performance (${best.cat}%)</li>
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>High aptitude score (${best.aptitude}%)</li>
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>Strong programming skills (${best.programming}%)</li>
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>${best.interest} interest in this domain</li>
      </ul>
      <a href="learning-dna.html" class="btn-ev-primary" id="exploreRoadmapBtn" data-domain="${best.id}">Explore ${best.name} Roadmap <i class="bi bi-arrow-right"></i></a>
    `;
  }

  updateDomainChoiceUI(selectedBox, compareBox);
}

function updateDomainChoiceUI(selectedBox, compareBox){
  selectedBox = selectedBox || document.getElementById('selectedDomainBox');
  compareBox = compareBox || document.getElementById('domainCompareBox');
  const selectedId = getSelectedDomainId();
  const best = getBestDomain();

  if(selectedBox){
    if(selectedId){
      const d = getDomainById(selectedId);
      selectedBox.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <div class="ev-icon-tile" style="font-size:1.5rem; background:linear-gradient(135deg,var(--ev-violet),var(--ev-cyan));">${d.icon}</div>
          <div>
            <div class="text-muted-ev small">Your Selected Domain</div>
            <h5 class="mb-0">${d.name} <span class="text-danger">❤️</span></h5>
          </div>
        </div>
        <p class="small text-muted-ev mt-3 mb-0">You selected <strong>${d.name}</strong> based on your personal interest.</p>`;
    } else {
      selectedBox.innerHTML = `<p class="text-muted-ev small mb-0"><i class="bi bi-info-circle me-1"></i>You haven't chosen a domain yet — pick one below anytime. Until then, we'll guide you using the AI-recommended domain.</p>`;
    }
  }

  if(compareBox){
    if(selectedId && selectedId !== best.id){
      const chosen = getDomainById(selectedId);
      compareBox.classList.remove('d-none');
      compareBox.innerHTML = `
        <div class="row g-3">
          <div class="col-md-6">
            <div class="ev-card ev-card-pad h-100" style="background:var(--bg-sunken); box-shadow:none;">
              <span class="text-muted-ev small text-uppercase fw-bold">AI Recommendation</span>
              <h5 class="mt-1 mb-0">${best.icon} ${best.name}</h5>
              <div class="text-muted-ev small">${computeDomainScore(best)}% Match</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="ev-card ev-card-pad h-100" style="background:var(--bg-sunken); box-shadow:none;">
              <span class="text-muted-ev small text-uppercase fw-bold">Your Choice</span>
              <h5 class="mt-1 mb-0">${chosen.icon} ${chosen.name}</h5>
              <div class="text-muted-ev small">Selected by You ❤️</div>
            </div>
          </div>
        </div>
        <p class="small text-muted-ev mt-3 mb-0">Your current performance indicates that <strong>${best.name}</strong> is your strongest domain, but you selected <strong>${chosen.name}</strong> based on your interest. EduVerse AI will build your roadmap around your choice.</p>
      `;
    } else if(compareBox) {
      compareBox.classList.add('d-none');
      compareBox.innerHTML = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderDomainAssessmentPage();
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.choose-domain-btn');
    if(btn){
      setSelectedDomainId(btn.getAttribute('data-domain'));
      renderDomainAssessmentPage();
      renderPerformanceDomainSection();
      window.scrollTo({top:0, behavior:'smooth'});
    }
    const changeBtn = e.target.closest('#changeDomainBtn');
    if(changeBtn){
      document.getElementById('domainGrid')?.scrollIntoView({behavior:'smooth'});
    }
  });
});

/* Section D (old inline aptitude quiz) removed — Aptitude Assessment now lives
   in aptitude.js (aptitude.html + aptitude-result.html), which reuses
   DOMAIN_DEMO / computeDomainScore / getBestDomain from this file. */

/* ---------------------------------------------------------------------- *
 * E. PERFORMANCE PAGE — Domain Strength & Recommended Domain section
 * ---------------------------------------------------------------------- */
function renderPerformanceDomainSection(){
  const wrap = document.getElementById('domainStrengthSection');
  if(!wrap) return;
  const best = getBestDomain();
  const bestScore = computeDomainScore(best);
  const selectedId = getSelectedDomainId();
  const active = selectedId ? getDomainById(selectedId) : null;

  /* Pull latest aptitude performance from localStorage if the student has
     taken a test via aptitude.html — falls back to demo default otherwise. */
  let aptitudeDisplay = 86;
  try{
    const history = JSON.parse(localStorage.getItem('eduverse-aptitude-history') || '[]');
    if(history.length){ aptitudeDisplay = history[history.length - 1].percentage; }
  } catch(e){ /* ignore malformed storage */ }

  wrap.innerHTML = `
    <div class="row g-3 mb-3">
      <div class="col-6 col-md-3 text-center">
        <div class="ev-stat-value" style="font-size:1.5rem;">82%</div>
        <div class="text-muted-ev small">Academic Performance</div>
      </div>
      <div class="col-6 col-md-3 text-center">
        <div class="ev-stat-value" style="font-size:1.5rem;">${aptitudeDisplay}%</div>
        <div class="text-muted-ev small">Aptitude Performance</div>
      </div>
      <div class="col-6 col-md-3 text-center">
        <div class="ev-stat-value" style="font-size:1.5rem;">81%</div>
        <div class="text-muted-ev small">Technical Skill Score</div>
      </div>
      <div class="col-6 col-md-3 text-center">
        <div class="ev-stat-value" style="font-size:1.5rem;">${bestScore}%</div>
        <div class="text-muted-ev small">Domain Strength — ${best.name}</div>
      </div>
    </div>
    <div class="ev-card ev-card-pad" style="background:var(--bg-sunken); box-shadow:none;">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div class="d-flex align-items-center gap-3">
          <div class="ev-icon-tile" style="font-size:1.3rem;">${best.icon}</div>
          <div>
            <span class="ev-badge demo mb-1"><i class="bi bi-cpu"></i> Demo Analysis</span>
            <h6 class="mb-0">Recommended Domain: ${best.name}</h6>
            <div class="text-muted-ev small">${bestScore}% Match ${active && active.id !== best.id ? `· You selected ${active.icon} ${active.name}` : ''}</div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <a href="aptitude.html" class="btn-ev-outline btn-sm">Take Aptitude Test</a>
          <a href="domain-assessment.html" class="btn-ev-outline">View Personalized Roadmap</a>
        </div>
      </div>
    </div>
  `;
}
document.addEventListener('DOMContentLoaded', renderPerformanceDomainSection);

/* ---------------------------------------------------------------------- *
 * E-2. DASHBOARD — Aptitude summary card (reads eduverse-aptitude-history)
 * ---------------------------------------------------------------------- */
function renderDashboardAptitudeCard(){
  const box = document.getElementById('dashboardAptitudeCard');
  if(!box) return;
  let history = [];
  try { history = JSON.parse(localStorage.getItem('eduverse-aptitude-history') || '[]'); } catch(e){}

  if(!history.length){
    box.innerHTML = `
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="d-flex align-items-center gap-3">
          <div class="ev-icon-tile"><i class="bi bi-patch-question"></i></div>
          <div>
            <h6 class="mb-1">🧠 Aptitude</h6>
            <p class="text-muted-ev small mb-0">You haven't taken an aptitude test yet — see how you stack up.</p>
          </div>
        </div>
        <a href="aptitude.html" class="btn-ev-primary">Take Aptitude Test</a>
      </div>`;
    return;
  }

  const latest = history[history.length - 1];
  const avgAccuracy = Math.round(history.reduce((s,a)=>s + a.percentage, 0) / history.length);
  const topicWins = {};
  history.forEach(a => a.strongAreas.forEach(t => topicWins[t] = (topicWins[t]||0) + 1));
  const strongest = Object.entries(topicWins).sort((a,b)=>b[1]-a[1])[0];

  box.innerHTML = `
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="ev-icon-tile"><i class="bi bi-patch-question"></i></div>
        <div>
          <h6 class="mb-1">🧠 Aptitude</h6>
          <div class="d-flex flex-wrap gap-3">
            <span class="small text-muted-ev">Latest Score: <strong class="font-mono" style="color:var(--text);">${latest.percentage}%</strong></span>
            <span class="small text-muted-ev">Tests Completed: <strong class="font-mono" style="color:var(--text);">${history.length}</strong></span>
            <span class="small text-muted-ev">Accuracy: <strong class="font-mono" style="color:var(--text);">${avgAccuracy}%</strong></span>
            <span class="small text-muted-ev">Strongest Area: <strong style="color:var(--text);">${strongest ? strongest[0] : '—'}</strong></span>
          </div>
        </div>
      </div>
      <a href="aptitude.html" class="btn-ev-outline">Take Aptitude Test</a>
    </div>`;
}
document.addEventListener('DOMContentLoaded', renderDashboardAptitudeCard);

/* ---------------------------------------------------------------------- *
 * E-3. PROFILE — Aptitude + domain summary block
 * ---------------------------------------------------------------------- */
function renderProfileAptitudeBox(){
  const box = document.getElementById('profileAptitudeBox');
  if(!box) return;
  let history = [];
  try { history = JSON.parse(localStorage.getItem('eduverse-aptitude-history') || '[]'); } catch(e){}

  const best = getBestDomain();
  const selectedId = getSelectedDomainId();
  const selected = selectedId ? getDomainById(selectedId) : null;

  if(!history.length){
    box.innerHTML = `
      <h6 class="mb-2"><i class="bi bi-patch-question me-2"></i>Aptitude &amp; Domain</h6>
      <p class="text-muted-ev small mb-2">No aptitude tests taken yet.</p>
      <a href="aptitude.html" class="small fw-semibold" style="color:var(--ev-indigo);">Take your first aptitude test <i class="bi bi-arrow-right"></i></a>`;
    return;
  }

  const latest = history[history.length - 1];
  const topicWins = {}, topicLosses = {};
  history.forEach(a=>{
    a.strongAreas.forEach(t => topicWins[t] = (topicWins[t]||0)+1);
    a.weakAreas.forEach(t => topicLosses[t] = (topicLosses[t]||0)+1);
  });
  const strongest = Object.entries(topicWins).sort((a,b)=>b[1]-a[1])[0];
  const weakest = Object.entries(topicLosses).sort((a,b)=>b[1]-a[1])[0];

  box.innerHTML = `
    <h6 class="mb-3"><i class="bi bi-patch-question me-2"></i>Aptitude &amp; Domain</h6>
    <div class="row g-3">
      <div class="col-6 col-md-3">
        <div class="text-muted-ev small">Aptitude Score</div>
        <div class="fw-semibold font-mono">${latest.percentage}%</div>
      </div>
      <div class="col-6 col-md-3">
        <div class="text-muted-ev small">Strong Area</div>
        <div class="fw-semibold">${strongest ? strongest[0] : '—'}</div>
      </div>
      <div class="col-6 col-md-3">
        <div class="text-muted-ev small">Weak Area</div>
        <div class="fw-semibold">${weakest ? weakest[0] : '—'}</div>
      </div>
      <div class="col-6 col-md-3">
        <div class="text-muted-ev small">Recommended Domain</div>
        <div class="fw-semibold">${best.icon} ${best.name}</div>
      </div>
    </div>
    ${selected ? `<div class="mt-3 small text-muted-ev">Selected Domain: <strong style="color:var(--text);">${selected.icon} ${selected.name}</strong></div>` : ''}
  `;
}
document.addEventListener('DOMContentLoaded', renderProfileAptitudeBox);

/* ---------------------------------------------------------------------- *
 * F. LEARNING DNA — dynamic, domain-aware roadmap
 * ---------------------------------------------------------------------- */
function renderDynamicLearningDna(){
  const wrap = document.getElementById('dynamicDnaTrack');
  if(!wrap) return;
  const domain = getActiveDomain();
  const skills = DOMAIN_DEMO.roadmaps[domain.id];
  const domainNameEl = document.getElementById('dnaDomainName');
  const domainIconEl = document.getElementById('dnaDomainIcon');
  if(domainNameEl) domainNameEl.textContent = domain.name;
  if(domainIconEl) domainIconEl.textContent = domain.icon;

  let nextAssigned = false;
  wrap.innerHTML = skills.map(skill=>{
    const progress = DOMAIN_DEMO.skillProgress[skill] ?? 0;
    let status, statusClass, statusLabel;
    if(progress >= 100){ status='completed'; statusClass='dna-node completed'; statusLabel='Completed'; }
    else if(progress > 0 && progress < 60){ status='needs'; statusClass='dna-node progress'; statusLabel='Needs Improvement'; }
    else if(progress >= 60 && progress < 100){ status='progress'; statusClass='dna-node progress'; statusLabel='In Progress'; }
    else if(progress === 0 && !nextAssigned){ status='next'; statusClass='dna-node next'; statusLabel='Next'; nextAssigned = true; }
    else { status='future'; statusClass='dna-node'; statusLabel='Future / Locked'; }

    const chipStyle = status==='completed' ? 'ev-chip have'
      : status==='needs' ? 'ev-chip missing'
      : status==='progress' ? '' : status==='next' ? '' : '';

    return `
    <div class="${statusClass}">
      <div class="ev-card ev-card-pad" style="${status==='future' ? 'opacity:.6;' : 'background:var(--bg-sunken); box-shadow:none;'} ${status==='next' ? 'border:1.5px dashed var(--ev-indigo); background:var(--bg-elevated);' : ''}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="mb-0">${skill}</h6>
          <span class="${chipStyle || 'ev-badge'}" ${status==='needs' ? '' : ''}>${statusLabel}</span>
        </div>
        <div class="ev-progress mb-1"><div class="ev-progress-bar" style="width:${progress}%; ${status==='needs' ? 'background:var(--ev-amber);' : ''}"></div></div>
        <div class="d-flex justify-content-between small"><span class="text-muted-ev">Progress</span><span class="font-mono">${progress}%</span></div>
      </div>
    </div>`;
  }).join('');

  /* Next Best Skill card */
  const nextSkill = skills.find(s => (DOMAIN_DEMO.skillProgress[s] ?? 0) === 0)
                  || skills.find(s => (DOMAIN_DEMO.skillProgress[s] ?? 0) < 60);
  const nextBox = document.getElementById('nextBestSkillBox');
  if(nextBox && nextSkill){
    const progress = DOMAIN_DEMO.skillProgress[nextSkill] ?? 0;
    nextBox.innerHTML = `
      <span class="text-white-50 small text-uppercase fw-bold">Your Next Best Skill</span>
      <h4 class="text-white mt-1 mb-1">${nextSkill}</h4>
      <p class="text-white-50 small mb-3">Your ${domain.name} goal needs this next — current strength is only ${progress}%.</p>
      <button class="btn btn-light rounded-pill fw-bold px-3 py-2 btn-sm" id="startLearningBtn">Start Learning</button>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderDynamicLearningDna();
  document.addEventListener('click', (e)=>{
    if(e.target.closest('#startLearningBtn')){
      const btn = e.target.closest('#startLearningBtn');
      btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Added to Plan';
      btn.disabled = true;
    }
    const domainSwitch = e.target.closest('.dna-domain-switch');
    if(domainSwitch){
      setSelectedDomainId(domainSwitch.getAttribute('data-domain'));
      renderDynamicLearningDna();
      document.querySelectorAll('.dna-domain-switch').forEach(b=>b.classList.remove('active-switch'));
      domainSwitch.classList.add('active-switch');
    }
  });
});
