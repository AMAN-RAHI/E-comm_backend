 
 import crypto from "crypto";
 const generateSignature = (paramsToSign) => {
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");
  
    return crypto
      .createHash("sha1")
      .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");
  };

  export default generateSignature