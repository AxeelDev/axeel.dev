-- Real Casmine screenshots, captured with the game's own world-capture tool. On a fresh database this matches seed.sql.
update public.projects set
  thumbnail_url = '/projects/casmine.jpg', thumbnail_alt = 'A blocky savanna with wide, flat-topped trees under a blue sky',
  gallery = '[{"src":"/projects/casmine-2.jpg","alt":"A spruce forest, generated from a different seed"},{"src":"/projects/casmine-3.jpg","alt":"The inventory and crafting screen"}]'::jsonb, body = '## The project

Casmine is a voxel survival game I''m building in Godot. The goal is the feel of the old Xbox 360 edition of Minecraft: the light, the colours, the menus, the split-screen nights.

It''s still early. Right now it''s mostly world generation, rendering, the survival basics like crafting, and the foundations for multiplayer. Every world comes from a seed, so the forests, savannas and caves are different each time.'
where slug = 'casmine';
