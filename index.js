import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";


const app = express();
const port = process.env.PORT || 4100;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  // In-memory data store
  const post = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    author: String,
    date: Date,
  });
  const Post = mongoose.model("Post", post);
  let posts = [
    {
      id: 1,
      title: "The Rise of Decentralized Finance",
      content:
        "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
      author: "Alex Thompson",
      date: "2023-08-01T10:00:00Z",
    },
    {
      id: 2,
      title: "The Impact of Artificial Intelligence on Modern Businesses",
      content:
        "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
      author: "Mia Williams",
      date: "2023-08-05T14:30:00Z",
    },
    {
      id: 3,
      title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
      content:
        "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
      author: "Samuel Green",
      date: "2023-08-10T09:15:00Z",
    },
  ];
  await Post.insertMany(posts)
    .then(function(){console.log("success in inserting")})
    .catch(function(err){console.log(err);})
  let lastId = 3;
  //Middleware

  //GET all Posts

  app.get("/posts", async(req, res) => {
    try{
    const foundPosts = await Post.find({});
    res.json(foundPosts);
    }catch(error){
      console.log(error);
      res.status(404).json({ message: "Posts not found" });

    }
  });

  app.get("/posts/:id", async(req, res) => {
    try{
      const foundPost = await Post.findOne({id :parseInt(req.params.id)});
      res.json(foundPost);
    }catch(error){
      console.log(error)
      res.status(404).json({ message: "Post not found" });
    }
    
  });

  app.post("/posts", async(req, res) => {
    try{
      const newId = lastId + 1;
      const post = new Post({
      id: newId,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      date: new Date()
    });
    lastId = newId;
    await post.save();
    res.status(201).json(post);
    }catch(error){
      console.log(error)
      res.status(500).json({ message: "Post could not be Added" });
    }
    
  });

  app.patch("/posts/:id",async (req, res) => {
    try{
    const updatedPost = await Post.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      {
        $set: {
          id : req.body.id || id,
          title: req.body.title || title,
          content: req.body.content || content,
          author: req.body.author || author,
          date: new Date(),
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
    
  });



  app.delete("/posts/:id", async(req, res) => {
    try {
      const postId = parseInt(req.params.id);
  
      // Use findOneAndDelete to find the document by ID and delete it
      const deletedPost = await Post.findOneAndDelete({ id: postId });
  
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });




  app.listen(port, () => {
    console.log(`Here is Ur Api Running on Port No. ${port}`);
  });
}
