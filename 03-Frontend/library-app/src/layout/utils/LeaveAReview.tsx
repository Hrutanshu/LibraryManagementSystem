import React, { useState } from "react";
import { StartsReview } from "./StarsReview";

export const LeaveAReview: React.FC<{ submitReview: any }> = (props) => {

    const[starInput, setStarInput] = useState(0);
    const[displayInput, setDisplayInput] = useState(false);
    const[reviewDescription, setReviewDescription] = useState('');

    function starValue(value: number) {
        setStarInput(value);
        setDisplayInput(true);
    }

    return (
        <div className="dropdown" style={{cursor: 'pointer'}}>
            <h5 className="dropdown-toggle" id="dropDownMenuButton1" data-bs-toggle='dropdown'>
                Leave a review?
            </h5>
            <ul id="submitReviewRating" className="dropdown-menu" aria-labelledby="dropDownMenuButton1">
                <li><button onClick={() => starValue(0)} className="dropdown-item">0 star</button></li>
                <li><button onClick={() => starValue(0.5)} className="dropdown-item">0.5 star</button></li>
                <li><button onClick={() => starValue(1)} className="dropdown-item">1 star</button></li>
                <li><button onClick={() => starValue(1.5)} className="dropdown-item">1.5 star</button></li>
                <li><button onClick={() => starValue(2)} className="dropdown-item">2 star</button></li>
                <li><button onClick={() => starValue(2.5)} className="dropdown-item">2.5 star</button></li>
                <li><button onClick={() => starValue(3)} className="dropdown-item">3 star</button></li>
                <li><button onClick={() => starValue(3.5)} className="dropdown-item">3.5 star</button></li>
                <li><button onClick={() => starValue(4)} className="dropdown-item">4 star</button></li>
                <li><button onClick={() => starValue(4.5)} className="dropdown-item">4.5 star</button></li>
                <li><button onClick={() => starValue(5)} className="dropdown-item">5 star</button></li>
            </ul>
            <StartsReview rating={starInput} size={32}></StartsReview>
            {displayInput && 
                <form action="#" method="POST">
                    <hr />
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea id="submitReviewDescription" placeholder="Optional" className="form-control" 
                            rows={3} onChange={e => setReviewDescription(e.target.value)}></textarea>
                    </div>
                    <button onClick={() => props.submitReview(starInput, reviewDescription)} className="btn btn-primary mt-3" type="button">Submit Review</button>
                </form>
            }
        </div>
    );
}