import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router";
import { AdminMessages } from "./Components/AdminMessages";
import { AddNewBook } from "./Components/AddNewBook";
import { ChangeQuantityOfBooks } from "./Components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {

    const {authState} = useOktaAuth();
    const [changeQuantityOfBooksClicked, setChangedQuantityOfBooksClicked] = useState(false);
    const [messagesClicked, setMessagesClicked] = useState(false);

    function addBookClicked() {
        setChangedQuantityOfBooksClicked(false);
        setMessagesClicked(false);
    }

    function changeQuantityClicked() {
        setChangedQuantityOfBooksClicked(true);
        setMessagesClicked(false);
    }

    function messagesTabClicked() {
        setChangedQuantityOfBooksClicked(false);
        setMessagesClicked(true);
    }

    if(authState?.accessToken?.claims.userType === undefined)
        return <Redirect to="/home"></Redirect>

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab" 
                            data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                            aria-selected="false" onClick={addBookClicked}>Add new book</button>

                        <button className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab" 
                            data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity"
                            aria-selected="true" onClick={changeQuantityClicked}>Change quantity</button>

                        <button className="nav-link" id="nav-messages-tab" data-bs-toggle="tab" 
                            data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                            aria-selected="false" onClick={messagesTabClicked}>Messages</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel" aria-labelledby="nav-add-book-tab">
                        <AddNewBook></AddNewBook>
                    </div>
                    <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                        {changeQuantityOfBooksClicked ? <ChangeQuantityOfBooks></ChangeQuantityOfBooks> : <></> }
                    </div>
                    <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                        {messagesClicked ? <AdminMessages></AdminMessages> : <></> }
                    </div>
                </div>
            </div>
        </div>
    );
}