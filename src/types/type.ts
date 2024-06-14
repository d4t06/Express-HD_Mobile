export type Sort = {
   enable: boolean,
   type: 'DESC' | 'ASC',
   column: 'price' | ''
}

export type UserSchema = {
   username: string;
   password: string;
   role: string;
};
