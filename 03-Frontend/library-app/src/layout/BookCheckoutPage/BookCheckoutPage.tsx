import { useEffect, useState } from "react";
import BookModel from "../../Models/BookModule";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StartsReview } from "../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModule";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../Models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingLoansCount, setIsLoadingLoansCount] = useState(true);
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    const [displayError, setDisplayError] = useState(false);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async() => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

            const response = await fetch(baseUrl);
            if(!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            };

            setBook(loadedBook);
            setIsLoading(false);
        }
        
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async() => {

            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok)
                throw new Error("Something went wrong!!");

            const responseJsonReviews = await responseReviews.json();
            const responseDataReviews = responseJsonReviews._embedded.reviews;
            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;
            for(const key in responseDataReviews) {
                loadedReviews.push({
                    id: responseDataReviews[key].id,
                    userEmail: responseDataReviews[key].userEmail,
                    date: responseDataReviews[key].date,
                    rating: responseDataReviews[key].rating,
                    bookId: responseDataReviews[key].bookId,
                    reviewDescription: responseDataReviews[key].reviewDescription
                })
                weightedStarReviews = weightedStarReviews + responseDataReviews[key].rating;
            };

            if(loadedReviews) {
                const round = ((Math.round(weightedStarReviews / loadedReviews.length * 2)) / 2).toFixed(1);
                setTotalStars(Number(round));
                setReviews(loadedReviews);
                setIsLoadingReview(false);
            }
        }
        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft])

    useEffect(() => {
        const fetchUserReview = async() => {
            if(authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: new Headers({
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    })
                };
                const userReview = await fetch(url, requestOptions);
                if(!userReview.ok)
                    throw new Error('Something went wrong.')
                const userReviewJson = await userReview.json();
                setIsReviewLeft(userReviewJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReview().catch((error: any) => {
            setIsLoadingUserReview(false)
            setHttpError(error.message)
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async() => {
            if(authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/currentLoan/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: new Headers({
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    })
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if(!currentLoansCountResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchuserCheckedOutBook = async() => {
            if(authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/isCheckedout/byUser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: new Headers({
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    })
                }
                const bookCheckedOut = await fetch(url, requestOptions);
                if(!bookCheckedOut.ok)
                    throw new Error("Something went wrong");
                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchuserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if(isLoading || isLoadingReview || isLoadingLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return(
            <SpinnerLoading></SpinnerLoading>
        )
    }

    if(httpError) {
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: new Headers({
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            })
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if(!checkoutResponse.ok) {
            setDisplayError(true);
            return;
        }
        setDisplayError(false);
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: String) {
        let bookId:number = 0
        if(book?.id)
            bookId = book.id;
        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok) 
            throw new Error('Something went wrong');
        setIsReviewLeft(true);
    }

    return(
        <div>
            <div className="container d-none d-lg-block">
                {displayError && 
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                }
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} alt="Book" width="226" height="349" /> :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} alt="Book" width="226" height="349" />
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StartsReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkOutBook={checkoutBook}
                        isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className="container d-lg-none mt-5">
                {displayError && 
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                }
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} alt="Book" width="226" height="349" /> :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} alt="Book" width="226" height="349" />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StartsReview rating={totalStars} size={32}/>
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkOutBook={checkoutBook}
                    isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}