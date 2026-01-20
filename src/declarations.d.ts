declare module "@FIAP/util" {
  export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
  }

  export function saveUserProfile(user: UserProfile): void;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
