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
