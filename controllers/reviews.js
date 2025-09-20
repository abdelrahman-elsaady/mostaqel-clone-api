const reviewsModel = require('../models/reviews')



let getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await reviewsModel.find({ recipient: userId })
      .populate('reviewer', 'firstName lastName profilePicture')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalReviews = await reviewsModel.countDocuments({ recipient: userId });

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};










let showReviews = async(req,res)=>{

  try{
        let users = await reviewsModel.find()
    res.status(200).json({message:"success" , users})
    }catch(err){
        res.status(404).json(err)
  }

}

let saveReviews = async(req , res)=>{
    let newCategories= req.body
    console.log(newCategories)
    try{
        let savedUser = await reviewsModel.create(newCategories)
        res.status(200).json({message:"reviews saved successfully" , data : savedUser})
// console.log(res)
    }catch(err){
        res.status(404).json(err.message)
    }
}

let updatereviewsById=async(req,res)=>{
  
    try {
      let updateReview = await reviewsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({message:"category updated successfully"} )
    }
      catch (error) {
      res.json({message:error.message})
}
}


let deleteReviews= async (req,res )=>{

  let {id}=req.params
  try{
   let reviews =await reviewsModel.findByIdAndDelete(id)

     if(reviews){
       res.status(200).json({messege:"success"})
     }else{
      res.status(400).json({message:"category doesn't exist"})

     }
  }
  catch(err){
      res.status(400).json({message: err.message})

  }

  }


module.exports={showReviews , saveReviews,deleteReviews,updatereviewsById,getUserReviews}
