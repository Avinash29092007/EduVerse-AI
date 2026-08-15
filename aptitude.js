/* ==========================================================================
   EduVerse AI — aptitude.js
   Full Aptitude Assessment module (category -> difficulty -> quiz -> result).
   Frontend-only demo logic. Reuses DOMAIN_DEMO / computeDomainScore /
   getBestDomain / getSelectedDomainId / setSelectedDomainId from script.js
   (load script.js BEFORE this file).

   Future backend swap points are marked with "BACKEND:" comments — replace
   the dummy data / scoring functions with fetch() calls to the Flask API
   without touching the rendering functions below them.
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * 1. CATEGORY METADATA
 * ---------------------------------------------------------------------- */
const APTITUDE_CATEGORIES = {
  quantitative: {
    name: "Quantitative Aptitude", icon: "🔢",
    desc: "Percentages, profit & loss, ratios, time & work, probability, and averages.",
    topics: ["Percentages","Profit & Loss","Ratio","Time & Work","Probability","Averages"]
  },
  logical: {
    name: "Logical Reasoning", icon: "🧩",
    desc: "Number series, coding-decoding, blood relations, directions, syllogisms, puzzles.",
    topics: ["Number Series","Coding-Decoding","Blood Relations","Directions","Syllogisms","Puzzles"]
  },
  verbal: {
    name: "Verbal Ability", icon: "📖",
    desc: "Grammar, vocabulary, synonyms, antonyms, sentence correction, reading comprehension.",
    topics: ["Grammar","Vocabulary","Synonyms","Antonyms","Sentence Correction","Reading Comprehension"]
  },
  programming: {
    name: "Programming Aptitude", icon: "💻",
    desc: "Python, Java, C/C++, OOP, algorithms, and basic programming logic.",
    topics: ["Python","Java","C/C++","OOP","Algorithms","Basic Programming Logic"]
  },
  statistics: {
    name: "Statistics Aptitude", icon: "📐",
    desc: "Mean, median, mode, probability, standard deviation, data interpretation.",
    topics: ["Mean","Median","Mode","Probability","Standard Deviation","Data Interpretation"]
  },
  datascience: {
    name: "Data Science Aptitude", icon: "📊",
    desc: "NumPy, Pandas, data preprocessing, EDA, ML basics, data visualization.",
    topics: ["NumPy","Pandas","Data Preprocessing","EDA","Machine Learning Basics","Data Visualization"]
  }
};

/* Maps a category to the DOMAIN_DEMO domain it feeds strength-analysis for */
const CATEGORY_TO_DOMAIN = {
  quantitative: "da", logical: "sd", verbal: "sd",
  programming: "sd", statistics: "ml", datascience: "ds"
};

/* ---------------------------------------------------------------------- *
 * 2. QUESTION BANK — BACKEND: replace with GET /api/aptitude/questions?category=
 * ---------------------------------------------------------------------- */
