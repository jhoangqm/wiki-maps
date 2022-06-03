## User Stories

As a user, I can view the nearest (DATA), because of map

As a user, I can view other people's pins because they're shared for the public

As a user, I can save maps to a fav tabs

As an auth user, I can add/edit/remove my own pins, because if I don't want to go there anymore (custom map)

As an auth user, I can add a description and image to the pins for more information about that place

## ERD sketch

### users

- id (PK)
- username
- password
- location

### maps

- id (PK)
- owner_id (FK)
- name

### fav_maps

- id (PK)
- map_id (FK)
- user_id (FK)

### pins

- id (PK)
- owner_id (FK)
- title
- description
- location
- images

### map_pins

- id (PK)
- map_id (FK)
- pin_id (FK)

## Routes

### Requirements

"/"

- users can see a list of the available maps
- users can view a map.
  "/id: "
- authenticated users can create maps
- authenticated users can modify maps (add, edit, remove points)
- users can favourite a map
- users have profiles, indicating their favourite maps and maps they've contributed to

### Routes Sketch

// GET ROUTES

- router.get(‘/‘)
- router.get(‘/me’)
- router.get(‘/:id’)
- router.get("/:lat/:lon")
- router.get("/:id/favourited_maps")

// POST ROUTES

- router.post('/')
- router.post('/logout')
- router.post("/:map_id"

// Somehow we gotta find a way to edit the location ( I think we’re talking about the users location)

- router.patch(‘/:id’)

// DELETE ROUTES

- router.delete('/:id')
- router.delete("/:pin_id/:map_id")
