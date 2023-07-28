const { generateUserPassword } = require("../users/helpers/bcrypt");

const normalizeUser = require("../users/helpers/normalizeUser");

const User = require("../users/models/mongoDB/User");
const lodash = require("lodash");

const chalk = require("chalk");

const data = require("./initialData.json");

const registerValidation = require("../users/models/JOI/registerValidation");
const normalizeUserToFriends = require("../users/helpers/normalizeUserToFriends");
const  pokemonData = require("./initialPkemonTCGdata.json");
const PokemonCard = require("../cards/pokemonTCG/mongoose/pokemonCard");
const generateInitialPokemonCards = async () => {
  const {pokemonCards} = pokemonData
  pokemonCards.forEach(async (card)=>{
    try{
    const newCard = delete card._id
    const pokeCardsToDB = new PokemonCard(card)
    await pokeCardsToDB.save()
    console.log("card uploaded succesfully");}catch(error){
      console.log(error.message);

    }
  })
}

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
  console.log("adminAllFriends", adminUser);

  // Fetch all users excluding the admin
  const potentialFriends = await User.find({ isAdmin: { $ne: true } });

  console.log("adminAllFriends", potentialFriends);
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
    let friendExists;
    if (adminUser && adminUser.friends) {
      friendExists = adminUser.friends.find(
        (object) => friend._id.toString() === object.user_id
      );
    }

    // If the friend is not in the admin's friends list, add them
    if (!friendExists) {
      adminUser.friends.push(friendData);
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
  await clearFriends();
  SavedUSERS.forEach(async (savedUser) => {
    // Select random users (except current one) as friends
    const potentialFriends = SavedUSERS.filter((user) => user !== savedUser);
    const friendCount = Math.floor(Math.random() * potentialFriends.length); // Random number of friends
    // console.log("friendcount", friendCount);
    for (let i = 0; i < friendCount; i++) {
      const randomIndex = Math.floor(Math.random() * potentialFriends.length);
      const friend = potentialFriends[randomIndex];
      const friendFromDB = await User.findById(friend, {
        _id: 1,
        image: 1,
        name: 1,
        email: 1,
      });
      const addFriendToUser = await User.findById(savedUser, { friends: 1 });
      let normalizedFriendFromDB = normalizeUserToFriends(friendFromDB);
      normalizedFriendFromDB = lodash.pick(normalizedFriendFromDB, [
        "name",
        "email",
        "user_id",
        "image",
      ]);
      const friendExists = addFriendToUser.friends.find(
        (object) => friendFromDB._id === object.user_id
      );
      console.log("normalizedFriendFromDB", normalizedFriendFromDB);
      if (!friendExists) addFriendToUser.friends.push(normalizedFriendFromDB);
      // console.log("addToUser", addFriendToUser);
      // console.log("friendFromDB", friendFromDB);
      // console.log("friend", friend);
      // Save the user with updated friends list
      const friendUpdatedUser = await addFriendToUser.save();
      // console.log("friendUpdatedUser", friendUpdatedUser);
    }
  });
  await adminAllFriends();
};

exports.makeRandomFriends = makeRandomFriends;
exports.generateInitialUsers = generateInitialUsers;
exports.generateInitialPokemonCards = generateInitialPokemonCards;
