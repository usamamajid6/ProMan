const User = require("../Schemas/UserSchema");
const bcrypt = require("bcryptjs");
const generatePassword = require("password-generator");

const isEmailUnique = async (email) => {
  try {
    const result = await User.findOne({ email });
    return result;
  } catch (e) {
    console.log("Error in isEmailUnique method.", e);
    return e;
  }
};

const getLastId = async () => {
  try {
    const result = await User.find().sort({ _id: -1 }).limit(1);
    if (result.length === 0) {
      return 0;
    } else {
      return result[0]._id;
    }
  } catch (e) {
    console.log("Error while getting last Last ID.", e);
    return e;
  }
};

const registerUser = async (name, email, password, phone_number) => {
  console.log("------------------------------");
  console.log(name);
  console.log("------------------------------");
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    // let _id=1;
    password = await bcrypt.hash(password, 10);
    const user = new User({
      _id,
      name,
      email,
      password,
      phone_number,
    });
    try {
      const result = await User.create(user);
      return result;
    } catch (e) {
      console.log("Problem in Adding New User.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New User.", e);
    return e;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await await User.findOne({ email });
    ("");
    if (user) {
      try {
        //user email found
        const hashPassword = user.password;
        const comparePasswordResult = await bcrypt.compare(
          password,
          hashPassword
        );
        if (comparePasswordResult) {
          //Password Matches
          return user;
        } else {
          //Password didn't match
          return comparePasswordResult;
        }
      } catch (e) {
        console.log("Problem in Comparing Hash Password.", e);
        return e;
      }
    } else {
      //user email not exists
      return false;
    }
  } catch (e) {
    console.log("Problem in loginUser.", e);
    return e;
  }
};

const getUser = async (_id) => {
  try {
    const user = await User.findOne({ _id: parseInt(_id) });
    return user;
  } catch (e) {
    console.log("Problem in getUser", e);
    return e;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (e) {
    console.log("Problem in getUserByEmail", e);
    return e;
  }
};

const updateUser = async (_id, name, phone_number) => {
  try {
    const user = await User.updateOne(
      { _id },
      {
        name,
        phone_number,
      }
    );
    return user;
  } catch (e) {
    console.log("Problem in updateUser", e);
    return e;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (e) {
    console.log("Problem in getAllUsers", e);
    return e;
  }
};

//No need for that method
const addProject = async (_id, project_id) => {
  try {
    const result = await User.updateOne(
      { _id },
      { $push: { projects: project_id } }
    );
    return result;
  } catch (e) {
    console.log("Problem in getAllUsers", e);
    return e;
  }
};
//updateTotalTasksAndEfficiencyScore
const updateTTAES = async (_id, efficiency_score) => {
  try {
    _id = parseInt(_id);
    efficiency_score = parseInt(efficiency_score);
    const result = await User.updateOne(
      { _id },
      {
        $inc: { efficiency_score, total_tasks: 1 },
      }
    );
    return result;
  } catch (e) {
    console.log("Problem in getAllUsers", e);
    return e;
  }
};

const registerUserGoogleFB = async (name, email) => {
  try {
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    password = await generatePassword(12, false);
    password = await bcrypt.hash(password, 10);
    const user = new User({
      _id,
      name,
      email,
      password,
    });
    try {
      const result = await User.create(user);
      return result;
    } catch (e) {
      console.log("Problem in Adding New User By Google/FB.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New User By Google/FB.", e);
    return e;
  }
};

const loginUserGoogleFB = async (email) => {
  try {
    const user = await await User.findOne({ email });
    if (user) {
      return user;
    } else {
      //user email not exists
      return false;
    }
  } catch (e) {
    console.log("Problem in loginUser.", e);
    return e;
  }
};

module.exports = {
  registerUser,
  loginUser,
  isEmailUnique,
  getUser,
  updateUser,
  getAllUsers,
  addProject,
  updateTTAES,
  registerUserGoogleFB,
  loginUserGoogleFB,
  getUserByEmail,
};
