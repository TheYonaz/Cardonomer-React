const { generateUserPassword } = require("../users/helpers/bcrypt");

const normalizeUser = require("../users/helpers/normalizeUser");

const User = require("../users/models/mongoDB/User");
const lodash = require("lodash");

const chalk = require("chalk");

const data = require("./initialData.json");

const registerValidation = require("../users/models/JOI/registerValidation");
const normalizeUserToFriends = require("../users/helpers/normalizeUserToFriends");
const pokemonData = require("./initialPkemonTCGdata.json");
const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");
const generateInitialPokemonCards = async () => {
  const { pokemonCards } = pokemonData;
  pokemonCards.forEach(async (card) => {
    try {
      const newCard = delete card._id;
      const pokeCardsToDB = new PokemonCard(card);
      await pokeCardsToDB.save();
      console.log("card uploaded succesfully");
    } catch (error) {
      console.log(error.message);
    }
  });
};

const generateInitialUsers = async () => {
  const { users } = data;

  users.forEach(async (user) => {
    try {
      const { error } = registerValidation(user);
      if (error) throw new Error(`Joi Error :${error.details[0].message}`);
      const normalizedUser = await normalizeUser(user);
      const userToDb = new User(normalizedUser);
      await userToDb.save();
      console.log(chalk.greenBright("user generated successfully"));
    } catch (error) {
      console.log(chalk.redBright(error.message));
    }
    return;
  });
};
const clearFriends = async () => {
  await User.updateMany({}, { $set: { friends: [] } });
};
const adminAllFriends = async () => {
  // Fetch the admin user
  const adminUser = await User.findOne({ isAdmin: true });
  if (!adminUser) {
    console.error("Admin user not found!");
    return;
  }

  // Fetch all users excluding the admin
  const potentialFriends = await User.find({ isAdmin: { $ne: true } });

  // Extract existing friend IDs from the admin's friend list for quick lookup
  const existingFriendIds = new Set(
    adminUser.friends.map((friend) => friend.user_id.toString())
  );

  // Loop through all potential friends
  for (let i = 0; i < potentialFriends.length; i++) {
    const friend = potentialFriends[i];
    const friendData = lodash.pick(normalizeUserToFriends(friend), [
      "name",
      "email",
      "user_id",
      "image",
    ]);

    // Check if this friend is already in the admin's friends list
    if (!existingFriendIds.has(friend._id.toString())) {
      adminUser.friends.push(friendData);
      existingFriendIds.add(friend._id.toString()); // Update the set with the new friend ID
    }
  }

  // Save the admin user with the updated friends list
  await adminUser.save();
};

const makeRandomFriends = async () => {
  const savedUsers = async (array) => {
    const usersIDS = array.map((item) => item._id.toString());
    return usersIDS;
  };
  const savedUsersFromDB = await User.find({}, { _id: 1 });
  const SavedUSERS = await savedUsers(savedUsersFromDB);

  // Check the first user for friends
  const firstUser = await User.findById(SavedUSERS[0], { friends: 1 });
  if (!firstUser || (firstUser.friends && firstUser.friends.length > 0)) {
    console.log(
      "No user found or users already have friends. Skipping friend assignment."
    );
    return;
  }

  for (let i = 0; i < SavedUSERS.length; i++) {
    const savedUser = SavedUSERS[i];
    const addFriendToUser = await User.findById(savedUser, { friends: 1 });
    const existingFriends = addFriendToUser.friends.map((f) =>
      f.user_id.toString()
    );

    // Filter out the current user and existing friends
    const potentialFriends = SavedUSERS.filter(
      (user) => user !== savedUser && !existingFriends.includes(user)
    );

    const friendCount = Math.floor(Math.random() * potentialFriends.length);

    for (let j = 0; j < friendCount; j++) {
      const randomIndex = Math.floor(Math.random() * potentialFriends.length);
      const friend = potentialFriends[randomIndex];
      const friendFromDB = await User.findById(friend, {
        _id: 1,
        image: 1,
        name: 1,
        email: 1,
      });

      let normalizedFriendFromDB = normalizeUserToFriends(friendFromDB);
      normalizedFriendFromDB = lodash.pick(normalizedFriendFromDB, [
        "name",
        "email",
        "user_id",
        "image",
      ]);

      addFriendToUser.friends.push(normalizedFriendFromDB);
      potentialFriends.splice(randomIndex, 1); // Remove the added friend from potential friends list
    }

    await addFriendToUser.save();
  }

  await adminAllFriends();
};

exports.makeRandomFriends = makeRandomFriends;
exports.generateInitialUsers = generateInitialUsers;
exports.generateInitialPokemonCards = generateInitialPokemonCards;
