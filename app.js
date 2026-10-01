// Presentation Data & Speaker Scripts matching user's exact timing
const slidesData = {
  1: {
    title: "Introduction & The Goal of Authentication",
    timing: "Minute 0:00 – 1:00 (Target: 60s)",
    script: `"Hello everyone. Today, we're going to break down how web applications handle one of their most critical functions: user authentication. At its core, authentication is about answering a single question: 'Is this user who they claim to be?' Whether you are logging into a social media platform, an e-commerce store, or a SaaS product, the underlying goal remains the same: securely verify identity, grant appropriate permissions, and protect sensitive user data from unauthorized access."`,
    coachTip: "Delivery Tip: Open with strong vocal presence. Pause for 2 seconds after asking the core question to let the audience reflect."
  },
  2: {
    title: "The Client-Side Flow (The Frontend)",
    timing: "Minute 1:00 – 2:15 (Target: 75s)",
    script: `"Let's look at what happens on the client side—the interface the user interacts with. Input Collection: The frontend presents a form capturing user credentials, typically an identifier like an email or username, alongside a password. Client-Side Validation: Before sending anything over the network, modern frontends validate inputs locally—checking that the email format is correct and required fields aren't empty. This improves user experience by reducing unnecessary network requests. Secure Transmission: When the user submits, credentials must be sent over an encrypted channel using HTTPS (TLS/SSL). This ensures that data in transit cannot be intercepted or modified by third parties."`,
    coachTip: "Delivery Tip: Point toward the interactive browser mock. Clarify that client-side validation is for UX speed, while the server enforces actual security."
  },
  3: {
    title: "The Server-Side Processing (The Backend)",
    timing: "Minute 2:15 – 3:30 (Target: 75s)",
    script: `"Once the credentials reach the backend server, the actual verification takes place. Credential Verification: The server queries its database to find the account associated with the provided username or email. Password Hashing: Crucially, secure applications never store passwords in plain text. Instead, they store a cryptographic hash—created using secure algorithms like bcrypt, Argon2, or PBKDF2 with unique salts. The server hashes the incoming password and compares it against the stored hash. Session Generation: If the hashes match, the server generates a session mechanism. In modern web architectures, this is commonly handled via Session Cookies or JSON Web Tokens (JWTs)."`,
    coachTip: "Delivery Tip: Emphasize the rule: 'Never store plain text passwords!' Click 'Regenerate Salt' to visually prove how salts prevent rainbow table attacks."
  },
  4: {
    title: "Session Persistence & Security Best Practices",
    timing: "Minute 3:30 – 4:15 (Target: 45s)",
    script: `"Once authenticated, the user shouldn't have to re-enter their password on every single page load. Token/Cookie Storage: The client stores the token or cookie securely. To defend against Cross-Site Scripting (XSS) attacks, sensitive tokens are best stored in HttpOnly cookies, which JavaScript cannot access directly. State Management: For subsequent API requests, the client automatically attaches the cookie or token header. The backend validates it to authorize access to protected routes. Expiration & Refreshing: Tokens are given limited lifespans to minimize the impact of potential compromise, often utilizing refresh tokens to seamlessly renew session state."`,
    coachTip: "Delivery Tip: Explain the HttpOnly flag clearly—it is the single best defense against malicious JS scripts stealing session tokens."
  },
  5: {
    title: "Conclusion & Q&A",
    timing: "Minute 4:15 – 5:00 (Target: 45s)",
    script: `"To summarize, a robust web login system relies on three primary pillars: Encrypted transport (HTTPS) to protect credentials in transit. Strong, salted hashing algorithms to protect stored credentials. Secure session management using properly scoped cookies or tokens to maintain identity safely across requests. Thank you everyone, I'd be happy to take any questions!"`,
    coachTip: "Delivery Tip: Reiterate the three pillars with confidence, then click any of the Q&A question chips to field attendee inquiries."
  }
};

let currentSlide = 1;
const totalSlides = 5;

// Elements
const slides = document.querySelectorAll('.slide-section');
const dotBtns = document.querySelectorAll('.dot-btn');
const slideIndicator = document.getElementById('slideIndicator');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');

// Speaker Drawer Elements
const notesDrawer = document.getElementById('speakerNotesDrawer');
const notesToggleBtn = document.getElementById('notesToggleBtn');
const notesCloseBtn = document.getElementById('notesCloseBtn');
const notesSlideTarget = document.getElementById('notesSlideTarget');
const scriptPacing = document.getElementById('scriptPacing');
const speakerVerbatim = document.getElementById('speakerVerbatim');
const speakerCoaching = document.getElementById('speakerCoaching');

