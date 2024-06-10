import CustomError from "./CustomError";

class ObjectNotFound extends Error {
   constructor(message: string) {
      super(message || "Object not found");
   }
}

export default ObjectNotFound;
