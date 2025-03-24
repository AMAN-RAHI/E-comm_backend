import mylistModel from '../Models/myListModels.js'



export  const addtomyList = async (req,res) => {
    try {
        const { userId,productId, productTitle, image,ratings, oldPrice, Price,discount,brand } =req.body

        const item = await mylistModel.findOne({
            userId:userId,
            productId:productId
        })

        if(item) return res.status(400).json({
            message:'the item is already in myList'
        })

        const myList = new mylistModel({
            userId,
            productId,
            productTitle, 
            image,
            ratings, 
            oldPrice,
            Price,
            discount,
            brand
        });

        await myList.save()

        return res.status(200).json({
            success:true,
            message:'the item is added to MyList',
            myList
        })


    } catch (error) {
        console.log('server error', error)
        return res.status(500).json({
            message:error.message|| 'Internal server error',
            success : false
        })
    }
    
} 

//get route for all items
export const getmyListitems = async(req,res)=>{
    try {
        const{userId} = req.params;
        const items =await mylistModel.find({
            userId:userId
        }).populate('productId')

        if(!items) return res.status(404).json({
            success:false,
            message:"the item is not present in myList"
        })

        return res.status(200).json({
            success:true,
            message:'myList items',
            items

        })
    } catch (error) {
        console.log('server error',error),
        res.status(500).json({
           message:error.message || 'Internal server error',
            success:false,

        })
    }
}

//delete the myList item controller
export const deletemyListitems = async(req,res)=>{
    try{
        
      const item = await mylistModel.findById(req.params.id)
      if(!item) return res.status(404).json({
        success:false,
        message :"the item is not found in myList"
      })

      await mylistModel.findByIdAndDelete(req.params.id)

      return res.status(200).json({
        success:true,
        message:"the item is deleted successfully",
        item
      })
    }
    catch(error){
console.log('server error',error),
res.status(404).json({
    success:false,
    message:error.message || 'Internal server error',

})
    }
}