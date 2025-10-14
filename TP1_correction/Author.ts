export class Author {
    private firstName: string;
    private lastName: string;
    private nationality: string;

    constructor(firstName: string, lastName: string, nationality: string = "unknown") {
        this.firstName = firstName;
        this.lastName = lastName;
        this.nationality = nationality;
    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    
    public getNationality(): string {
        return this.nationality;
    }
}
