import AddressModel from "../Models/addressModels.js";
import Usermodel from "../Models/userModels.js";

export const AddressController= async(req,res)=>{
try {
    const{address_line,city,mobile,pincode,country,state,status} =req.body
    const userId =req.user._id

    console.log('User id is here',userId)
    if(!address_line || !city || !mobile || !pincode || !country || !state){

        return res.status(500).json({
            message: "All fields are required",
            error:true,
            success:false
        })
    }
    const validStatus = (status === "true" || status === true) ? true : false;
    const address =new AddressModel({
        address_line,
        city,
        mobile,
        pincode,
        country,
        state, 
        status:validStatus,
        userId
    })
    
    const savedAddress= await address.save();
   
    
            await Usermodel.findByIdAndUpdate(userId,{
                $push :{
                    address_details : savedAddress?._id
                }
            })

            // 4. Populate the addresses if needed
   const userWithAddresses = await Usermodel.findById(userId).populate('address_details');
   console.log('the value is here' ,userWithAddresses )
            return res.status(200).json({
                data:userWithAddresses,
                message: "Address added successfully",
                error:false,
                success:true
            })

          

} catch (error) {
    
    return res.status(500).json({
        message: error.message||error,
        error:true,
        success:false
    })

}
    

}

export const getAddressByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
        console.log("GET address hit for userId:", userId);

      const address = await AddressModel.findOne({ userId });
  
      if (!address) {
        return res.status(404).json({ success: false, message: "Address not found" });
      }
  
      res.status(200).json({ success: true, address });
    } catch (error) {
      console.error("Error fetching address:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };