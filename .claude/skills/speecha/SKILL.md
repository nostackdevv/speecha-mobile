---
name: speecha
description: 'Product context for Speecha, an iOS app that eliminates filler words through daily recording practice. Use when discussing Speecha features, product details, competitors, marketing copy, social media content, App Store optimization, landing page content, or any question about what Speecha is and does.'
---

# Speecha — Product Context

## What is Speecha

Speecha is an iOS app that helps users eliminate filler words through consistent daily recording practice. The core premise is simple: record yourself speaking for up to one minute every day for 30 days. By doing this consistently, users develop a sharp awareness of their speaking patterns, allowing them to catch and correct filler words in everyday conversations. The website speecha.app serves as a landing page that directs users to download the app.

## Core User Flow

1. Open the app
2. Choose a practice mode — Free Practice or Pick a Prompt
3. Optionally select a prompt from a category (Interview, Presentation, Social, etc.)
4. Record speech (up to one minute, with a timer and optional prompt displayed on screen)
5. Stop recording to trigger analysis
6. View results — highlighted filler words, clarity score, stats breakdown
7. Track progress over time via streaks and stats
8. Share results on social media

## Features by Screen

### Home Tab
- Two recording modes: "Free Practice" (speak freely) and "Pick a Prompt" (guided topic)
- Prompt categories include Interview, Presentation, Social, and more, each containing individual prompts
- Displays current streak
- Shows last session preview

### Recording Screen
- Displays the selected prompt on screen (if one was chosen)
- Live recording timer
- Stop and cancel controls

### Results Screen
The flagship feature of the app, designed to be visually captivating and highly shareable.
- Full transcript with filler words highlighted in the text
- Stats: clarity score, filler count, fillers per minute, breakdown by filler type
- Clarity archetype — a label assigned based on the user's clarity score
- Audio playback of the recording
- Social media sharing of results

### Stats Tab
- Current streak and longest streak
- Weekly summary: sessions completed, average filler rate, average clarity score
- Filler breakdown over time (visualizing improvement)
- Session history list with filters (All, Prompts, Free Practice)
- Tapping a past session shows full results

### Friends Tab
- Friend list showing each friend's current streak and stats
- Add friends by username or email
- Accept or reject incoming friend requests
- Remove friends

### Profile Tab
- User info and avatar
- All-time stats: total sessions, current streak, longest streak
- Achievement badges
- Settings: notifications toggle, privacy, terms and conditions
- Logout

### Auth
- Apple Sign-In
- Google Sign-In

### Onboarding
- Feature introduction screens shown to new users

## Key Product Concepts

**Streaks:** A daily consistency system. Users build streaks by recording at least once per day. The streak resets if a day is missed. Designed to turn mindful speaking into a daily habit.

**Clarity Score:** A numerical score assigned after each recording that reflects how clearly the user spoke, based on the frequency and density of filler words detected.

**Clarity Archetypes:** Labels assigned based on a user's clarity score (e.g., a high score gets a strong archetype, a low score gets one that encourages improvement). Gives users a memorable identity tied to their performance.

**Filler Words:** The specific words and sounds Speecha detects: um, uh, like, you know, so, actually, basically, right, I mean, kind of, sort of, well, honestly, literally.

**Friends & Social:** Users can add friends and track each other's streaks and stats, creating motivation through healthy competition and mutual support.

**Shareability:** Results are designed to be visually compelling screenshots that users share on social media, showing their clarity score, filler breakdown, and archetype.

## MVP Scope

**Included:**
- All features described above
- iOS only
- Apple and Google sign-in
- Onboarding screens

**Excluded:**
- Paywall and in-app purchases
- Pricing tiers and tier-based limits
- Android
- Web app functionality (speecha.app is a landing page only)
