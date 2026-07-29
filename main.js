// Main Application Logic

let currentRoomId = null;
let lastCommentTime = 0;
const COOLDOWN_MS = 3000;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 [MAIN] App initialized');
  
  // Generate room ID if not exists
  currentRoomId = sessionStorage.getItem('raffle_room_id') || makeId();
  sessionStorage.setItem('raffle_room_id', currentRoomId);
  
  console.log('🟢 [MAIN] Room ID:', currentRoomId);
  
  // Setup event listeners
  setupEventListeners();
});

function setupEventListeners() {
  // Screen share button
  const shareBtn = document.getElementById('start-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      try {
        await startScreenShare(currentRoomId);
      } catch (err) {
        console.error('Failed to start sharing:', err);
      }
    });
  }
  
  // Copy link button
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const guestUrl = `${window.location.origin}/guest.html?room=${currentRoomId}&guest=${makeId()}`;
      navigator.clipboard.writeText(guestUrl).then(() => {
        showToast('✅ Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('❌ Failed to copy link');
      });
    });
  }
  
  // Feedback submit
  const feedbackSubmit = document.getElementById('feedback-submit');
  if (feedbackSubmit) {
    feedbackSubmit.addEventListener('click', handleFeedbackSubmit);
  }
}

async function handleFeedbackSubmit() {
  const nicknameInput = document.getElementById('feedback-nickname');
  const textInput = document.getElementById('feedback-text');
  const submitBtn = document.getElementById('feedback-submit');
  const cooldownMsg = document.getElementById('feedback-cooldown');
  
  let nickname = nicknameInput.value.trim();
  const text = textInput.value.trim();
  
  // Auto-generate anonymous nickname
  if (!nickname) {
    const anonCount = parseInt(localStorage.getItem('anon_comment_count') || '0') + 1;
    nickname = `Anonymous-${anonCount}`;
    localStorage.setItem('anon_comment_count', anonCount.toString());
    nicknameInput.value = nickname;
  }
  
  if (!text) {
    alert('Please enter a comment.');
    return;
  }
  
  // Cooldown check
  const now = Date.now();
  if (now - lastCommentTime < COOLDOWN_MS) {
    if (cooldownMsg) cooldownMsg.style.display = 'block';
    return;
  }
  
  if (cooldownMsg) cooldownMsg.style.display = 'none';
  
  // Save nickname
  localStorage.setItem('raffle_nickname', nickname);
  
  // Disable button
  submitBtn.disabled = true;
  lastCommentTime = now;
  setTimeout(() => { submitBtn.disabled = false; }, COOLDOWN_MS);
  
  // Add to Firestore
  try {
    await db.collection('rooms').doc(currentRoomId).collection('comments').add({
      text: text,
      nickname: nickname,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    textInput.value = '';
    showToast('✅ Comment sent!');
  } catch (err) {
    console.error('Error posting comment:', err);
    alert('Failed to send message.');
    submitBtn.disabled = false;
  }
}

console.log('🟢 [MAIN] Main script loaded');
