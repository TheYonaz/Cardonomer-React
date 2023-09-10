Cardonomer React App Overview:

The cardonomer_react_app is a comprehensive platform designed for the Trading Card Game (TCG) community. Built on the robust MERN stack, it offers a seamless experience for users to manage their card collections, interact with other community members, and stay updated with the latest in the TCG world.

Key Features:

    User Management: The platform offers a robust user management system where users can register, log in, and manage their profiles. They can also view and manage their friends, making the platform a social hub for TCG enthusiasts.
    Cart System: Users can manage their card collections through a dynamic cart system. They can add or remove cards, view their prizes, and even apply discounts.
    Pokemon TCG Integration: The platform has a dedicated section for Pokemon TCG. Users can view all available Pokemon cards, manage their decks, and even save their favorite decks for future reference.
    Posts & Social Interaction: Users can publish posts, comment on others' posts, and like or unlike posts. This feature ensures that the community stays active and engaged.
    Database Integration: The app is seamlessly integrated with MongoDB, ensuring efficient data storage and retrieval. Depending on the environment (development or production), it connects to the appropriate database instance.
    Logging & Monitoring: With the integration of morgan, all HTTP requests are logged, ensuring that any issues can be quickly identified and resolved. The use of chalk adds color-coded logging, making it easier to differentiate between various log levels.
    Cross-Platform Compatibility: The app uses cross-env to set environment variables, ensuring that it runs smoothly across different platforms.
    Security: With packages like bcryptjs for password hashing and jsonwebtoken for token-based authentication, the platform ensures that user data is secure.
    Validation: The app uses joi for data validation, ensuring that the data entering the system is consistent and adheres to the required format.
    CORS Management: The app is configured to handle Cross-Origin Resource Sharing (CORS), allowing it to interact safely with different domains.

By combining these features, the cardonomer_react_app offers a one-stop solution for TCG enthusiasts, providing them with a platform where they can manage their collections, interact with fellow enthusiasts, and stay updated with the latest trends in the TCG world.

Details:

    Name: cardonomer_react_app
    Version: 3.0.0
    Description: A TCG community application built using the MERN stack.
    Main Entry Point: server.js
    Author: Yon Vannucci
    License: ISC

Scripts:

    start:
        Purpose: Starts the application in production mode.
        Command: export || cross-env NODE_ENV=production&& node .

    test:
        Purpose: Executes the test script.
        Command: node test.js

    dev:
        Purpose: Starts the application in development mode with nodemon for hot-reloading.
        Command: export || cross-env NODE_ENV=development&& nodemon .

Dependencies:

    axios: Promise-based HTTP client for making requests.
    bcryptjs: Library for hashing and verifying passwords.
    chalk: Terminal string styling for better visibility in logs.
    config: Configuration control for different environments.
    cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
    cross-env: Script to set environment variables across platforms.
    express: Web application framework for Node.js.
    joi: Object schema validation.
    jsonwebtoken: Library to create and verify JSON Web Tokens.
    lodash: Utility library that provides modular methods for arrays, objects, and strings.
    mongoose: MongoDB object modeling tool.
    morgan: HTTP request logger middleware.
    tree: Utility to display a tree structure of directories.

Development Dependencies:

    nodemon: Utility that monitors changes in files and automatically restarts the server.

Server-side API Documentation:

Initial Setup:

This application provides a set of utility functions to initialize the database with users, their friends, and Pokémon cards.
Functions:

    generateInitialUsers(): Generates initial users from the data provided in initialData.json.
    makeRandomFriends(): Assigns random friends to each user, and all of the friends to the admin user
    generateInitialPokemonCards(): Generates initial Pokémon cards from the data provided in initialPkemonTCGdata.json.

Running the Initialization Functions:

When the application starts, it will automatically run the above functions to populate the database. This is done in the app.listen callback:

app.listen(PORT, async () => {
...
await generateInitialUsers();
await makeRandomFriends();
await generateInitialPokemonCards();
});

Recommendation:

After the initial run, it's recommended to comment out the initialization functions in the app.listen callback to avoid log spam and unnecessary database operations on subsequent starts:

app.listen(PORT, async () => {
console.log(chalk.blueBright(`Listening on: http://localhost:${PORT}`));
require("./DB/mongoDB/connectToDB");
// await generateInitialUsers();
// await makeRandomFriends();
// await generateInitialPokemonCards();
});

By commenting out these lines, the initialization functions won't run on every server start, which can help in reducing unnecessary logs and database operations.

Objects Structure:

