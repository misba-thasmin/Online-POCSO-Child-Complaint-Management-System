const {Business} = require('../models/business');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');

// name description mechanicname service available  locality address city mobile 

router.get(`/`,  async (req, res) =>{
    const businessList = await Business.find();

    if(!businessList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(businessList);
})



router.get(`/:id`, async (req, res) =>{
    const businessList = await Business.findById(req.params.id);

    if(!businessList) {
        res.status(500).json({success: false})
    } 
    res.send(businessList);
})


router.post('/',  async (req,res)=>{
    let business = new Business({
        advocateemail: req.body.advocateemail,
        name: req.body.name,
        service: req.body.service,
        available: req.body.available,
        locality: req.body.locality,
        address: req.body.address,
        city: req.body.city,
        mobile: req.body.mobile,
        status: req.body.status,
        profilePhoto: req.body.profilePhoto || '',
        experience: req.body.experience || 0,
        barCouncilNumber: req.body.barCouncilNumber || '',
        totalCasesHandled: req.body.totalCasesHandled || 0,
        completedCases: req.body.completedCases || 0,
        successRate: req.body.successRate || '0%',
        caseTypes: req.body.caseTypes || [],
        portfolio: req.body.portfolio || []
    })
    business = await business.save();

    if(!business)
    return res.status(400).send('the business cannot be created!')
    res.send(business);
    
})



router.delete('/:id', auth, (req, res)=>{
    Business.findByIdAndRemove(req.params.id).then(business =>{
        if(business) {
            return res.status(200).json({success: true, message: 'the business is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "business not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})



router.put('/:id',async (req, res)=> {
    const business = await Business.findByIdAndUpdate(
        req.params.id,
        {        
            advocateemail: req.body.advocateemail,
            name: req.body.name,
            service: req.body.service,
            available: req.body.available,
            locality: req.body.locality,
            address: req.body.address,
            city: req.body.city,
            mobile: req.body.mobile,
            profilePhoto: req.body.profilePhoto,
            experience: req.body.experience,
            barCouncilNumber: req.body.barCouncilNumber,
            totalCasesHandled: req.body.totalCasesHandled,
            completedCases: req.body.completedCases,
            successRate: req.body.successRate,
            caseTypes: req.body.caseTypes,
            portfolio: req.body.portfolio
        },
        { new: true}
    )

    if(!business)
    return res.status(400).send('the business cannot be created!')

    res.send(business);
})




router.put('/map/:id',async (req, res)=> {
    const business = await Business.findByIdAndUpdate(
        req.params.id,
        {        
            lat: req.body.lat,
            long: req.body.long
        },
        { new: true}
    )

    if(!business)
    return res.status(400).send('the business cannot be created!')

    res.send(business);
})



router.put('/status/:id', auth, async (req, res)=> {
    const business = await Business.findByIdAndUpdate(
        req.params.id,
        {        
            status: req.body.status
        },
        { new: true}
    )

    if(!business)
    return res.status(400).send('the business cannot be created!')

    res.send(business);
})


module.exports =router;