import type { Author } from "./Author";

export class Book {
    private title: string;
    private author: Author;
    private year: number;
    private pageCount: number;

    constructor(title: string, author: Author, year: number, pageCount: number) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.pageCount = pageCount;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAuthor(): Author {
        return this.author;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public toString(): string {
        return `"${this.title}" (${this.year}) by ${this.author.getFullName()} - ${this.pageCount} pages`;
    }
}