// Timer Elements
const timerWidget = document.getElementById('timerWidget');
const timerDisplay = document.getElementById('timerDisplay');
const timerBar = document.getElementById('timerBar');
const timerToggleBtn = document.getElementById('timerToggleBtn');
const timerResetBtn = document.getElementById('timerResetBtn');
const iconPlay = timerToggleBtn.querySelector('.icon-play');
const iconPause = timerToggleBtn.querySelector('.icon-pause');

// Timer State
let timerSeconds = 0;
const totalPresentationSeconds = 300; // 5 minutes
let timerInterval = null;
let isTimerRunning = false;

// Slide Navigation Function
function goToSlide(slideNum) {
  if (slideNum < 1 || slideNum > totalSlides) return;
  currentSlide = slideNum;

  // Update Slides
  slides.forEach(slide => {
    slide.classList.remove('active');
    if (parseInt(slide.dataset.slide) === currentSlide) {
      slide.classList.add('active');
    }
  });

  // Update Dots
  dotBtns.forEach(dot => {
    dot.classList.remove('active');
    if (parseInt(dot.dataset.go) === currentSlide) {
      dot.classList.add('active');
    }
  });

  // Update indicator label
  slideIndicator.textContent = `Slide ${currentSlide} of ${totalSlides}`;

  // Update Speaker Notes Drawer Content
  const data = slidesData[currentSlide];
  if (data) {
    notesSlideTarget.textContent = `Slide ${currentSlide}: ${data.title}`;
    scriptPacing.textContent = `Pacing: ${data.timing}`;
    speakerVerbatim.textContent = data.script;
    speakerCoaching.innerHTML = `<strong>Coach's Tip:</strong> ${data.coachTip}`;
  }
}

// Event Listeners for Nav
prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

dotBtns.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.go));
  });
});

// Speaker Notes Toggle
function toggleSpeakerNotes() {
  notesDrawer.classList.toggle('open');
}
notesToggleBtn.addEventListener('click', toggleSpeakerNotes);
notesCloseBtn.addEventListener('click', () => notesDrawer.classList.remove('open'));

// Fullscreen Toggle
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Fullscreen error: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
  // Prevent overriding inside inputs
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  switch (e.key) {
    case 'ArrowRight':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      goToSlide(currentSlide + 1);
      break;
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault();
      goToSlide(currentSlide - 1);
      break;
    case 't':
    case 'T':
      toggleTimer();
      break;
    case 's':
    case 'S':
      toggleSpeakerNotes();
      break;
    case 'f':
    case 'F':
      fullscreenBtn.click();
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      goToSlide(parseInt(e.key));
      break;
  }
});

// ==================== TIMER LOGIC ====================
function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = `${formatTime(timerSeconds)} / 05:00`;
  const pct = Math.min((timerSeconds / totalPresentationSeconds) * 100, 100);
  timerBar.style.width = `${pct}%`;

  if (timerSeconds >= totalPresentationSeconds) {
    timerDisplay.style.color = 'var(--accent-red)';
  } else if (timerSeconds >= 270) {
    timerDisplay.style.color = 'var(--accent-amber)';
  } else {
    timerDisplay.style.color = 'var(--primary)';
  }
}

function toggleTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
  } else {
    isTimerRunning = true;
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = 0;
  iconPlay.classList.remove('hidden');
  iconPause.classList.add('hidden');
  updateTimerDisplay();
}

timerToggleBtn.addEventListener('click', toggleTimer);
timerResetBtn.addEventListener('click', resetTimer);

// ==================== SLIDE 2 INTERACTION: CLIENT VALIDATION & DEMO ====================
window.simulateClientAuth = function() {
  const email = document.getElementById('demoEmail').value;
  const pass = document.getElementById('demoPassword').value;
  const wireCode = document.getElementById('payloadCode');

  // Generate simulated random encrypted hex bytes
  const hexBytes = Array.from({ length: 12 }, () => '0x' + Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')).join(' ');

  wireCode.textContent = `# TLS 1.3 Handshake: AES-256-GCM Session Established
# Encrypted Frame Sent to https://secure.app.io/api/v1/auth/login
[CIPHERTEXT]: ${hexBytes} ... [Payload hidden from wire]
# User [${email}] credentials encrypted before leaving host.`;
};

const peekBtn = document.getElementById('peekPasswordBtn');
if (peekBtn) {
  peekBtn.addEventListener('click', () => {
    const passInput = document.getElementById('demoPassword');
    if (passInput.type === 'password') {
      passInput.type = 'text';
      peekBtn.textContent = '🙈';
    } else {
      passInput.type = 'password';
      peekBtn.textContent = '👁️';
    }
  });
}

// ==================== SLIDE 3 INTERACTION: HASH CALCULATOR & TABS ====================
// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const tabMap = {
      'hash': 'tabHash',
      'jwt': 'tabJwt',
      'token': 'tabToken'
    };
    const targetId = tabMap[btn.dataset.tab] || 'tabJwt';
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');
  });
});

