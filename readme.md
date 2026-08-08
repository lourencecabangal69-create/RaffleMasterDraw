# 🎪 Raffle Master — Ultimate Random Name Picker & Draw App

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Raffle Master** is a highly customizable, visually stunning, and interactive web application designed to make raffle draws, giveaways, and classroom pickers exciting and fair. It features multiple animated themes, sound effects, elimination modes, and a real-time live feedback chat powered by Firebase.

---

## ✨ Features

### 🎨 4 Unique Animated Themes
*   🎡 **Color Wheel:** A classic, smooth-spinning wheel of fortune.
*   🎰 **Slot Machine:** Fast-paced, mechanical reel-spinning action.
*   🎪 **Raffle Drum:** A 3D-style tumbling drum with bouncing balls.
*   🎟️ **Ticket Draw:** A suspenseful, slow-reveal ticket shuffling effect.

### 🏆 Advanced Draw Mechanics
*   **Elimination Phase:** "Survivor-style" mode to whittle down the crowd until only the target bracket remains.
*   **Top Winners & Consolation:** Draw multiple 1st, 2nd, 3rd place winners, plus unlimited consolation prizes.
*   **Prize Management:** Upload custom prize names and images for each slot. When a winner is drawn, a beautiful pop-up displays their prize!

### ⚙️ Deep Customization (Settings Panel)
*   **Audio Control:** Adjust volume and choose different sound effects for drawing (ticks, clicks, thuds) and winning (applause, fanfare, chimes).
*   **Visual Tweaks:** Change draw duration, max visible names on stage, and custom fonts/colors for the stage and winner pop-ups.
*   **Theme Overrides:** Manually tweak the Primary Accent, Secondary Accent, Background, and Surface colors.

### 💬 Live Feedback & Shoutouts
*   Real-time, multi-user chat widget powered by **Firebase Firestore**.
*   Viewers can drop messages, shoutouts, and reactions while the draw is happening live.
*   **Anti-Spam Protection:** 10-second client-side cooldowns, character limits, and server-side Firebase security rules.

### 📊 Activity Logs & Stats
*   Tracks total draws, eliminations, and site visits in real-time.

---

## 🚀 Live Demo
*(Replace this link with your actual deployed URL once hosted!)*
👉 **[Click Here to Try the Live Demo](https://your-netlify-or-vercel-link.app)**

---

## 🛠️ Tech Stack
*   **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (No frameworks, blazing fast!)
*   **Backend/Database:** Firebase Firestore (for real-time live chat)
*   **Audio Engine:** Web Audio API (Procedurally generated sound effects, no external audio files needed)
*   **Hosting:** Compatible with any static host (Netlify, Vercel, GitHub Pages)

---

## 🏁 Getting Started (Local Development)

1. **Clone or Download** this repository to your computer.
2. Locate the `Raffle-Prize-Draw.html` file.
3. Simply **double-click** the file to open it in your default web browser. No local server or installation required!

---

## 🔥 Setting up the Live Feedback (Firebase)

To enable the real-time chat widget, you need a free Firebase backend.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Click the **Web icon (`</>`)** to register a web app and copy the `firebaseConfig` object.
3. Open `Raffle-Prize-Draw.html` in a code editor (like VS Code).
4. Find the `<script type="module">` section near the bottom and replace the placeholder keys in `firebaseConfig` with your actual keys.
5. Go to **Build > Firestore Database** in Firebase, click **Create Database**, and start in **Production Mode**.
6. Go to the **Rules** tab in Firestore and paste the following to enforce anti-spam:
   ```

---

## 👁️ Guest View Mode

Share your raffle session with others while maintaining full control!

### How to Use Guest View:
1. Click the **⚙️ Settings** button in the top-right corner
2. Navigate to the **"Sharing"** tab
3. Click **"🔄 Generate New Guest Link"**
4. Click **"Copy"** to copy the guest link
5. Share the link with your audience

### Guest Permissions:
✅ **Can Do:**
- View the wheel/spinning animation in real-time
- See all winners and activity logs
- Post comments and shoutouts in Live Feedback

❌ **Cannot Do:**
- Add or remove names
- Start draws or elimination rounds
- Change settings or themes
- Delete entries

Guests access the session via a special URL parameter (`?session=ID&role=guest`) that automatically restricts their controls while keeping them engaged with the live draw!

---

## 📋 Changelog

### Version 2.0 - Latest Update
**🎉 Major Features:**
- **Guest View Mode**: Share session links with view-only access for audiences
- **Guest Commenting**: Guests can post in Live Feedback & Shoutouts
- **Anonymous Nicknames**: Auto-generates "Anonymous-1", "Anonymous-2" for users without nicknames
- **Shuffle Button**: Manually randomize the entrant list with Fisher-Yates algorithm
- **Improved Animations**: Smooth fast-to-slow deceleration for all theme spins
- **PDF Export Fix**: Downloads HTML file instead of just opening print dialog
- **Single Name Fix**: Names no longer disappear when only one is on the Color Wheel
- **Start Elimination Fix**: Button properly hides on empty lists after refresh
- **Session-Based Data Isolation**: Each user gets unique data (Option A)
- **Global Visitor Counter**: Track total visits from all users worldwide
- **Country Tracking**: Display top 10 visitor countries with flag emojis
- **Winner Details Modal**: Click winner names to view contact, address, and prize info
- **Edit Winner Details**: Update winner contact/address from the modal
- **Export to Excel**: Download winner data as CSV file
- **Enhanced Favicon Support**: Multiple sizes for all devices (16x16 to 512x512)

**🐛 Bug Fixes:**
- Fixed single name disappearing on Color Wheel theme
- Fixed PDF export opening print dialog instead of downloading
- Fixed "Start Elimination" button appearing on empty lists
- Fixed duplicate function conflicts
- Fixed new tab opening issue when adding names

**⚡ Performance Improvements:**
- Optimized spin animations with cubic-bezier easing
- Reduced Firebase read/write operations
- Improved session storage management

### Version 1.5 - Previous Updates
- Added Contact Number and Address fields for entrants
- Implemented session-based winner view tracking with "VIEWED" badges
- Added winner details modal with prize images
- Export functionality (PDF/Excel)
- Activity Logs with visit counters
- Theme customization options

### Version 1.0 - Initial Release
- 4 animated themes (Color Wheel, Slot Machine, Raffle Drum, Ticket Draw)
- Elimination phase and consolation prizes
- Live Feedback chat with Firebase
- Sound effects using Web Audio API
- Prize management with image uploads

---

## 📄 License
Free to use for personal and commercial projects. Attribution appreciated but not required.

## 🤝 Support
For issues, questions, or feature requests, please visit our [GitHub Repository](https://github.com/lourencecabangal69-create/RaffleMasterDraw).

---

Made with ❤️ by **Renz Cabangal**

```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /raffle_comments/{docId} {
         allow read: if true;
         allow create: if request.resource.data.text.size() <= 200 && 
                        request.resource.data.nickname.size() <= 20 &&
                        request.resource.data.nickname.size() > 0;
       }
     }
   }