1. Updated Cart:

+-------+--------+---------+
| index | type | remark |
+-------+--------+---------+
| \_id | object | required|
+-------+--------+---------+

2. Retrieved Decks:

+--------------+--------+---------+
| index | type | remark |
+--------------+--------+---------+
| \_id | object | required|
| pokemonDecks | array | required|
+--------------+--------+---------+

3. Attempting to save deck:

+-----------------------------+--------+---------+
| index | type | remark |
+-----------------------------+--------+---------+
| deckName | string | required|
| cards | array | required|
| cards[_id] | object | required|
| cards[name] | string | required|
| cards[subtypes] | array | optional|
| cards[nationalPokedexNumbers]| array | optional|
| cards[__v] | number | system |
+-----------------------------+--------+---------+

4. publishPost - Post from DB:

+----------------+--------+---------+
| index | type | remark |
+----------------+--------+---------+
| \_id | object | required|
| user_id | object | required|
| publisher_name | object | required|
| content | string | required|
| createdAt | date | required|
| likes | array | optional|
| comments | array | optional|
| \_\_v | number | system |
+----------------+--------+---------+

5. publishPost - Normalized Post:

+-----------------+--------+---------+
| index | type | remark |
+-----------------+--------+---------+
| post_id | object | required|
| user_id | object | required|
| name | object | optional|
| content | string | required|
| publisher_image | object | required|
| likes | array | optional|
| comments | array | optional|
+-----------------+--------+---------+

6. editUser:

+-----------------------+--------+---------+
| index | type | remark |
+-----------------------+--------+---------+
| name.first | string | required|
| name.middle | string | optional|
| name.last | string | required|
| phone | string | required|
| email | string | required|
| image.url | string | optional|
| image.alt | string | optional|
| address.state | string | optional|
| address.country | string | required|
| address.city | string | required|
| address.street | string | required|
| address.houseNumber | number | required|
| address.zip | number | optional|
| isBusiness | boolean| required|
+-----------------------+--------+---------+

7. loginUser:

+----------+--------+---------+
| index | type | remark |
+----------+--------+---------+
| email | string | required|
| password | string | required|
+----------+--------+---------+

8. registerUser:

+-----------------------------+--------+---------+
| index | type | remark |
+-----------------------------+--------+---------+
| name.first | string | required|
| name.middle | string | optional|
| name.last | string | required|
| phone | string | required|
| email | string | required|
| password | string | required|
| image.url | string | optional|
| image.alt | string | optional|
| address.state | string | optional|
| address.country | string | required|
| address.city | string | required|
| address.street | string | required|
| address.houseNumber | number | required|
| address.zip | number | optional|
| isBusiness | boolean| required|
| isAdmin | boolean| optional|
| likedPosts | array | optional|
| decks | array | required|
| publishedPosts.post_id | string | required|
| publishedPosts.createdAt | date | required|
| publishedPosts.content | string | required|
+-----------------------------+--------+---------+

9. Retrieved Cart Object:

+--------------------------+---------+---------+
| index | type | remark |
+--------------------------+---------+---------+
| \_id.images | object | optional|
| \_id.tcgplayer | object | optional|
| \_id.cardmarket | object | optional|
| \_id.\_id | ObjectId| required|
| \_id.name | string | required|
| \_id.subtypes | array | optional|
| \_id.nationalPokedexNumbers| array | optional|
| \_id.\_\_v | number | system |
+--------------------------+---------+---------+

10. Friends Data Object:

+-------------------+---------+---------+
| index | type | remark |
+-------------------+---------+---------+
| user_id | ObjectId| required|
| name.first | string | required|
| name.middle | string | optional|
| name.last | string | required|
| name.\_id | ObjectId| required|
| image.url | string | required|
| image.alt | string | required|
| image.\_id | ObjectId| required|
| email | string | required|
| \_id | ObjectId| required|
| startOfFriendship | date | required|
+-------------------+---------+---------+

11.Comment Structure

+----------------+--------+---------+
| index | type | remark |
+----------------+--------+---------+
| user_id | object | required|
| content | string | required|
| image | object | optional|
| name.first | string | required|
| name.middle | string | optional|
| name.last | string | required|
+----------------+--------+---------+

Sent comment Structure

+------------+--------+---------+
| index | type | remark |
+------------+--------+---------+
| content | string | required|
| post_id | object | required|
+------------+--------+---------+

