import { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModule";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Pagination } from "../../utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
    
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOFBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {

        const fetchBooks = async() => {
            const url: string = `${process.env.REACT_APP_API}/books?page=${currentPage - 1}&size=${booksPerPage}`
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;
            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);
            const loadedBooks: BookModel[] = [];

            for(const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        }
        
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookDelete]);

    if(isLoading)
        return <SpinnerLoading></SpinnerLoading>;

    if(httpError) {
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOFBooks ? booksPerPage * currentPage : totalAmountOFBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => {
        setBookDelete(!bookDelete);
    }

    return (
        <div className="container mt-5">
            {totalAmountOFBooks > 0
                ?
                <>
                    <div className="mt-3">
                        <h3>No of results: ({totalAmountOFBooks})</h3>
                    </div>
                    <p>{indexOfFirstBook + 1} to {lastItem} of {totalAmountOFBooks} items:</p>
                    {books.map(book => (
                        <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}></ChangeQuantityOfBook>
                    ))}
                </>
                :
                <h5>Add a book before changing quantity.</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
        </div>
    );
}