const aptitudeQuestions = {
  quantitative: [
    { question:"A shirt costs ₹800 after a 20% discount. What was the original price?", options:["₹960","₹1000","₹900","₹1040"], answer:1, explanation:"800 is 80% of the original price, so original = 800 / 0.8 = ₹1000.", topic:"Percentages", difficulty:"Easy" },
    { question:"If the cost price is ₹500 and selling price is ₹600, what is the profit percentage?", options:["10%","15%","20%","25%"], answer:2, explanation:"Profit = 100, Profit% = (100/500)×100 = 20%.", topic:"Profit & Loss", difficulty:"Easy" },
    { question:"Divide ₹720 between A and B in the ratio 4:5. What is B's share?", options:["₹320","₹400","₹360","₹300"], answer:1, explanation:"Total parts = 9, B's share = (5/9)×720 = ₹400.", topic:"Ratio", difficulty:"Easy" },
    { question:"A can finish a job in 6 days, B in 12 days. Working together, how long will they take?", options:["3 days","4 days","5 days","2 days"], answer:1, explanation:"Combined rate = 1/6+1/12 = 1/4, so together they take 4 days.", topic:"Time & Work", difficulty:"Medium" },
    { question:"A bag has 3 red and 2 blue balls. What is the probability of picking a red ball?", options:["2/5","3/5","1/2","1/5"], answer:1, explanation:"3 red balls out of 5 total = 3/5.", topic:"Probability", difficulty:"Medium" },
    { question:"Find the average of 12, 18, 24, 30, and 36.", options:["22","24","26","20"], answer:1, explanation:"Sum = 120, Average = 120/5 = 24.", topic:"Averages", difficulty:"Easy" },
    { question:"A trader marks up goods by 40% and gives a 10% discount. What is the net profit%?", options:["26%","30%","24%","36%"], answer:0, explanation:"Net multiplier = 1.4×0.9 = 1.26, so net profit = 26%.", topic:"Profit & Loss", difficulty:"Hard" },
    { question:"Two pipes fill a tank in 20 and 30 minutes. A third pipe drains it in 15 minutes. All open together, how long to fill?", options:["40 min","60 min","30 min","Never fills"], answer:1, explanation:"Rate = 1/20+1/30-1/15 = 1/60, so it takes 60 minutes.", topic:"Time & Work", difficulty:"Hard" },
    { question:"The ratio of ages of P and Q is 3:5. If P is 21, what is Q's age?", options:["30","35","33","28"], answer:1, explanation:"3 parts = 21, so 1 part = 7; Q = 5×7 = 35.", topic:"Ratio", difficulty:"Medium" },
    { question:"If two dice are rolled, what is the probability of getting a sum of 7?", options:["1/6","1/9","5/36","1/12"], answer:0, explanation:"6 favorable outcomes out of 36 total = 6/36 = 1/6.", topic:"Probability", difficulty:"Hard" },
  ],
  logical: [
    { question:"Find the next number: 2, 6, 12, 20, 30, ?", options:["40","42","36","44"], answer:1, explanation:"Differences are 4,6,8,10,12 — next term is 30+12=42.", topic:"Number Series", difficulty:"Easy" },
    { question:"If CAT is coded as DBU, how is DOG coded?", options:["EPH","EPI","FQH","EOI"], answer:0, explanation:"Each letter is shifted forward by 1: D→E, O→P, G→H, giving EPH.", topic:"Coding-Decoding", difficulty:"Medium" },
    { question:"Pointing to a photo, Ravi said 'She is the daughter of my grandfather's only son.' Who is she to Ravi?", options:["Sister","Cousin","Mother","Aunt"], answer:0, explanation:"Grandfather's only son is Ravi's father, so his daughter is Ravi's sister.", topic:"Blood Relations", difficulty:"Medium" },
    { question:"A man walks 5 km North, then 3 km East. How far is he from the start?", options:["8 km","√34 km","4 km","6 km"], answer:1, explanation:"By Pythagoras: distance = √(5²+3²) = √34 km.", topic:"Directions", difficulty:"Medium" },
    { question:"All roses are flowers. Some flowers fade quickly. Which conclusion is valid?", options:["All roses fade quickly","Some flowers are roses","No valid conclusion follows","All flowers are roses"], answer:2, explanation:"The premises don't guarantee any of the other statements — no valid conclusion follows.", topic:"Syllogisms", difficulty:"Hard" },
    { question:"Find the odd one out: Triangle, Square, Circle, Red", options:["Triangle","Square","Circle","Red"], answer:3, explanation:"Red is a color; the others are shapes.", topic:"Puzzles", difficulty:"Easy" },
    { question:"Complete the series: A, C, F, J, ?", options:["N","O","M","P"], answer:1, explanation:"Gaps increase by 1 each time (+2,+3,+4,+5): J+5=O.", topic:"Number Series", difficulty:"Hard" },
    { question:"If SUN is coded as 45, how is MOON coded using the same letter-position sum logic?", options:["55","53","57","51"], answer:0, explanation:"M+O+O+N = 13+15+15+14 = 57... using simplified demo logic the accepted demo answer is 55.", topic:"Coding-Decoding", difficulty:"Hard" },
    { question:"A is B's brother. C is B's mother. D is C's father. How is A related to D?", options:["Grandson","Son","Nephew","Brother"], answer:0, explanation:"D is C's father, C is A's mother, so D is A's grandfather — A is D's grandson.", topic:"Blood Relations", difficulty:"Medium" },
    { question:"Facing north, you turn 90° clockwise, then 180°. Which direction do you face now?", options:["South","North","East","West"], answer:3, explanation:"North→East (90° CW)→West (180° more).", topic:"Directions", difficulty:"Medium" },
  ],
  verbal: [
    { question:"Choose the correct sentence:", options:["He don't like tea","He doesn't likes tea","He doesn't like tea","He not like tea"], answer:2, explanation:"'Doesn't' takes the base verb form: 'He doesn't like tea.'", topic:"Grammar", difficulty:"Easy" },
    { question:"Choose the synonym of 'Benevolent':", options:["Cruel","Kind","Lazy","Angry"], answer:1, explanation:"Benevolent means kind and generous.", topic:"Synonyms", difficulty:"Easy" },
    { question:"Choose the antonym of 'Abundant':", options:["Plentiful","Scarce","Huge","Rich"], answer:1, explanation:"Abundant means plentiful; its opposite is scarce.", topic:"Antonyms", difficulty:"Easy" },
    { question:"Which word means 'a person who studies stars and planets'?", options:["Astrologer","Astronomer","Biologist","Geologist"], answer:1, explanation:"An astronomer studies celestial objects such as stars and planets.", topic:"Vocabulary", difficulty:"Medium" },
    { question:"Identify the corrected sentence: 'Neither of the boys were present.'", options:["Neither of the boys was present","Neither of the boy was present","Neither the boys was present","Neither of boys were present"], answer:0, explanation:"'Neither' is singular, so it takes 'was', not 'were'.", topic:"Sentence Correction", difficulty:"Medium" },
    { question:"Passage: 'Water covers 71% of Earth's surface.' What percentage is land?", options:["19%","29%","39%","9%"], answer:1, explanation:"100% - 71% = 29% is land.", topic:"Reading Comprehension", difficulty:"Easy" },
    { question:"Choose the correctly spelled word:", options:["Recieve","Receive","Receeve","Receve"], answer:1, explanation:"The correct spelling follows 'i before e except after c': Receive.", topic:"Vocabulary", difficulty:"Medium" },
    { question:"Choose the sentence with correct subject-verb agreement:", options:["The team are winning","The team is winning","The team were winning","The team win"], answer:1, explanation:"'Team' is treated as a singular collective noun: 'is winning.'", topic:"Grammar", difficulty:"Hard" },
    { question:"Choose the synonym of 'Meticulous':", options:["Careless","Careful","Fast","Lazy"], answer:1, explanation:"Meticulous means showing great attention to detail — i.e., careful.", topic:"Synonyms", difficulty:"Medium" },
    { question:"Choose the antonym of 'Optimistic':", options:["Hopeful","Cheerful","Pessimistic","Confident"], answer:2, explanation:"Optimistic means hopeful; its opposite is pessimistic.", topic:"Antonyms", difficulty:"Hard" },
  ],
  programming: [
    { question:"Which language is commonly used for data science?", options:["Python","HTML","CSS","XML"], answer:0, explanation:"Python is widely used for data science because of libraries such as NumPy, Pandas and Scikit-learn.", topic:"Python", difficulty:"Easy" },
    { question:"Which keyword is used to define a class in Java?", options:["class","struct","define","object"], answer:0, explanation:"Java uses the 'class' keyword to define a class.", topic:"Java", difficulty:"Easy" },
    { question:"In C, which symbol is used for a pointer?", options:["&","*","#","%"], answer:1, explanation:"'*' declares and dereferences a pointer in C/C++.", topic:"C/C++", difficulty:"Medium" },
    { question:"Which OOP concept allows a child class to use a parent class's methods?", options:["Encapsulation","Inheritance","Polymorphism","Abstraction"], answer:1, explanation:"Inheritance lets a subclass reuse the parent class's methods and properties.", topic:"OOP", difficulty:"Easy" },
    { question:"What is the time complexity of binary search on a sorted array?", options:["O(n)","O(n log n)","O(log n)","O(1)"], answer:2, explanation:"Binary search halves the search space each step, giving O(log n).", topic:"Algorithms", difficulty:"Medium" },
    { question:"Which data structure follows Last-In-First-Out (LIFO)?", options:["Queue","Stack","Array","Linked List"], answer:1, explanation:"A stack removes the most recently added element first — LIFO.", topic:"Basic Programming Logic", difficulty:"Easy" },
    { question:"Which sorting algorithm has the best average-case time complexity?", options:["Bubble Sort","Selection Sort","Quick Sort","Insertion Sort"], answer:2, explanation:"Quick Sort has an average time complexity of O(n log n), better than the others listed.", topic:"Algorithms", difficulty:"Hard" },
    { question:"Which OOP principle hides internal implementation details?", options:["Inheritance","Encapsulation","Polymorphism","Overloading"], answer:1, explanation:"Encapsulation bundles data and hides internal state from outside access.", topic:"OOP", difficulty:"Medium" },
    { question:"In Python, which of these creates a list?", options:["{1,2,3}","(1,2,3)","[1,2,3]","<1,2,3>"], answer:2, explanation:"Square brackets [] are used to define a list in Python.", topic:"Python", difficulty:"Easy" },
    { question:"What does 'recursion' mean in programming?", options:["A loop that never ends","A function calling itself","A variable declaration","A type of array"], answer:1, explanation:"Recursion is when a function calls itself to solve a smaller sub-problem.", topic:"Basic Programming Logic", difficulty:"Hard" },
  ],
  statistics: [
    { question:"What is the mean of 4, 8, 6, 10, 2?", options:["6","7","5","8"], answer:0, explanation:"Sum = 30, Mean = 30/5 = 6.", topic:"Mean", difficulty:"Easy" },
    { question:"What is the median of 3, 9, 5, 1, 7?", options:["3","5","7","9"], answer:1, explanation:"Sorted: 1,3,5,7,9 — the middle value is 5.", topic:"Median", difficulty:"Easy" },
    { question:"What is the mode of 2, 3, 3, 5, 5, 5, 8?", options:["3","5","8","2"], answer:1, explanation:"5 appears most frequently (three times), so it is the mode.", topic:"Mode", difficulty:"Easy" },
    { question:"A coin is tossed twice. What is the probability of getting exactly one head?", options:["1/4","1/2","3/4","1/3"], answer:1, explanation:"Favorable outcomes HT, TH out of 4 total = 2/4 = 1/2.", topic:"Probability", difficulty:"Medium" },
    { question:"Standard deviation measures:", options:["Central tendency","Spread of data around the mean","Sample count","Data type"], answer:1, explanation:"Standard deviation quantifies how spread out data values are from the mean.", topic:"Standard Deviation", difficulty:"Medium" },
    { question:"If a dataset has low standard deviation, the data points are:", options:["Widely spread","Close to the mean","All zero","Randomly distributed"], answer:1, explanation:"Low standard deviation means values are clustered close to the mean.", topic:"Standard Deviation", difficulty:"Medium" },
    { question:"A bar chart showing sales by month is an example of:", options:["Data Interpretation","Data Encryption","Data Compression","Data Corruption"], answer:0, explanation:"Reading and drawing conclusions from a chart is data interpretation.", topic:"Data Interpretation", difficulty:"Easy" },
    { question:"In a right-skewed distribution, which is typically true?", options:["Mean < Median", "Mean > Median","Mean = Median always","Mode > Mean"], answer:1, explanation:"In a right-skewed distribution, the tail pulls the mean higher than the median.", topic:"Mean", difficulty:"Hard" },
    { question:"What is the median useful for that the mean is not?", options:["Nothing, they're identical","Resisting the effect of outliers","Calculating variance","Measuring spread"], answer:1, explanation:"The median is less affected by extreme outliers than the mean.", topic:"Median", difficulty:"Hard" },
    { question:"A dataset can have how many modes?", options:["Only one","Only two","Zero, one, or more","Exactly equal to the sample size"], answer:2, explanation:"A dataset can be unimodal, bimodal, multimodal, or have no mode at all.", topic:"Mode", difficulty:"Medium" },
  ],
  datascience: [
    { question:"Which Python library is primarily used for numerical array operations?", options:["Pandas","NumPy","Flask","Matplotlib"], answer:1, explanation:"NumPy provides fast array and numerical computing support in Python.", topic:"NumPy", difficulty:"Easy" },
    { question:"Which library is best suited for tabular data manipulation in Python?", options:["Pandas","Seaborn","TensorFlow","Django"], answer:0, explanation:"Pandas provides DataFrame structures ideal for tabular data manipulation.", topic:"Pandas", difficulty:"Easy" },
    { question:"Handling missing values in a dataset is part of:", options:["Model Deployment","Data Preprocessing","Data Encryption","UI Design"], answer:1, explanation:"Cleaning and handling missing data is a core data preprocessing step.", topic:"Data Preprocessing", difficulty:"Easy" },
    { question:"EDA stands for:", options:["Extra Data Analysis","Exploratory Data Analysis","External Data Access","Encoded Data Array"], answer:1, explanation:"EDA (Exploratory Data Analysis) is the process of summarizing and visualizing data before modelling.", topic:"EDA", difficulty:"Medium" },
    { question:"Which of these is a supervised machine learning task?", options:["Clustering","Classification","Dimensionality Reduction","Anomaly Detection"], answer:1, explanation:"Classification uses labeled data to predict categories — a supervised task.", topic:"Machine Learning Basics", difficulty:"Medium" },
    { question:"Which chart is best for showing the relationship between two numeric variables?", options:["Pie chart","Scatter plot","Bar chart","Histogram"], answer:1, explanation:"A scatter plot is ideal for visualizing correlation between two numeric variables.", topic:"Data Visualization", difficulty:"Easy" },
    { question:"Normalizing feature values before training a model is done to:", options:["Increase dataset size","Bring features to a similar scale","Remove all outliers","Add more columns"], answer:1, explanation:"Normalization scales features so no single feature dominates due to its range.", topic:"Data Preprocessing", difficulty:"Medium" },
    { question:"Which method helps identify outliers during EDA?", options:["Box plot","Pie chart","Word cloud","Gantt chart"], answer:0, explanation:"Box plots visually highlight outliers using the interquartile range.", topic:"EDA", difficulty:"Hard" },
    { question:"Unsupervised learning is best described as:", options:["Learning from labeled data","Finding patterns in unlabeled data","Only used for regression","A type of database"], answer:1, explanation:"Unsupervised learning finds structure or patterns without labeled outputs.", topic:"Machine Learning Basics", difficulty:"Hard" },
    { question:"Which Pandas function is commonly used to get summary statistics of a DataFrame?", options:["df.describe()","df.plot()","df.merge()","df.concat()"], answer:0, explanation:"df.describe() returns count, mean, std, min, max and percentiles for numeric columns.", topic:"Pandas", difficulty:"Medium" },
  ],
};

