const User = require("../models/User");

const XP_PER_LESSON = 10;
const XP_PER_QUIZ_PASS = 20;

const BADGE_RULES = [
  { code: "first_lesson", label: "First Steps", check: (stats) => stats.totalLessonsCompleted >= 1 },
  { code: "five_lessons", label: "Getting Serious", check: (stats) => stats.totalLessonsCompleted >= 5 },
  { code: "twenty_lessons", label: "Dedicated Learner", check: (stats) => stats.totalLessonsCompleted >= 20 },
  { code: "quiz_ace", label: "Quiz Ace", check: (stats) => stats.hasPerfectQuizScore },
  { code: "streak_3", label: "3-Day Streak", check: (stats) => stats.streak >= 3 },
  { code: "streak_7", label: "7-Day Streak", check: (stats) => stats.streak >= 7 },
  { code: "streak_30", label: "30-Day Streak", check: (stats) => stats.streak >= 30 },
];

function isSameCalendarDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isYesterday(lastDate, today) {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameCalendarDay(lastDate, yesterday);
}

// Call this any time a student does something active (completes a lesson, takes a quiz)
async function updateStreak(userId) {
  const user = await User.findById(userId);
  const today = new Date();

  if (!user.lastActiveDate) {
    user.streak = 1;
  } else if (isSameCalendarDay(user.lastActiveDate, today)) {
    // Already active today — streak doesn't change
  } else if (isYesterday(user.lastActiveDate, today)) {
    user.streak += 1;
  } else {
    // Missed a day (or more) — streak resets
    user.streak = 1;
  }

  user.lastActiveDate = today;
  await user.save();
  return user;
}

async function addXP(userId, amount) {
  const user = await User.findById(userId);
  user.xp += amount;
  await user.save();
  return user;
}

// Checks all badge rules against current stats and awards any newly-earned ones.
// Returns the list of NEWLY earned badges (so the frontend can show a special toast).
async function checkAndAwardBadges(userId, statsOverrides = {}) {
  const user = await User.findById(userId);

  const stats = {
    totalLessonsCompleted: statsOverrides.totalLessonsCompleted ?? 0,
    hasPerfectQuizScore: statsOverrides.hasPerfectQuizScore ?? false,
    streak: user.streak,
  };

  const newlyEarned = [];

  for (const rule of BADGE_RULES) {
    const alreadyHas = user.badges.includes(rule.code);
    if (!alreadyHas && rule.check(stats)) {
      user.badges.push(rule.code);
      newlyEarned.push({ code: rule.code, label: rule.label });
    }
  }

  if (newlyEarned.length > 0) {
    await user.save();
  }

  return newlyEarned;
}

module.exports = {
  XP_PER_LESSON,
  XP_PER_QUIZ_PASS,
  updateStreak,
  addXP,
  checkAndAwardBadges,
};