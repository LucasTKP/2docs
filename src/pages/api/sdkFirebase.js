var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

import { getAuth } from 'firebase-admin/auth'
    if(!admin.apps.length) {
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        });
    }
export { getAuth }