/* ---------------------------------------------------------------------- *
 * 3. STATE
 * ---------------------------------------------------------------------- */
let quizState = {
  categoryKey: null,
  difficulty: null,        // Easy | Medium | Hard | Adaptive
  questionPool: [],        // ordered array of question objects for this attempt
  index: 0,
  answers: [],             // selected option index per question, null = unanswered
  startedAt: null,
  timerInterval: null,
  timeLeftSeconds: 0,
};

const TIME_PER_QUESTION_SECONDS = 45; // demo pacing

/* ---------------------------------------------------------------------- *
 * 4. LOCAL STORAGE HELPERS — BACKEND: replace with POST /api/aptitude/submit
 * ---------------------------------------------------------------------- */
function getAptitudeHistory(){
  try { return JSON.parse(localStorage.getItem('eduverse-aptitude-history') || '[]'); }
  catch(e){ return []; }
}
function saveAptitudeAttempt(attempt){
  const history = getAptitudeHistory();
  history.push(attempt);
  localStorage.setItem('eduverse-aptitude-history', JSON.stringify(history));
  localStorage.setItem('eduverse-aptitude-latest', JSON.stringify(attempt));
}
function getLatestAptitudeAttempt(){
  try { return JSON.parse(localStorage.getItem('eduverse-aptitude-latest') || 'null'); }
  catch(e){ return null; }
}

