# Quick Reference - Cleanup Command

## 🎯 One-Line Quick Start

```bash
cd backend && node cleanup-old-collections.js
```

Then type: **`YES`**

---

## ⚡ What It Does

Deletes 4 old duplicate MongoDB collections:
- ❌ `student` → ✅ Keep `learner`
- ❌ `teacher` → ✅ Keep `faculty`
- ❌ `subject` → ✅ Keep `module`
- ❌ `sclass` → ✅ Keep `program`

---

## 📋 Step-by-Step

```bash
# 1. Make sure backend is running
cd backend
npm start
# Wait for: "Server started at port no. 5000"

# 2. Open new terminal, run cleanup
cd backend
node cleanup-old-collections.js

# 3. Review the collections to be deleted
# 4. Type: YES (capital letters)

# 5. Done! ✅ Cleanup completed successfully!
```

---

## ⚠️ Before You Start

**BACKUP YOUR DATABASE FIRST!**

In MongoDB Atlas:
1. Go to your cluster
2. Click "Backup" 
3. Click "Create Backup"
4. Wait for completion
5. Then run cleanup

---

## 🚨 If Something Goes Wrong

**Restore from MongoDB Atlas backup:**
1. Go to Backups in MongoDB Atlas
2. Click "Restore" 
3. Choose "restore to a new database"
4. Copy data back

---

## ✅ After Cleanup - Test Your App

```bash
# 1. Ensure backend still running (it should be)
# 2. Check frontend running on port 3001
# 3. Test login:
#    - Admin: admin@test.com / password123
#    - Learner: L001 / John Learner / password123
#    - Faculty: professor@test.com / password123
# 4. Verify dashboards load
```

---

## 📊 Verification

After cleanup, you should see:

```
✅ Deleted: student
✅ Deleted: teacher
✅ Deleted: subject
✅ Deleted: sclass

🎉 Deleted 4 old collection(s)!

📋 Remaining Collections in Database:
   • admin
   • announcement
   • assessment
   • calendar
   • enrollment
   • faculty       ← NEW SYSTEM
   • feedback
   • institution
   • learner       ← NEW SYSTEM
   • module        ← NEW SYSTEM
   • notice
   • program       ← NEW SYSTEM

✅ Cleanup completed successfully!
```

---

## 💾 Data Safety Guarantee

✅ **No Data Loss** - All your user data moved to new collections
✅ **Instant** - Takes milliseconds
✅ **Reversible** - Restore from backup if needed
✅ **Safe** - Confirmation required before deletion

---

**Your database will be clean and consolidated!** 🎉
