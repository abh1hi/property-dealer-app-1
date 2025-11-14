const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Endpoint: loginViaPhoneAuth
exports.loginViaPhoneAuth = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const { idToken, aadhaar, email } = req.body;
  if (!idToken) return res.status(400).json({ success: false, message: 'idToken is required' });
  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) return res.status(400).json({ success: false, message: 'Valid Aadhaar is required' });

  try {
    // Verify the idToken with Firebase Auth
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;
    if (!phone) return res.status(400).json({ success: false, message: 'No phone number in token' });
    const uid = decodedToken.uid;

    // Store/update user in Firestore
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      phone,
      aadhaar,
      email: email || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.status(200).json({ success: true, uid, phone });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
});
