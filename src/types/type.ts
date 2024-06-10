export type Sort = {
   enable: boolean,
   type: 'desc' | 'asc',
   column: 'price' | ''
}

export type UserSchema = {
   username: string;
   password: string;
   role: string;
};
