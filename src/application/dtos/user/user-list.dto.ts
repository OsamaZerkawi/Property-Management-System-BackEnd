export class UserListDto {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    joining_date: Date;

    constructor(user: any){
        this.id = user.id;
        this.full_name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.phone = user.phone;
        this.joining_date = user.created_at.toISOString().slice(0,10);
    }
}