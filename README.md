# N315 - Homework 08

## Jungle Cook website - Final submission.

[Web4 Link](https://in-info-web4.luddy.indianapolis.iu.edu/~hhamelin/Y4/FA25/N315/homework08/)
[Vercel Link](https://n315-homework08.vercel.app)

Final submission of the "Jungle Cook" website.  
All pages are present and functional.

Utilized Vite with hash-routing, Firebase DB, and scss styling to create a multi-page app of a jungle-themed cooking recipe website.

Firebase DB has two collections: `users` and `recipes`.  

 - `users` collection ties the users UID to an email, first name, and last name.
 - `recipes` collection contains data about each recipe, like: title, description, cook time, servings count, ingredients list, instructions list, and either an `imageUrl` or `imageBase64`.

The site is fully responsive, with a hamburger menu icon that will appear on screens with a width smaller than 1200px.

You may create a user of your own. Test user exists as well: `test@test.com`, `asdf123456`

To develop for this site you will need to install the dependencies.

`npm install`
