







const User = require('../models/users');

const Portfolio = require('../models/portfolio');

let createPortfolio = async (req, res) => {
  
  try {
    const { title, description, freelancerId, image } = req.body;
    console.log(req.image);
    // let image = ;
    const newPortfolio = new Portfolio({
        title,
        description,
        image,
        freelancerId
      });
      // console.log(req.body);
// let data = req.body
// console.log(data);
// console.log(req.image);
// data.image = req.image.filename
    // const savedPortfolio = await newPortfolio.save();
    
          let portfolio = await Portfolio.create(newPortfolio);
          // res.json({ message: "Portfolio was created successfully", portfolio: portfolio });

    await User.findByIdAndUpdate(freelancerId, {
        $push: { portfolio: portfolio._id }
      });
  

    res.status(201).json(portfolio);
    console.log(res);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};



let getUserPortfolios = async (req, res) => {
  try {
    const { id } = req.params;
console.log(id);
    const user = await User.findById(id).populate('portfolio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user
      
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  
  
};



module.exports={createPortfolio,getUserPortfolios}