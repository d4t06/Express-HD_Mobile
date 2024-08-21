class BadRequest extends Error {
   constructor(message: string) {
      super(message || "bad request");
   }
}

export default BadRequest;
