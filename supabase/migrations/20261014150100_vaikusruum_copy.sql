-- Keeps the client's name off the portfolio. On a fresh database this matches what seed.sql inserts.
update public.projects set summary = 'A website for a yoga teacher and musician. Calm on the outside, and she can change everything on it herself.', body = '## What it is

Vaikusruum is an Estonian site for kundalini yoga, soft yoga and gong sessions. It has pages for the classes, private lessons, an FAQ, contact and feedback forms, and an about page.

## The part I care about

The person running it should never need me to change a sentence. So the whole site runs off its own admin panel, where she can edit texts, photos and even the typography without touching any code. I also spent a good amount of time on SEO, so the site actually shows up when people search for it or for the teacher behind it, without any fake filler pages.' where slug = 'vaikusruum';