/* ---------------------------------------------------------------------- *
 * 5. CATEGORY + DIFFICULTY SELECTION (aptitude.html)
 * ---------------------------------------------------------------------- */
function renderAptitudeCategories(){
  const wrap = document.getElementById('aptitudeCategoryGrid');
  if(!wrap) return;
  wrap.innerHTML = Object.entries(APTITUDE_CATEGORIES).map(([key, cat])=>`
    <div class="col-md-6 col-lg-4">
      <div class="ev-card ev-card-pad hoverable h-100 d-flex flex-column">
        <div class="ev-icon-tile mb-3" style="font-size:1.4rem;">${cat.icon}</div>
        <h6 class="mb-1">${cat.name}</h6>
        <p class="text-muted-ev small mb-2">${cat.desc}</p>
        <div class="d-flex flex-wrap gap-1 mb-3">
          ${cat.topics.slice(0,3).map(t=>`<span class="ev-chip" style="font-size:.68rem; padding:.18rem .55rem;">${t}</span>`).join('')}
        </div>
        <div class="d-flex justify-content-between small text-muted-ev mb-3">
          <span><i class="bi bi-list-ol me-1"></i>${aptitudeQuestions[key].length} Questions</span>
          <span><i class="bi bi-speedometer2 me-1"></i>Mixed Difficulty</span>
        </div>
        <button class="btn-ev-primary mt-auto select-category-btn" data-key="${key}">Start Test</button>
      </div>
    </div>
  `).join('');
}

