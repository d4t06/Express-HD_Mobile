class Unauthorized extends Error {
    constructor(message: string) {
       super(
          message ||
             "Unauthorized"
       );
    }
 }
 
 export default Unauthorized;
 