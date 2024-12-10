class BadRequest extends Error {
   constructor(message: string) {
      super(message || "Bad request");
   }
}

export default BadRequest;
