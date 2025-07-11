export class CreateContactRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  userId: string;
}

export class UpdateContactRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
}

export class ContactResponse {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  userId?: string;
  user?: {
    username: string;
    name: string;
  };
}
