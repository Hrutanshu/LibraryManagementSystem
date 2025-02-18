import { useState } from "react";
import { PostNewMessage } from "./components/PostNewMessage";
import { Messages } from "./components/Messages";

export const MessagePage = () => {

    const [messagesClicked, setMessagesClicked] = useState(false);

    return (
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tab-list">
                        <button onClick={() => setMessagesClicked(false)} className="nav-link active" id="nav-send-message-tab"
                            data-bs-toggle="tab" data-bs-target="#nav-send-message" type="button" role="tab" 
                            aria-controls="nav-send-message" aria-selected="true">Submit question</button>
                        <button onClick={() => setMessagesClicked(true)} className="nav-link" id="nav-message-tab" 
                            data-bs-toggle="tab" data-bs-target="#nav-message" type="button" role="tab" aria-controls="nav-message"
                            aria-selected="false">Q/A Response/Pending</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-send-message" role="tabpanel" aria-labelledby="nav-send-message-tab">
                        <PostNewMessage></PostNewMessage>
                    </div>
                    <div className="tab-pane fade" id="nav-message" role="tabpanel" aria-labelledby="nav-message-tab">
                        {messagesClicked 
                        ?
                        <Messages></Messages>
                        :
                        <></> 
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}