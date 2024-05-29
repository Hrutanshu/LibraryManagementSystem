import { Link } from "react-router-dom";
import BookModel from "../../Models/BookModule";
import { LeaveAReview } from "../utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{book: BookModel | undefined, mobile: boolean, currentLoansCount: number,
    isAuthenticated: any, isCheckedOut: boolean, checkOutBook: any, isReviewLeft: boolean, submitReview: any
}> = (props) => {

    function buttonRender() {
        if(props.isAuthenticated) {
            if(!props.isCheckedOut && props.currentLoansCount < 5) {
                return (<button className="btn btn-success btn-lg" onClick={() => props.checkOutBook()}>Check Out</button>);
            }
            else if(props.isCheckedOut) {
                return (<p><b>Book Checkedout. Enjoy!</b></p>);
            }
            else if(!props.isCheckedOut) {
                return (<p className="text-danger">Too many books checked out.</p>);
            }
        }
        else {
            return (<Link to="/login" className="btn btn-success btn-lg">Sign In</Link>)
        }
    }

    function reviewRender() {
        if(props.isAuthenticated && !props.isReviewLeft) {
            return (<LeaveAReview submitReview={props.submitReview}></LeaveAReview>)
        }
        else if(props.isAuthenticated && props.isReviewLeft) {
            return (<p><b>Thank you for your review!</b></p>)
        }
        return (<div><hr/><p>Sign in to leave areview</p></div>)
    }

    return(
        <div className={props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        Books checked out    
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable ? 
                        <h4 className="text-success"> Available</h4> :
                        <h4 className="text-danger">Wait list</h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b>
                            available
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />
                <p className="mt-3">This number can change until placing order has changed.</p>
                {reviewRender()}
            </div>
        </div>
    );
}