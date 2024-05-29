import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModule from "../../../Models/MessageModule";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Pagination } from "../../utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../Models/AdminMessageRequest";

export const AdminMessages = () => {

    const {authState} = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [messages, setMessages] = useState<MessageModule[]>([]);
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [btnSubmit, setBtnSubmit] = useState(false);
    
    useEffect(() => {
        const fetchUserMessages = async() => {
            if(authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if(!messagesResponse.ok) 
                    throw new Error('Something went wrong!');
                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0)
    }, [authState, currentPage, btnSubmit]);

    if(isLoadingMessages)
        return (<SpinnerLoading></SpinnerLoading>);

    if(httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        if(authState && authState.isAuthenticated && id !== null && response !== '') {
            const messageAdminRequest: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequest)
            };
            const messageAdminRequestResponse = await fetch(url, requestOptions);
            if(!messageAdminRequestResponse.ok)
                throw new Error('Something went wrong!');
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-3">
            {messages.length > 0
                ?
                <>
                    <h5>Pending Q/A</h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}></AdminMessage>
                    ))}
                </>
                :
                <h5>No Pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
        </div>
    );
}