const { User } = require('../associations');
const Company = require('../models/companyModel')
const Invitation = require('../models/invitation')
const crypto = require('crypto');



module.exports.createCompany = async(req,res) => { 
    const {company_name,address} = req.body
    try {
        const company = await Company.create({
            company_name,
            address
        });
        res.status(201).json({
            data: company,
            success: true
        });
    
    }catch(error){ 
        res.status(400).json({
            success: false,
            errormessage: error
        })
        
    }
    
}

module.exports.InvitationToCompany = async(req,res) => { 
    const { company_id } = req.params
    const { email } = req.body;
    try {
      const company = await Company.findByPk(company_id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      const token = crypto.randomBytes(20).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
  
      const invitation = await Invitation.create({
        company_id,
        email,
        token,
        expiresAt,
      });
  
      const invitationLink = `http://localhost:3000/accept-invite?token=${token}`;
  
      res.status(201).json({ message: 'Invitation sent', invitation, invitationLink });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  module.exports.getAllUsers = async(req,res) => { 
    const {company_id} = req.params
    try {
      const company = await Company.findByPk(company_id,{
        include: { 
          model: User,
          as: "users"
        }
      });
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.status(201).json({
        success: true,
        company
      })
  }catch(error) { 
    res.status(400).json({
      success: false,
      errormessage: error
    })
  }
}