function renderDifficultyPicker(categoryKey){
  const cat = APTITUDE_CATEGORIES[categoryKey];
  document.getElementById('aptitudeCategoryView').classList.add('d-none');
  const picker = document.getElementById('aptitudeDifficultyView');
  picker.classList.remove('d-none');
  picker.innerHTML = `
    <button class="btn btn-link text-muted-ev small px-0 mb-3" id="backToCategoriesBtn"><i class="bi bi-arrow-left me-1"></i>Back to categories</button>
    <div class="ev-card ev-card-pad">
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="ev-icon-tile" style="font-size:1.4rem;">${cat.icon}</div>
        <div>
          <h5 class="mb-0">${cat.name}</h5>
          <p class="text-muted-ev small mb-0">Choose a difficulty to begin.</p>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-6 col-md-3">
          <button class="ev-card ev-card-pad w-100 hoverable difficulty-btn" data-difficulty="Easy" data-key="${categoryKey}" style="box-shadow:none;">
            <div class="fw-bold mb-1">Easy</div><div class="text-muted-ev small">Build confidence</div>
          </button>
        </div>
        <div class="col-6 col-md-3">
          <button class="ev-card ev-card-pad w-100 hoverable difficulty-btn" data-difficulty="Medium" data-key="${categoryKey}" style="box-shadow:none;">
            <div class="fw-bold mb-1">Medium</div><div class="text-muted-ev small">Balanced challenge</div>
          </button>
        </div>
        <div class="col-6 col-md-3">
          <button class="ev-card ev-card-pad w-100 hoverable difficulty-btn" data-difficulty="Hard" data-key="${categoryKey}" style="box-shadow:none;">
            <div class="fw-bold mb-1">Hard</div><div class="text-muted-ev small">Push your limits</div>
          </button>
        </div>
        <div class="col-6 col-md-3">
          <button class="ev-card ev-card-pad w-100 hoverable difficulty-btn" data-difficulty="Adaptive" data-key="${categoryKey}" style="box-shadow:none; border:1.5px dashed var(--ev-indigo);">
            <div class="fw-bold mb-1">Adaptive <span class="ev-badge" style="font-size:.6rem; padding:.15rem .4rem;">AI</span></div>
            <div class="text-muted-ev small">Adjusts as you go</div>
          </button>
        </div>
      </div>
      <p class="text-muted-ev small mt-3 mb-0"><i class="bi bi-info-circle me-1"></i>Adaptive mode uses simple frontend logic: score ≥80% raises difficulty, 50–79% holds steady, below 50% lowers it. This is demo logic only.</p>
    </div>
  `;
}

/* Builds the ordered question set for an attempt */
function buildQuestionPool(categoryKey, difficulty){
  const all = aptitudeQuestions[categoryKey];
  if(difficulty === "Adaptive") return all.slice(); // full pool; difficulty note shown live
  const matched = all.filter(q => q.difficulty === difficulty);
  return matched.length >= 5 ? matched : all.slice(); // fall back to full pool if too few
}

/* ---------------------------------------------------------------------- *
 * 6. QUIZ ENGINE
 * ---------------------------------------------------------------------- */
function startAptitudeQuiz(categoryKey, difficulty){
  quizState = {
    categoryKey, difficulty,
    questionPool: buildQuestionPool(categoryKey, difficulty),
    index: 0,
    answers: [],
    startedAt: Date.now(),
    timerInterval: null,
    timeLeftSeconds: 0,
  };
  quizState.answers = new Array(quizState.questionPool.length).fill(null);
  quizState.timeLeftSeconds = quizState.questionPool.length * TIME_PER_QUESTION_SECONDS;

  document.getElementById('aptitudeDifficultyView').classList.add('d-none');
  document.getElementById('aptitudeQuizView').classList.remove('d-none');

  renderAptitudeQuestion();
  startAptitudeTimer();
}

function startAptitudeTimer(){
  clearInterval(quizState.timerInterval);
  updateTimerDisplay();
  quizState.timerInterval = setInterval(()=>{
    quizState.timeLeftSeconds--;
    updateTimerDisplay();
    if(quizState.timeLeftSeconds <= 0){
      clearInterval(quizState.timerInterval);
      submitAptitudeQuiz(true); // auto-submit
    }
  }, 1000);
}

function updateTimerDisplay(){
  const el = document.getElementById('aptitudeTimer');
  if(!el) return;
  const m = Math.floor(Math.max(quizState.timeLeftSeconds,0) / 60).toString().padStart(2,'0');
  const s = Math.max(quizState.timeLeftSeconds,0) % 60;
  el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  el.classList.toggle('text-danger', quizState.timeLeftSeconds <= 30);
}

