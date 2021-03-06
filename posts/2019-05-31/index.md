# My own project management system

A spring day back in 2017 I decided that it was time to act!

I was tired of user stories being used as todo-lists; (under)estimating them, trying to share them between front-end and back-end developers, attempting to express under-the-hood work, them being ordered in irrational ways... and possibly more things that I've forgotten in the meantime.

So I did what I usually do in such situations: I tried to invent something better.

~150 hours of work and some months later it was finally in a usable state, and it had gotten a name: Tasq.

![the list of features](features-list.png)

Tasq has three concepts to understand:
- User stories: These are what you know them to be - and they must be testable and **cannot** be estimated
- Tasks: What actually has to be done/built, these **can** be estimated
- Features: Collections of tasks and user stories, and they also come with a description field

And here's how those concepts are thought to be used:
1. The project is described by creating a bunch of features and adding user stories to those features
2. A person who knows how to build stuff goes through each feature and adds all the necessary tasks (possibly with estimates)
3. As tasks get finished their states are updated accordingly
4. When all of a feature's tasks are done, it's user stories can be tested to verify that the feature is working as intended.

Tasq doesn't enforce a workflow though, so if it suits your needs, you can also create a feature with only tasks or user stories. Or you can decide not to use features at all, it's up to you.

![a feature with user stories and tasks](feature.png)
_A feature, complete with user stories and tasks_

You might wonder what has happened in the meantime? It has been more than a few months since spring 2017...

What happened was that Tasq got in a  working and stable state, but my employer decided to go with Asana, more mature, more features and all that.
Then my girlfriend got pregnant, and we had a baby boy and he's now almost a year old.

So Tasq ended up in the pool of possibly infinitely paused side project - and who am I to build a project management system afterall?

However, I do believe that Tasq's unique (I think - otherwise let me know!) approach works really well; the whole user stories, tasks, and features concept. Tasq is still my go-to-tool for running my side projects, though I'm obviously biased, and it's a project that I'm hoping to spend more time with in the future.

If you want to try it out, it's available at [www.tasq-app.com](https://www.tasq-app.com) and I'll gladly accept any feedback!

A warning: While it's working well on desktops, it's a bit rough around the edges on phones.

And I almost forgot: Here's a quick glance a the technical side of things:
 - The API is using express with a knex-based ORM connecting to a postgres DB
 - The app is built with react and redux - and stylus for CSS
 - I'm using pug templates for the emails
 - It's all hosted on heroku
