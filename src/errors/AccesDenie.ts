class AccessDenied extends Error {
   constructor(message: string) {
      super(
         message ||
            "Insufficient privilege or the access token provided is expired, revoked"
      );
   }
}

export default AccessDenied;
