const Complaint = require('../models/Complaint');




let createComplaint = async (req, res) => {

  let newComplain = req.body;
  try {
    let saveComp = await Complaint.create(newComplain);
    res
      .status(200)
      .json({ message: "Message saved successfully", data: saveComp });
  } catch (err) {
    res.status(404).json(err.message);
  }

};

let getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



let updateComplaint = async (req, res) => {
  try {
     await Complaint.findByIdAndUpdate(req.params.id, req.body);
    res.json({message:"Complaint updated successfully"} )
  }
    catch (error) {
    res.json({message:error.message})
}
};

// Delete a complaint
let deleteComplaint = async (req, res) => {
 
  let {id}=req.params
  try{
   let Complaints =await Complaint.findByIdAndDelete(id)

     if(Complaints){
       res.status(200).json({messege:"success"})
     }else{
      res.status(400).json({message:"Complaint doesn't exist"})

     }
  }
  catch(err){
      res.status(400).json({message: err.message})

  }
};
module.exports={createComplaint , getComplaints  , updateComplaint , deleteComplaint }