window.recomputeDemoHash = function() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./';
  let randSalt = '$2b$12$';
  for (let i = 0; i < 22; i++) {
    randSalt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  let randHashBody = '';
  for (let i = 0; i < 31; i++) {
    randHashBody += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById('saltDisplay').textContent = randSalt.substring(0, 16) + '...';
  document.getElementById('hashOutput').textContent = randSalt + randHashBody;
};

// ==================== LIVE JWT PLAYGROUND LOGIC ====================
function base64UrlEncode(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  utf8Bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function computeHmacSha256(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  let binary = '';
  hashArray.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function updateJwtPlayground(tamperedSig = null) {
  const headerInput = document.getElementById('jwtHeaderInput');
  const payloadInput = document.getElementById('jwtPayloadInput');
  const secretInput = document.getElementById('jwtSecretInput');
  const encHeader = document.getElementById('jwtEncHeader');
  const encPayload = document.getElementById('jwtEncPayload');
  const encSig = document.getElementById('jwtEncSig');
  const statusBadge = document.getElementById('jwtStatusBadge');
  const alertBox = document.getElementById('jwtTamperAlert');

  if (!headerInput || !payloadInput || !secretInput) return;

  try {
    const headerStr = headerInput.value.trim();
    const payloadStr = payloadInput.value.trim();
    const secret = secretInput.value;

    // Validate JSON format
    JSON.parse(headerStr);
    JSON.parse(payloadStr);

    const b64Header = base64UrlEncode(headerStr);
    const b64Payload = base64UrlEncode(payloadStr);
    const dataToSign = `${b64Header}.${b64Payload}`;
    const legitSig = await computeHmacSha256(dataToSign, secret);

    encHeader.textContent = b64Header;
    encPayload.textContent = b64Payload;

    if (tamperedSig) {
      encSig.textContent = tamperedSig;
      statusBadge.textContent = 'TAMPER DETECTED ⚠️';
      statusBadge.className = 'jwt-status-badge invalid';
      alertBox.className = 'jwt-tamper-alert alert-danger';
      alertBox.innerHTML = `⚠️ <strong>SIGNATURE MISMATCH:</strong> Payload claims escalated role <code>"admin"</code>, but the signature does not match the server's cryptographic key! Server returns <strong>HTTP 401 / 403 Access Denied</strong>.`;
    } else {
      encSig.textContent = legitSig;
      statusBadge.textContent = 'VERIFIED ✓';
      statusBadge.className = 'jwt-status-badge valid';
      alertBox.className = 'jwt-tamper-alert';
      alertBox.innerHTML = `🛡️ <strong>Cryptographic Integrity Active:</strong> Header & Payload cryptographically signed using HMAC-SHA256 with server-side private key.`;
    }
  } catch (err) {
    statusBadge.textContent = 'JSON SYNTAX ERROR';
    statusBadge.className = 'jwt-status-badge invalid';
  }
}

// Live event listeners for JWT inputs
['jwtHeaderInput', 'jwtPayloadInput', 'jwtSecretInput'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => updateJwtPlayground());
  }
});

window.testJwtTampering = async function() {
  const payloadInput = document.getElementById('jwtPayloadInput');
  const encSig = document.getElementById('jwtEncSig');
  const oldSig = encSig.textContent; // Store original valid signature

  // Tamper: change role from user to admin
  try {
    const currentPayload = JSON.parse(payloadInput.value);
    currentPayload.role = "admin";
    currentPayload.note = "TAMPERED_WITHOUT_SECRET";
    payloadInput.value = JSON.stringify(currentPayload, null, 2);

    // Update encoded view with mismatched old signature to simulate attacker tampering!
    await updateJwtPlayground(oldSig);
  } catch (e) {
    console.error(e);
  }
};

// Initialize JWT demo
updateJwtPlayground();

// ==================== SLIDE 5 INTERACTION: Q&A CHIPS ====================
window.selectQaTopic = function(chipEl, responseText) {
  document.querySelectorAll('.qa-chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');
  const answerEl = document.getElementById('qaAnswerText');
  answerEl.textContent = responseText;
  answerEl.style.color = '#fff';
};

// Initialize First Slide & Notes
goToSlide(1);
