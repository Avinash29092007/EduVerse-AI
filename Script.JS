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
 * ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const s = EDUVERSE_DEMO.student;
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