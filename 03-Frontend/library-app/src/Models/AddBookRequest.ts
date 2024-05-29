class AddBookRequest {
    title: string;
    author: string;
    description: string;
    copies: number;
    category: string;
    img?: string;

    constructor(title: string, author: string, description: string, copies: number, category: string) {
        this.author = author;
        this.category = category;
        this.title = title;
        this.description = description;
        this.copies = copies;
    }
}

export default AddBookRequest;