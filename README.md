# GPlanMan
A tool for scheduling sessions of reoccurring Campaigns (eg. a game, show, D&D, social club, etc),
which helps with the task of "herding cats" into deciding on a mutually tolerable timeslot.

It helps track varying memberships, who attended when, and provides an aggregated view of each member's calendars, to help work around work/life schedules.


## Dev Getting Started

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Todo

- [x] add Google Calendar integration setup
  - [x] show aggregated availability of all users in session
  - [x] calendars: support whitelist vs blacklist (eg. a calendar with events indicating blocks when you're ready)
- sessions have duration
  - defaults to previous session of this campaign's, or 3 hours
- view "friends" calendar (outside of a session, linked from main page)
  - with filters
  - can only see session title if you're a member (otherwise its just busy)
    - which then links to the session page
- invent friends (initially just, people you share a game with)
  - filters campaign list + "friends" calendar
  - autofills names when adding to a session
- make usernames case insensitive (always lowercase except when displaying?)
- allow users to RSVP in a session
- poll creation: choice of times
- poll creation: choice of campaigns ("what should we play?")
- mark campaign as "done" (sorts to bottom? greys out?)

### Smaller Todos/Fixes
- auto add current user to new campaigns
- fix: auto save campaign name on blur, rather than clear (better for mobile)
- Adding names to a Campaign sometimes adds an empty one
