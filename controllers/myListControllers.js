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