Directory Structure Overview:

    Authentication: Located in the auth directory.
    Cart: Routes in cart/router/cartRouter.js and controller in cart/cartRestController.js.
    Pokemon Cards: Routes in cards/pokemonTCG/pokemonCardsRoutes.js, controller in cards/pokemonTCG/controllers/pokemonCardsController.js, and model in cards/pokemonTCG/mongoose/pokemonCard.js.
    User: Routes in users/routes/userRoutes.js, controller in users/usersRestController.js, and model in users/models/mongoDB/User.js.
    Posts: Routes in posts/routes/postRoutes.js, controller in posts/postController.js, and model in posts/mongoose/Post.js.

Cart API

1. Get Cart

   Endpoint: /cart/:userID
   Method: GET
   Parameters:
   userID: ID of the user whose cart you want to retrieve.
   Description: Retrieves the cart of the specified user.
   Response: Returns the cart items of the user.

2. Get Prizes

   Endpoint: /cart/prizes/:userID
   Method: GET
   Parameters:
   userID: ID of the user whose prizes you want to retrieve.
   Description: Retrieves the prizes of the specified user.
   Response: Returns the prizes of the user.

3. Add to Cart

   Endpoint: /cart/add/:userID
   Method: PUT
   Parameters:
   userID: ID of the user to whom you want to add a card.
   cardId: ID of the card you want to add (passed in the request body).
   Description: Adds a card to the cart of the specified user.
   Response: Returns the added card.

4. Remove from Cart

   Endpoint: /cart/remove/:userID
   Method: DELETE
   Parameters:
   userID: ID of the user from whose cart you want to remove a card.
   cardId: ID of the card you want to remove (passed in the request body).
   Description: Removes a card from the cart of the specified user.
   Response: Returns the updated cart.

5. Add Discount to Prizes

   Endpoint: /cart/addDiscountToPrizes/:userID
   Method: PUT
   Parameters:
   userID: ID of the user to whom you want to add a discount.
   Description: Adds a discount to the prizes of the specified user.
   Response: Confirmation message indicating the discount has been added.

6. Add All to Cart

   Endpoint: /cart/addAll/:userID
   Method: PUT
   Parameters:
   userID: ID of the user to whom you want to add multiple cards.
   cartItems: An array of card IDs you want to add (passed in the request body).
   Description: Adds multiple cards to the cart of the specified user.
   Response: Returns the added cards.

Pokemon Cards API

1. Get Cards

   Endpoint: /pokemontcg
   Method: GET
   Description: Retrieves all the Pokemon cards.
   Response: Returns a list of all Pokemon cards.

2. Save Pokemon Deck

   Endpoint: /pokemontcg/PdeckSave
   Method: PUT
   Authentication: Required
   Request Body:
   deckToSave: The deck details to save.
   Description: Saves a Pokemon deck for the authenticated user.
   Response: Returns the user with the saved deck.

3. Get Pokemon Decks

   Endpoint: /pokemontcg/pokemonDecks/:userId
   Method: GET
   Authentication: Required
   Parameters:
   userId: ID of the user whose Pokemon decks you want to retrieve.
   Description: Retrieves the Pokemon decks of the specified user.
   Response: Returns the Pokemon decks of the user.

4. Delete Deck

   Endpoint: /pokemontcg/pokemonDecks/:DeckID
   Method: DELETE
   Authentication: Required
   Parameters:
   DeckID: ID of the deck you want to delete.
   Description: Deletes a specific Pokemon deck from the authenticated user's decks.
   Response: Confirmation message indicating the deck has been deleted.

Pokemon Card Schema

The Pokemon card data is structured as follows:

    name: The name of the Pokemon card.
    subtypes: An array of subtypes for the card.
    nationalPokedexNumbers: An array of national Pokedex numbers.
    images:
        small: URL of the small image.
        large: URL of the large image.
    tcgplayer:
        url: URL to the tcgplayer site.
        updatedAt: The date when the data was last updated.
        prices: Pricing details for the card.
    cardmarket:
        url: URL to the cardmarket site.
        updatedAt: The date when the data was last updated.
        prices: Pricing details for the card.

User API

1. Register User

   Endpoint: /users/registration
   HTTP Method: POST
   Description: Registers a new user.
   Request Body:
   User details (name, phone, email, password, image, address, isBusiness, isAdmin, likedPosts, decks, publishedPosts)
   Response:
   Success: Returns the registered user's name, email, and \_id.
   Failure: Returns an error message.

2. Login User

   Endpoint: /users/login
   HTTP Method: POST
   Description: Logs in a user.
   Request Body:
   email
   password
   Response:
   Success: Returns a token.
   Failure: Returns an error message.

