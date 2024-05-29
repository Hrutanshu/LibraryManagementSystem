import { useEffect, useState } from "react";
import ReviewModel from "../../../Models/ReviewModule";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Review } from "../../utils/Review";
import { Pagination } from "../../utils/Pagination";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBookReviews = async() => {

            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok)
                throw new Error("Something went wrong!!");

            const responseJsonReviews = await responseReviews.json();
            const responseDataReviews = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];
            for(const key in responseDataReviews) {
                loadedReviews.push({
                    id: responseDataReviews[key].id,
                    userEmail: responseDataReviews[key].userEmail,
                    date: responseDataReviews[key].date,
                    rating: responseDataReviews[key].rating,
                    bookId: responseDataReviews[key].bookId,
                    reviewDescription: responseDataReviews[key].reviewDescription
                })
            };

            if(loadedReviews) {
                setReviews(loadedReviews);
                setIsLoading(false);
            }
        }
        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    if(isLoading)
        return <SpinnerLoading />

    if(httpError)
        return <div className="container m-5"><p>{httpError}</p></div>

    const indexOfLastReview: number = (currentPage) * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
                <p>{indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:</p>
                <div className="row">
                    {reviews.map(review => (
                        <Review review={review} key={review.id} />
                    ))}
                </div>
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}