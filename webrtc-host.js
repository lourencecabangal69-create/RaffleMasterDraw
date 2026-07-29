// WebRTC Host Functions

let localStream = null;
let peerConnection = null;

async function startScreenShare(roomId) {
  console.log('🔵 [WEBRTC] Host starting screen share for room:', roomId);
  
  try {
    // Request screen share
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { 
        cursor: "always",
        frameRate: { ideal: 30, max: 60 },
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 }
      },
      audio: false
    });
    
    console.log('🟢 [WEBRTC] Display media obtained, tracks:', stream.getTracks().length);
    localStream = stream;
    
    // Create PeerConnection
    peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    console.log('🔵 [WEBRTC] PeerConnection created');
    
    // Add tracks
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
      console.log('🔵 [WEBRTC] Added track:', track.kind);
    });
    
    // Handle ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('🔵 [WEBRTC] ICE candidate generated');
        try {
          await db.collection('rooms').doc(roomId).collection('hostIce').add(event.candidate.toJSON());
        } catch (err) {
          console.error('Failed to send ICE candidate:', err);
        }
      }
    };
    
    // Handle connection state
    peerConnection.onconnectionstatechange = () => {
      console.log('🔵 [WEBRTC] Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        showToast('✅ Guest connected!');
      }
    };
    
    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('🔵 [WEBRTC] Local description set');
    
    // Wait for ICE gathering
    await new Promise((resolve) => {
      if (peerConnection.iceGatheringState === 'complete') {
        resolve();
      } else {
        peerConnection.onicegatheringstatechange = () => {
          if (peerConnection.iceGatheringState === 'complete') {
            console.log('🟢 [WEBRTC] ICE gathering complete');
            resolve();
          }
        };
      }
    });
    
    // Write offer to Firestore
    console.log('🔵 [WEBRTC] Writing offer to Firestore...');
    await db.collection('rooms').doc(roomId).set({
      hostActive: true,
      offer: {
        type: peerConnection.localDescription.type,
        sdp: peerConnection.localDescription.sdp
      },
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('🟢 [WEBRTC] Offer written to Firestore');
    showToast('📺 Screen sharing started! Share the guest link.');
    
    // Handle stream end
    stream.getVideoTracks()[0].onended = () => {
      console.log('🔵 [WEBRTC] Screen share stopped');
      stopScreenShare(roomId);
    };
    
    return peerConnection;
    
  } catch (err) {
    console.error('🔴 [WEBRTC] Screen share error:', err);
    showToast('❌ Failed to start screen sharing: ' + err.message);
    throw err;
  }
}

function stopScreenShare(roomId) {
  console.log('🔵 [WEBRTC] Stopping screen share');
  
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  
  db.collection('rooms').doc(roomId).update({
    hostActive: false
  }).catch(err => console.error('Failed to update room status:', err));
  
  showToast('Screen sharing stopped');
}

console.log('🟢 [WEBRTC-HOST] Host WebRTC functions loaded');
