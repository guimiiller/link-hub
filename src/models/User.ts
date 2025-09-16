import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: { 
    type: String, 
    default: '/avatars/avatar1.png' // avatar padrão
  },
  favorites: [
    {
      link: String,
      category: String,
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
