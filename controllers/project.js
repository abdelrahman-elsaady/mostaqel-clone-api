


const projectModel = require('../models/project');
const proposalModel = require('../models/proposals');
const Transaction = require('../models/Transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/users');
let createProject = async (req, res , next) => {

  let newProject = req.body;

  console.log(newProject)
  try {
    let project = await projectModel.create(newProject);



    res.status(200).json({ message: "user project successfully", data: project });
     

  } catch (err) {
    next({statusCode:404})
  }

};

let getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      minBudget,
      maxBudget,
      deliveryTime,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (minBudget || maxBudget) {
      query['budget.min'] = {};
      if (minBudget) query['budget.min'].$gte = parseInt(minBudget);
      if (maxBudget) query['budget.max'].$lte = parseInt(maxBudget);
    }

    if (deliveryTime) {
      query.deliveryTime = deliveryTime;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await projectModel.find(query)
      .populate('client', 'firstName lastName email profilePicture')
      .populate('category', 'name')
      .populate('skills', 'name')
      .populate({
        path: 'proposals',
        select: 'freelancer amount _id deliveryTime proposal status',
        populate: {
          path: 'freelancer',
          select: 'firstName lastName profilePicture'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await projectModel.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProjects: total,
        projectsPerPage: parseInt(limit)
      },
      filters: {
        search,
        category,
        status,
        minBudget,
        maxBudget,
        deliveryTime,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

let getProjectsByClient = async (req, res) => {
  let { id } = req.params;
  console.log(id)
  try {
    const projects = await projectModel.find({ client: id }).populate('client').populate('category', 'name');
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


let saveProposal = async (req, res) => {
  console.log(req.params)
  try {
    const { id } = req.params;
    const newProposal = req.body;

    const project = await projectModel.findById(id);
console.log(project)
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }


    project.proposals.push(newProposal);
    await project.save();

    res.status(201).json({ message: "Proposal added successfully", proposal: newProposal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving proposal", error: error.message });
  }
};

let getProjectById = async (req, res) => {
  let { id } = req.params;

  try {
    const project = await projectModel.findById( id ).populate('skills')
    .populate('category')
    .populate('client')
    .populate({
      path: 'proposals',
      populate: {
        path: 'freelancer',
      }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

let updateProject = async (req, res) => {
  console.log(req.body)
  console.log(req.params)
 try {
       await projectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({message:"Project updated successfully"} )
    }
      catch (error) {
      res.json({message:error.message})
}
};

let deleteProject = async (req, res) => {
  let {id}=req.params
  try{
   let project =await projectModel.findByIdAndDelete(id)

     if(project){
       res.status(200).json({messege:"deleted success"})
     }else{
      res.status(400).json({message:"project doesn't exist"})

     }
  }
  catch(err){
      res.status(400).json({message: err.message})

  }
};

let acceptProposal = async (req, res) => {
  try {
    const { projectId, proposalId,userId } = req.body;
    console.log(req.body)
    const project = await projectModel.findById(projectId).populate('client');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept proposals for this project' });
    }

    const proposal = await proposalModel.findById(proposalId)
      .populate('freelancer')
      .populate('project');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const platformFee = proposal.amount * 0.15;
    const totalAmount = proposal.amount + platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        projectId,
        proposalId,
        freelancerId: proposal.freelancer._id.toString(),
        platformFee
      }
    });

    project.status = 'pending_payment';
    project.acceptedProposal = proposalId;
    await project.save();

    await Transaction.create({
      type: 'PAYMENT',
      amount: totalAmount,
      fee: platformFee,
      status: 'PENDING',
      project: projectId,
      payer: project.client._id,
      payee: proposal.freelancer._id,
      paymentMethod: 'STRIPE',
      paymentDetails: {
        paymentIntentId: paymentIntent.id
      }
    });
    
    res.json({
      success: true,
      proposal,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Error accepting proposal:', error);
    res.status(500).json({ 
      message: 'Error accepting proposal', 
      error: error.message 
    });
  }
};


module.exports={createProject , getProjects  , getProjectById, updateProject , deleteProject, saveProposal, getProjectsByClient , acceptProposal }