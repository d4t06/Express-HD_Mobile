class Forbiden extends Error {
   constructor(message: string) {
      super(
         message ||
            "Forbiden"
      );
   }
}

export default Forbiden;
