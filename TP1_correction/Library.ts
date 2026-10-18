import { Book } from "./Book.js";
import type { Query } from "./Query.js"; // Changer l'import pour aller chercher dans le dossier types

export class Library {
    public books: Book[];

    constructor() {
        this.books = [];
    }

    public addBooks(book: Book): void;
    public addBooks(books: Book[]): void;

    public addBooks(param: Book | Book[]): void {
        if (Array.isArray(param)) {
            this.books.push(...param);
        } else {
            this.books.push(param);
        }
    }

    public static isLibraryOpen(): boolean {
        return new Date().getUTCDay() !== 0;
    }

    public getBooksByAuthorName(query: Query): Book[] {
        let result = this.books.filter(
            (book) => book.getAuthor().getFullName() === query.authorName
        );

        // Gestion du tri
        if (query.order) {
            result = result.sort((a, b) =>
                a.getTitle().localeCompare(b.getTitle())
            );

            if (query.order === "desc") {
                result = result.reverse();
            }
        }

        // Gestion de la limite
        if (query.limit !== undefined) {
            result = result.slice(0, query.limit);
        }

        return result;
    }
}
