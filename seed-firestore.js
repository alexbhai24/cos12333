import https from 'https';

const PROJECT_ID = 'cosmicbone-dca84';
// Firebase CLI access token (from firebase-tools.json)
const TOKEN = 'ya29.a0ARGnu0avZzJcWC63KV0o-5lB2mfMER0JHAsrMj48K901WD7-8il55ZstQYKgf_V8bOLSSZ1TZ9Od52Qp6H2uS3sJE6AGjxdJWS37CtNSiGngbtp_qrDEuZvUmZtOyai5iygydVD6hsCVBwoGP0OVd9e9EIBxdZSuEnur515DfgyN73C4iI1Y2qdSp85E-FY1MCvMZvuRn3HfAAaCgYKAbsSARcSFQHGX2MiIvKA5S5RUl2HvwBrAh65ag0213';

function patch(docPath, fields) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ fields });
    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents${docPath}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const s = (v) => ({ stringValue: v });
const b = (v) => ({ booleanValue: v });
const ts = ()  => ({ timestampValue: new Date().toISOString() });

async function seed() {
  console.log(`\n🔥 Seeding Firestore → ${PROJECT_ID}\n`);

  await patch('/publicProfiles/test-user-001', {
    fullName:           s('Test Student'),
    username:           s('teststudent01'),
    photoURL:           s(''),
    bio:                s('Firestore is connected ✅'),
    gender:             s('prefer_not_to_say'),
    showGenderPublicly: b(false),
    profileEffect:      s('none'),
    createdAt:          ts(),
    updatedAt:          ts()
  });
  console.log('✅ publicProfiles/test-user-001');

  await patch('/publicRoles/test-user-001', {
    roleLabel: s('Class 12 Student')
  });
  console.log('✅ publicRoles/test-user-001');

  await patch('/adminMetrics/overview', {
    totalUsers:   { integerValue: 1 },
    activeUsers:  { integerValue: 1 },
    totalContent: { integerValue: 0 },
    updatedAt:    ts()
  });
  console.log('✅ adminMetrics/overview');

  await patch('/posts/welcome-post', {
    authorId:  s('test-user-001'),
    body:      s('Welcome to CosmicBone! 🚀 Firestore is live.'),
    createdAt: ts()
  });
  console.log('✅ posts/welcome-post');

  console.log('\n🎉 Done! Refresh the Firestore Console to see 4 collections.');
}

seed().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