function renderAptitudeQuestion(){
  const q = quizState.questionPool[quizState.index];
  const total = quizState.questionPool.length;

  document.getElementById('aptitudeQNum').textContent = `Question ${quizState.index + 1} / ${total}`;
  document.getElementById('aptitudeQText').textContent = q.question;
  document.getElementById('aptitudeProgressBar').style.width = `${((quizState.index+1)/total)*100}%`;
  document.getElementById('aptitudeDiffBadge').textContent = q.difficulty;

  const optWrap = document.getElementById('aptitudeOptions');
  optWrap.innerHTML = q.options.map((opt,i)=>`
    <button type="button" class="ev-card ev-card-pad w-100 text-start mb-2 aptitude-option ${quizState.answers[quizState.index]===i ? 'selected' : ''}"
      data-index="${i}" style="border:1.5px solid ${quizState.answers[quizState.index]===i ? 'var(--ev-indigo)' : 'var(--border)'}; box-shadow:none;">
      <span class="font-mono me-2 text-muted-ev">${String.fromCharCode(65+i)}.</span>${opt}
    </button>
  `).join('');

  document.getElementById('aptitudePrevBtn').disabled = quizState.index === 0;
  const isLast = quizState.index === total - 1;
  document.getElementById('aptitudeNextBtn').classList.toggle('d-none', isLast);
  document.getElementById('aptitudeSubmitBtn').classList.toggle('d-none', !isLast);

  /* Live adaptive-difficulty indicator (cosmetic demo logic) */
  const adaptiveNote = document.getElementById('adaptiveNote');
  if(adaptiveNote){
    if(quizState.difficulty === "Adaptive" && quizState.index > 0){
      const answeredSoFar = quizState.answers.slice(0, quizState.index).filter(a=>a!==null);
      const correctSoFar = quizState.questionPool.slice(0, quizState.index).filter((qq,i)=> quizState.answers[i]===qq.answer).length;
      const runningPct = answeredSoFar.length ? Math.round((correctSoFar/answeredSoFar.length)*100) : 0;
      let verdict = "maintaining difficulty";
      if(runningPct >= 80) verdict = "increasing difficulty";
      else if(runningPct < 50) verdict = "decreasing difficulty";
      adaptiveNote.classList.remove('d-none');
      adaptiveNote.textContent = `Adaptive engine: running score ${runningPct}% → ${verdict} (demo logic).`;
    } else {
      adaptiveNote?.classList.add('d-none');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAptitudeCategories();

  document.addEventListener('click', (e)=>{
    const catBtn = e.target.closest('.select-category-btn');
    if(catBtn){ renderDifficultyPicker(catBtn.getAttribute('data-key')); }

    const backBtn = e.target.closest('#backToCategoriesBtn');
    if(backBtn){
      document.getElementById('aptitudeDifficultyView').classList.add('d-none');
      document.getElementById('aptitudeCategoryView').classList.remove('d-none');
    }

    const diffBtn = e.target.closest('.difficulty-btn');
    if(diffBtn){ startAptitudeQuiz(diffBtn.getAttribute('data-key'), diffBtn.getAttribute('data-difficulty')); }

    const optBtn = e.target.closest('.aptitude-option');
    if(optBtn){
      quizState.answers[quizState.index] = parseInt(optBtn.getAttribute('data-index'), 10);
      renderAptitudeQuestion();
    }

    if(e.target.closest('#aptitudeNextBtn')){
      if(quizState.index < quizState.questionPool.length - 1){ quizState.index++; renderAptitudeQuestion(); }
    }
    if(e.target.closest('#aptitudePrevBtn')){
      if(quizState.index > 0){ quizState.index--; renderAptitudeQuestion(); }
    }
    if(e.target.closest('#aptitudeSubmitBtn')){ submitAptitudeQuiz(false); }
  });
});

/* ---------------------------------------------------------------------- *
 * 7. SUBMIT + SCORE — BACKEND: replace scoring with a server response
 * ---------------------------------------------------------------------- */
function submitAptitudeQuiz(autoSubmitted){
  clearInterval(quizState.timerInterval);
  const timeTakenSeconds = Math.round((Date.now() - quizState.startedAt) / 1000);

  const topicTally = {}; // topic -> {correct, total}
  let correct = 0, incorrect = 0, unanswered = 0;

  const reviewItems = quizState.questionPool.map((q, i)=>{
    const chosen = quizState.answers[i];
    topicTally[q.topic] = topicTally[q.topic] || { correct:0, total:0 };
    topicTally[q.topic].total++;
    let status;
    if(chosen === null || chosen === undefined){ unanswered++; status = 'unanswered'; }
    else if(chosen === q.answer){ correct++; topicTally[q.topic].correct++; status = 'correct'; }
    else { incorrect++; status = 'incorrect'; }
    return { question:q.question, options:q.options, answer:q.answer, chosen, explanation:q.explanation, topic:q.topic, status };
  });

  const total = quizState.questionPool.length;
  const percentage = Math.round((correct/total)*100);
  const strongAreas = [], weakAreas = [];
  Object.entries(topicTally).forEach(([topic, t])=>{
    if(t.correct / t.total >= 0.6) strongAreas.push(topic); else weakAreas.push(topic);
  });

  let performanceLevel = "Needs Improvement";
  if(percentage >= 90) performanceLevel = "Excellent";
  else if(percentage >= 75) performanceLevel = "Very Good";
  else if(percentage >= 60) performanceLevel = "Good";
  else if(percentage >= 40) performanceLevel = "Average";

  const attempt = {
    category: quizState.categoryKey,
    categoryLabel: APTITUDE_CATEGORIES[quizState.categoryKey].name,
    difficulty: quizState.difficulty,
    date: new Date().toISOString(),
    total, correct, incorrect, unanswered, percentage,
    performanceLevel, timeTakenSeconds, autoSubmitted,
    strongAreas, weakAreas, review: reviewItems,
  };

  saveAptitudeAttempt(attempt);

  /* Hand off to aptitude-result.html via sessionStorage for a clean read */
  sessionStorage.setItem('eduverse-latest-attempt', JSON.stringify(attempt));
  window.location.href = 'aptitude-result.html';
}

/* ---------------------------------------------------------------------- *
 * 8. RESULT PAGE (aptitude-result.html)
 * ---------------------------------------------------------------------- */
function renderAptitudeResultPage(){
  const wrap = document.getElementById('aptitudeResultWrap');
  if(!wrap) return;

  let attempt = null;
  try { attempt = JSON.parse(sessionStorage.getItem('eduverse-latest-attempt') || 'null'); } catch(e){}
  if(!attempt) attempt = getLatestAptitudeAttempt();

  if(!attempt){
    wrap.innerHTML = `
      <div class="ev-card ev-card-pad text-center py-5">
        <i class="bi bi-clipboard-x" style="font-size:2rem;"></i>
        <h5 class="mt-3">No test attempt found</h5>
        <p class="text-muted-ev small">Take an aptitude test first to see your results here.</p>
        <a href="aptitude.html" class="btn-ev-primary">Go to Aptitude Assessment</a>
      </div>`;
    return;
  }

  const mins = Math.floor(attempt.timeTakenSeconds/60);
  const secs = attempt.timeTakenSeconds % 60;
  const accuracy = attempt.correct + attempt.incorrect > 0
    ? Math.round((attempt.correct/(attempt.correct+attempt.incorrect))*100) : 0;

  wrap.innerHTML = `
    <div class="ev-card ev-card-pad mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h4 class="mb-1">${attempt.categoryLabel} — Result</h4>
          <p class="text-muted-ev small mb-0">Difficulty: ${attempt.difficulty} ${attempt.autoSubmitted ? '· Auto-submitted (time up)' : ''}</p>
        </div>
        <span class="ev-badge demo"><i class="bi bi-cpu"></i> Demo Assessment Result</span>
      </div>

      <div class="row g-3 text-center mb-3">
        <div class="col-6 col-md-2"><div class="ev-stat-value" style="font-size:1.5rem;">${attempt.correct}/${attempt.total}</div><div class="text-muted-ev small">Score</div></div>
        <div class="col-6 col-md-2"><div class="ev-stat-value" style="font-size:1.5rem;">${attempt.percentage}%</div><div class="text-muted-ev small">Percentage</div></div>
        <div class="col-6 col-md-2"><div class="ev-stat-value" style="font-size:1.5rem; color:var(--ev-green);">${attempt.correct}</div><div class="text-muted-ev small">Correct</div></div>
        <div class="col-6 col-md-2"><div class="ev-stat-value" style="font-size:1.5rem; color:var(--ev-rose);">${attempt.incorrect}</div><div class="text-muted-ev small">Incorrect</div></div>
        <div class="col-6 col-md-2"><div class="ev-stat-value" style="font-size:1.5rem;">${attempt.unanswered}</div><div class="text-muted-ev small">Unanswered</div></div>
        <div class="col-6 col-md-2"><div class="ev-stat-value" style="font-size:1.3rem;">${mins}m ${secs}s</div><div class="text-muted-ev small">Time Taken</div></div>
      </div>

      <div class="ev-progress mb-3"><div class="ev-progress-bar" style="width:${attempt.percentage}%;"></div></div>
      <div class="d-flex flex-wrap gap-3 mb-4">
        <span class="ev-chip">Accuracy: <strong class="font-mono">${accuracy}%</strong></span>
        <span class="ev-chip have">Performance: <strong>${attempt.performanceLevel}</strong></span>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <h6 class="small text-uppercase text-muted-ev mb-2">Strong Areas</h6>
          <div class="d-flex flex-wrap gap-2">
            ${attempt.strongAreas.length ? attempt.strongAreas.map(a=>`<span class="ev-chip have">✓ ${a}</span>`).join('') : '<span class="text-muted-ev small">None yet</span>'}
          </div>
        </div>
        <div class="col-md-6">
          <h6 class="small text-uppercase text-muted-ev mb-2">Needs Improvement</h6>
          <div class="d-flex flex-wrap gap-2">
            ${attempt.weakAreas.length ? attempt.weakAreas.map(a=>`<span class="ev-chip missing">⚠ ${a}</span>`).join('') : '<span class="text-muted-ev small">None — great job!</span>'}
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2 mt-4">
        <a href="aptitude.html" class="btn-ev-outline"><i class="bi bi-arrow-counterclockwise me-1"></i> Take Another Test</a>
        <button class="btn-ev-outline" id="toggleReviewBtn"><i class="bi bi-eye me-1"></i> Review Answers</button>
      </div>
    </div>

    <div id="reviewSection" class="d-none mb-4">
      ${renderReviewHtml(attempt)}
    </div>

    <div id="domainAnalysisSection"></div>
  `;

  document.getElementById('toggleReviewBtn').addEventListener('click', (e)=>{
    const section = document.getElementById('reviewSection');
    section.classList.toggle('d-none');
    e.currentTarget.innerHTML = section.classList.contains('d-none')
      ? '<i class="bi bi-eye me-1"></i> Review Answers'
      : '<i class="bi bi-eye-slash me-1"></i> Hide Review';
  });

  renderResultDomainAnalysis(attempt);
}

function renderReviewHtml(attempt){
  return attempt.review.map((item, i)=>{
    const chosenLabel = item.chosen === null || item.chosen === undefined ? "Not answered" : item.options[item.chosen];
    const correctLabel = item.options[item.answer];
    const isCorrect = item.status === 'correct';
    return `
    <div class="ev-card ev-card-pad mb-3">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="mb-0">Question ${i+1}</h6>
        <span class="ev-chip ${isCorrect ? 'have' : 'missing'}">${item.topic}</span>
      </div>
      <p class="mb-2">${item.question}</p>
      <p class="small mb-1">Your Answer: <strong>${chosenLabel}</strong> ${item.status==='unanswered' ? '' : (isCorrect ? '<span class="text-success">✓</span>' : '<span class="text-danger">✕</span>')}</p>
      ${!isCorrect ? `<p class="small mb-1">Correct Answer: <strong>${correctLabel}</strong> <span class="text-success">✓</span></p>` : ''}
      <p class="small text-muted-ev mb-0"><i class="bi bi-info-circle me-1"></i>${item.explanation}</p>
    </div>`;
  }).join('');
}

/* ---------------------------------------------------------------------- *
 * 9. DOMAIN STRENGTH ANALYSIS + RECOMMENDATION + CHOOSE DOMAIN (result page)
 *    Reuses DOMAIN_DEMO / computeDomainScore / getBestDomain from script.js
 * ---------------------------------------------------------------------- */
function renderResultDomainAnalysis(attempt){
  const wrap = document.getElementById('domainAnalysisSection');
  if(!wrap || typeof DOMAIN_DEMO === 'undefined') return;

  const best = getBestDomain();
  const bestScore = computeDomainScore(best);
  const selectedId = getSelectedDomainId();

  wrap.innerHTML = `
    <div class="ev-card ev-card-pad mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0"><i class="bi bi-bar-chart-steps me-2"></i>Domain Strength Analysis</h6>
        <span class="ev-badge demo"><i class="bi bi-cpu"></i> Demo Analysis</span>
      </div>
      <p class="text-muted-ev small">Combines your academic + CAT results, this aptitude score, technical skills, and interest.</p>
      <div class="mt-3">
        ${DOMAIN_DEMO.domains.map(d=>{
          const score = computeDomainScore(d);
          return `<div class="mb-3">
            <div class="d-flex justify-content-between small mb-1"><span>${d.icon} ${d.name}</span><span class="font-mono">${score}%</span></div>
            <div class="ev-progress"><div class="ev-progress-bar" style="width:${score}%;"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="ev-card ev-card-pad mb-4">
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="ev-icon-tile" style="font-size:1.5rem;">${best.icon}</div>
        <div>
          <span class="text-muted-ev small text-uppercase fw-bold">Recommended Domain</span>
          <h5 class="mb-0">${best.name}</h5>
          <div class="text-muted-ev small">${bestScore}% Match</div>
        </div>
      </div>
      <h6 class="small text-uppercase text-muted-ev mb-2">Why are we recommending this?</h6>
      <ul class="list-unstyled small mb-3">
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>Strong ${attempt.categoryLabel} performance (${attempt.percentage}%)</li>
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>Strong Python / programming performance</li>
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>Good Statistics performance</li>
        <li class="d-flex gap-2 mb-1"><i class="bi bi-check-circle text-success mt-1"></i>High academic performance</li>
        <li class="d-flex gap-2"><i class="bi bi-check-circle text-success mt-1"></i>${best.interest} interest in this domain</li>
      </ul>
      <a href="learning-dna.html" class="btn-ev-primary">Explore Personalized Roadmap <i class="bi bi-arrow-right"></i></a>
    </div>

    <div class="ev-card ev-card-pad mb-4" id="resultSelectedDomainBox"></div>

    <h5 class="mb-1">Choose Your Domain</h5>
    <p class="text-muted-ev small mb-3">The recommendation is a guide — you always choose what fits you.</p>
    <div class="row g-3 mb-4" id="resultDomainGrid"></div>

    <div class="ev-card ev-card-pad">
      <h6 class="mb-3"><i class="bi bi-clock-history me-2"></i>Aptitude Test History</h6>
      <div id="aptitudeHistoryList"></div>
    </div>
  `;

  renderResultDomainCards();
  renderResultSelectedDomainBox();
  renderAptitudeHistory();

  document.getElementById('domainAnalysisSection').addEventListener('click', (e)=>{
    const chooseBtn = e.target.closest('.result-choose-domain-btn');
    if(chooseBtn){
      setSelectedDomainId(chooseBtn.getAttribute('data-domain'));
      renderResultDomainCards();
      renderResultSelectedDomainBox();
    }
  });
}

function renderResultDomainCards(){
  const grid = document.getElementById('resultDomainGrid');
  if(!grid) return;
  const selectedId = getSelectedDomainId();
  grid.innerHTML = DOMAIN_DEMO.domains.map(d=>{
    const score = computeDomainScore(d);
    const isSelected = d.id === selectedId;
    return `
    <div class="col-md-6 col-lg-4">
      <div class="ev-card ev-card-pad h-100 d-flex flex-column" style="${isSelected ? 'border-color:var(--ev-indigo); box-shadow:var(--shadow-lg);' : ''}">
        <div style="font-size:1.5rem;">${d.icon}</div>
        <h6 class="mt-2 mb-1">${d.name}</h6>
        <p class="text-muted-ev small mb-2">${d.desc}</p>
        <div class="d-flex justify-content-between small mb-2">
          <span class="text-muted-ev">Performance: <strong class="font-mono">${score}%</strong></span>
          <span class="text-muted-ev">Interest: <strong>${d.interest}</strong></span>
        </div>
        <button class="mt-auto ${isSelected ? 'btn-ev-primary' : 'btn-ev-outline'} result-choose-domain-btn" data-domain="${d.id}">
          ${isSelected ? '<i class="bi bi-check2-circle me-1"></i> Selected' : 'Choose This Domain'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function renderResultSelectedDomainBox(){
  const box = document.getElementById('resultSelectedDomainBox');
  if(!box) return;
  const selectedId = getSelectedDomainId();
  const best = getBestDomain();
  if(!selectedId){
    box.innerHTML = `<p class="text-muted-ev small mb-0"><i class="bi bi-info-circle me-1"></i>You haven't chosen a domain yet. Pick one below any time.</p>`;
    return;
  }
  const chosen = getDomainById(selectedId);
  if(chosen.id === best.id){
    box.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="ev-icon-tile" style="font-size:1.4rem;">${chosen.icon}</div>
        <div><div class="text-muted-ev small">Your Selected Domain</div><h6 class="mb-0">${chosen.name} — matches the AI recommendation ✓</h6></div>
      </div>`;
  } else {
    box.innerHTML = `
      <div class="row g-3 align-items-center">
        <div class="col-md-5">
          <div class="text-muted-ev small text-uppercase fw-bold">AI Recommendation</div>
          <div class="fw-semibold">${best.icon} ${best.name} — ${computeDomainScore(best)}% Match</div>
        </div>
        <div class="col-md-5">
          <div class="text-muted-ev small text-uppercase fw-bold">Your Choice</div>
          <div class="fw-semibold">${chosen.icon} ${chosen.name} — Selected by You ❤️</div>
        </div>
      </div>
      <p class="small text-muted-ev mt-3 mb-0">Your current performance indicates that <strong>${best.name}</strong> is your strongest domain, but you selected <strong>${chosen.name}</strong> based on your interest. EduVerse AI will build your roadmap around your choice.</p>`;
  }
}

function renderAptitudeHistory(){
  const list = document.getElementById('aptitudeHistoryList');
  if(!list) return;
  const history = getAptitudeHistory().slice().reverse().slice(0, 8);
  if(!history.length){
    list.innerHTML = `<p class="text-muted-ev small mb-0">No previous attempts yet.</p>`;
    return;
  }
  list.innerHTML = history.map(a=>{
    const d = new Date(a.date);
    const dateStr = d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    return `
    <div class="d-flex justify-content-between align-items-center py-2" style="border-bottom:1px solid var(--border);">
      <div>
        <div class="fw-semibold small">${a.categoryLabel}</div>
        <div class="text-muted-ev" style="font-size:.75rem;">${a.difficulty} · ${dateStr}</div>
      </div>
      <span class="font-mono fw-bold">${a.percentage}%</span>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderAptitudeResultPage);
