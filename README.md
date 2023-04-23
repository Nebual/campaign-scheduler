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

- auto add current user to new campaigns
- [x] add Google Calendar integration setup
  - [x] show aggregated availability of all users in session
  - calendars: support whitelist vs blacklist (eg. a calendar with events indicating blocks when you're ready) 
- allow users to RSVP in a session
- poll creation: choice of times
- poll creation: choice of campaigns