3. Get User

   Endpoint: /users/:userID
   HTTP Method: GET
   Description: Retrieves a user's details.
   Parameters:
   userID: ID of the user to retrieve.
   Response:
   Success: Returns user details.
   Failure: Returns an error message.

4. Get Friends

   Endpoint: /users/friends/:userID
   HTTP Method: GET
   Description: Retrieves a user's friends.
   Parameters:
   userID: ID of the user whose friends to retrieve.
   Response:
   Success: Returns a list of friends.
   Failure: Returns an error message.

5. Get All Users

   Endpoint: /users/allusers/:userID
   HTTP Method: GET
   Description: Retrieves all users (admin only).
   Parameters:
   userID: ID of the admin user making the request.
   Response:
   Success: Returns a list of all users.
   Failure: Returns an error message.

6. Edit User

   Endpoint: /users/edit/:userID
   HTTP Method: PUT
   Description: Edits a user's details.
   Parameters:
   userID: ID of the user to edit.
   Request Body:
   User details to update.
   Response:
   Success: Returns the updated user details.
   Failure: Returns an error message.

User Model

The user model is a Mongoose schema that defines the structure of a user in the database. It contains fields like name, phone, email, password, image, address, isAdmin, isBusiness, likedPosts, pokemonDecks, yugiohDecks, publishedPosts, friends, friendRequestsSent, friendRequests, cart, and prizes.
Validations

There are three main validation schemas:

    Registration Validation: Validates the data provided during user registration.
    Login Validation: Validates the data provided during user login.
    Edit Validation: Validates the data provided when editing a user.

These validations ensure that the data provided by the client meets the required format and constraints before processing.

Posts API Documentation
Controllers (postController.js):

    publishPost:
        Purpose: Publish a new post.
        Input: Post content from req.body and user ID from req.user._id.
        Output: The published post.

    addCommentToPost:
        Purpose: Add a comment to a specific post.
        Input: Post ID from req.params, comment content from req.body, and user details from req.user.
        Output: The post with the new comment.

    likePost:
        Purpose: Like or unlike a post.
        Input: Post ID from req.params and user ID from req.user.
        Output: The post with updated likes.

    getPostsOfFriends:
        Purpose: Retrieve posts of friends.
        Input: User ID from req.user.
        Output: Posts of the user and their friends.

    getPost:
        Purpose: Retrieve a specific post.
        Input: Post ID from req.params.
        Output: The specified post.

    getUserPosts:
        Purpose: Retrieve all posts of a specific user.
        Input: User ID from req.params and the requester's details from req.user.
        Output: Posts of the specified user.

    deletePost:
        Purpose: Delete a specific post.
        Input: Post ID and user ID from req.params, and the requester's details from req.user.
        Output: Success message.

Models:

    Post.js:
        Purpose: Define the schema and model for posts.
        Fields:
            name: Name of the user (first, middle, last).
            user_id: Reference to the user who created the post.
            publisher_name: Name of the publisher.
            createdAt: Date the post was created.
            content: Content of the post.
            likes: Array of users who liked the post.
            comments: Array of comments on the post.

Helpers:

    normalizePost.js:
        Purpose: Normalize the post data.
        Input: A post object.
        Output: A normalized post object.

Endpoints:

    Publish Post:
        Endpoint: /post
        Method: POST
        Description: Allows a user to publish a new post.
        Payload: Post content.
        Response: The published post.

    Add Comment to Post:
        Endpoint: /post/comment/:postId
        Method: PUT
        Description: Allows a user to add a comment to a specific post.
        Payload: Comment content.
        Response: The post with the new comment.

    Like/Unlike Post:
        Endpoint: /like/:postId
        Method: PUT
        Description: Allows a user to like or unlike a post.
        Payload: None.
        Response: The post with updated likes.

    Get Posts of Friends:
        Endpoint: /post/
        Method: GET
        Description: Retrieves posts of the user's friends.
        Payload: None.
        Response: Posts of the user and their friends.

    Get a Specific Post:
        Endpoint: /post/:postId
        Method: GET
        Description: Retrieves a specific post.
        Payload: None.
        Response: The specified post.

    Get User's Posts:
        Endpoint: /userPosts/:userId
        Method: GET
        Description: Retrieves all posts of a specific user.
        Payload: None.
        Response: Posts of the specified user.

    Delete Post:
        Endpoint: /post/:postId/:userId
        Method: DELETE
        Description: Allows a user or an admin to delete a specific post.
        Payload: None.
        Response: Success message.
